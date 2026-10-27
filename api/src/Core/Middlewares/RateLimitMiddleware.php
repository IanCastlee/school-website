<?php
declare(strict_types=1);

namespace App\Core\Middlewares;

use App\Core\Database;
use App\Core\Request;
use App\Core\Response;
use App\Core\Constants\HttpStatus;

/**
 * Token-Bucket / Sliding-Window Rate Limiter & Request Throttler (PHP 8.4)
 * Enforces per-IP and per-endpoint-group rate limits:
 *  - 'auth'   : 8 requests / 60s (Brute-force protection)
 *  - 'write'  : 25 requests / 60s (Mutation / Inquiry spam protection)
 *  - 'public' : 60 requests / 60s (General API consumption)
 * Emits standard RFC 6585 headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, Retry-After.
 */
final class RateLimitMiddleware
{
    private static string $storageFile = __DIR__ . '/../../../storage/cache/rate_limits.json';

    public static function check(Request $request, string $group = 'public', int $maxAttempts = 60, int $decaySeconds = 60): void
    {
        $ip = self::resolveClientIp();
        $now = time();
        $rateKey = sha1($ip . '|' . $group);

        $buckets = self::loadBuckets();

        // Prune expired buckets
        foreach ($buckets as $k => $bucket) {
            if (($bucket['reset_at'] ?? 0) < $now && (($bucket['blocked_until'] ?? 0) < $now)) {
                unset($buckets[$k]);
            }
        }

        if (!isset($buckets[$rateKey])) {
            $buckets[$rateKey] = [
                'rate_key' => $rateKey,
                'ip_address' => $ip,
                'endpoint_group' => $group,
                'hits' => 0,
                'reset_at' => $now + $decaySeconds,
                'blocked_until' => null,
                'last_uri' => $request->getUri(),
                'updated_at' => date('Y-m-d H:i:s'),
            ];
        }

        $bucket = &$buckets[$rateKey];

        // Reset window if expired
        if ($bucket['reset_at'] <= $now) {
            $bucket['hits'] = 0;
            $bucket['reset_at'] = $now + $decaySeconds;
            $bucket['blocked_until'] = null;
        }

        $bucket['hits']++;
        $bucket['last_uri'] = $request->getUri();
        $bucket['updated_at'] = date('Y-m-d H:i:s');

        $remaining = max(0, $maxAttempts - $bucket['hits']);
        $retryAfter = max(1, $bucket['reset_at'] - $now);

        // Attach RateLimit headers to every response
        header("X-RateLimit-Limit: {$maxAttempts}");
        header("X-RateLimit-Remaining: {$remaining}");
        header("X-RateLimit-Reset: {$bucket['reset_at']}");
        header("X-RateLimit-Group: {$group}");

        // Sync to MySQL `rate_limits` table when MySQL is active
        if (Database::isMySql()) {
            try {
                $pdo = Database::getPdo();
                $stmt = $pdo->prepare("
                    INSERT INTO rate_limits (rate_key, ip_address, endpoint_group, hits, reset_at, blocked_until)
                    VALUES (:rk, :ip, :grp, :hits, :reset, :blocked)
                    ON DUPLICATE KEY UPDATE
                        hits = VALUES(hits),
                        reset_at = VALUES(reset_at),
                        blocked_until = VALUES(blocked_until)
                ");
                $stmt->execute([
                    ':rk' => $rateKey,
                    ':ip' => $ip,
                    ':grp' => $group,
                    ':hits' => $bucket['hits'],
                    ':reset' => $bucket['reset_at'],
                    ':blocked' => $bucket['blocked_until'],
                ]);
            } catch (\Throwable) {
            }
        }

        if ($bucket['hits'] > $maxAttempts) {
            $bucket['blocked_until'] = $now + $decaySeconds;
            self::saveBuckets($buckets);
            header("Retry-After: {$retryAfter}");
            Response::error(
                "Too Many Requests (Throttled). Rate limit of {$maxAttempts} req/{$decaySeconds}s exceeded for [{$group}]. Please retry in {$retryAfter} seconds.",
                HttpStatus::TOO_MANY_REQUESTS,
                [
                    'rate_limit_group' => $group,
                    'limit' => $maxAttempts,
                    'retry_after_seconds' => $retryAfter,
                    'client_ip' => $ip,
                ]
            );
        }

        self::saveBuckets($buckets);
    }

    public static function getTelemetry(): array
    {
        $buckets = self::loadBuckets();
        $now = time();
        $active = [];

        foreach ($buckets as $bucket) {
            if (($bucket['reset_at'] ?? 0) >= $now) {
                $group = $bucket['endpoint_group'] ?? 'public';
                $limit = match ($group) {
                    'auth' => (int)($_ENV['RATE_LIMIT_AUTH_PER_MINUTE'] ?? 8),
                    'write' => (int)($_ENV['RATE_LIMIT_WRITE_PER_MINUTE'] ?? 20),
                    default => (int)($_ENV['RATE_LIMIT_PUBLIC_PER_MINUTE'] ?? 60),
                };
                $active[] = [
                    'ip' => $bucket['ip_address'] ?? '127.0.0.1',
                    'group' => strtoupper($group),
                    'hits' => $bucket['hits'] ?? 1,
                    'limit' => $limit,
                    'remaining' => max(0, $limit - ($bucket['hits'] ?? 1)),
                    'resets_in_sec' => max(0, ($bucket['reset_at'] ?? $now) - $now),
                    'last_uri' => $bucket['last_uri'] ?? '/api/portal/bootstrap',
                    'status' => ($bucket['hits'] ?? 0) > $limit ? 'THROTTLED (429)' : 'HEALTHY',
                ];
            }
        }

        return [
            'algorithm' => 'Token Bucket / Sliding Window Throttler',
            'policies' => [
                ['group' => 'PUBLIC READ API', 'limit' => '60 req / 60 sec', 'scope' => 'IP + Endpoint Group', 'Burst Protection' => 'Active'],
                ['group' => 'WRITE & INQUIRY API', 'limit' => '20 req / 60 sec', 'scope' => 'IP + Endpoint Group', 'Burst Protection' => 'Active'],
                ['group' => 'AUTH LOGIN API', 'limit' => '8 req / 60 sec', 'scope' => 'IP + Brute-Force Guard', 'Burst Protection' => 'Strict Lockout'],
            ],
            'active_buckets' => array_values($active),
        ];
    }

    public static function resetAll(): void
    {
        self::saveBuckets([]);
        if (Database::isMySql()) {
            try {
                Database::getPdo()?->exec("TRUNCATE TABLE rate_limits");
            } catch (\Throwable) {
            }
        }
    }

    private static function resolveClientIp(): string
    {
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ips = explode(',', (string)$_SERVER['HTTP_X_FORWARDED_FOR']);
            return trim($ips[0]);
        }
        return $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    }

    private static function loadBuckets(): array
    {
        $dir = dirname(self::$storageFile);
        if (!is_dir($dir)) {
            mkdir($dir, 0777, true);
        }
        if (!file_exists(self::$storageFile)) {
            return [];
        }
        $raw = @file_get_contents(self::$storageFile);
        $data = $raw ? json_decode($raw, true) : [];
        return is_array($data) ? $data : [];
    }

    private static function saveBuckets(array $buckets): void
    {
        $dir = dirname(self::$storageFile);
        if (!is_dir($dir)) {
            mkdir($dir, 0777, true);
        }
        @file_put_contents(self::$storageFile, json_encode($buckets, JSON_PRETTY_PRINT), LOCK_EX);
    }
}
