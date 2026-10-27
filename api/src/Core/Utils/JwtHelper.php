<?php
declare(strict_types=1);

namespace App\Core\Utils;

final class JwtHelper
{
    public static function generate(array $payload, int $expirationMinutes = 1440): string
    {
        $secret = $_ENV['JWT_SECRET'] ?? 'gnhs_pro_classic_institutional_jwt_secret_key_2025';
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);

        $payload['iat'] = time();
        $payload['exp'] = time() + ($expirationMinutes * 60);
        $payloadEncoded = json_encode($payload);

        $base64UrlHeader = self::base64UrlEncode((string)$header);
        $base64UrlPayload = self::base64UrlEncode((string)$payloadEncoded);

        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
        $base64UrlSignature = self::base64UrlEncode($signature);

        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    public static function verify(string $token): ?array
    {
        $secret = $_ENV['JWT_SECRET'] ?? 'gnhs_pro_classic_institutional_jwt_secret_key_2025';
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        [$header, $payload, $signature] = $parts;

        $validSignature = self::base64UrlEncode(
            hash_hmac('sha256', $header . "." . $payload, $secret, true)
        );

        if (!hash_equals($validSignature, $signature)) {
            return null;
        }

        $decodedPayload = json_decode(self::base64UrlDecode($payload), true);
        if (!$decodedPayload || (isset($decodedPayload['exp']) && $decodedPayload['exp'] < time())) {
            return null;
        }

        return $decodedPayload;
    }

    private static function base64UrlEncode(string $data): string
    {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($data));
    }

    private static function base64UrlDecode(string $data): string
    {
        $remainder = strlen($data) % 4;
        if ($remainder) {
            $data .= str_repeat('=', 4 - $remainder);
        }
        return (string)base64_decode(str_replace(['-', '_'], ['+', '/'], $data));
    }
}
