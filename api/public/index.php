<?php
declare(strict_types=1);

// 1. Error Reporting & PSR-4 Autoloader (PHP 8.4)
ini_set('display_errors', '0');
error_reporting(E_ALL);

spl_autoload_register(static function (string $class): void {
    $prefix = 'App\\';
    $baseDir = __DIR__ . '/../src/';
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }
    $relativeClass = substr($class, $len);
    $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';
    if (file_exists($file)) {
        require_once $file;
    }
});

// 2. Load .env Variables
$envFile = __DIR__ . '/../.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];
    foreach ($lines as $line) {
        if (str_starts_with(trim($line), '#') || !str_contains($line, '=')) {
            continue;
        }
        [$key, $value] = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($value);
    }
}

use App\Core\Router;
use App\Core\Request;
use App\Core\Response;
use App\Core\Database;
use App\Core\Middlewares\CorsMiddleware;
use App\Core\Middlewares\AuthMiddleware;
use App\Controllers\PortalController;

$_SERVER['REQUEST_METHOD'] = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$_SERVER['REQUEST_URI'] = $_SERVER['REQUEST_URI'] ?? '/api/portal/bootstrap';
$_SERVER['REMOTE_ADDR'] = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

// 3. Handle CORS & Preflight
CorsMiddleware::handle();

// 4. Initialize Router & Request
$router = new Router();
$request = new Request();

// --- Public Portal Routes (Rate Limited + Write-Through Cached) ---
$router->get('/api/health', static function (Request $req): void {
    Response::success([
        'status' => 'UP',
        'php_version' => PHP_VERSION,
        'database_driver' => Database::getDriverName(),
        'timestamp' => date('c'),
    ], 'School Portal API is healthy.');
});

$router->get('/api/portal/bootstrap', [PortalController::class, 'bootstrap']);
$router->post('/api/portal/inquiries', [PortalController::class, 'submitInquiry']);
$router->post('/api/auth/login', [PortalController::class, 'login']);

// --- Protected Admin Routes (JWT AuthMiddleware + Rate Throttling) ---
$router->group(['middleware' => [AuthMiddleware::class]], static function (Router $r): void {
    $r->get('/api/admin/overview', [PortalController::class, 'adminOverview']);
    $r->put('/api/admin/settings', [PortalController::class, 'updateSettings']);

    // Accomplishments CRUD
    $r->post('/api/admin/accomplishments', [PortalController::class, 'storeAccomplishment']);
    $r->put('/api/admin/accomplishments/{id}', [PortalController::class, 'updateAccomplishment']);
    $r->delete('/api/admin/accomplishments/{id}', [PortalController::class, 'destroyAccomplishment']);

    // School Plans / SIP Projects CRUD
    $r->post('/api/admin/projects', [PortalController::class, 'storeProject']);
    $r->put('/api/admin/projects/{id}', [PortalController::class, 'updateProject']);
    $r->delete('/api/admin/projects/{id}', [PortalController::class, 'destroyProject']);

    // Transparency Disclosures CRUD
    $r->post('/api/admin/transparency', [PortalController::class, 'storeTransparencyDoc']);
    $r->put('/api/admin/transparency/{id}', [PortalController::class, 'updateTransparencyDoc']);
    $r->delete('/api/admin/transparency/{id}', [PortalController::class, 'destroyTransparencyDoc']);

    // Stakeholder Inquiries Inbox Management
    $r->patch('/api/admin/inquiries/{id}/status', [PortalController::class, 'updateInquiryStatus']);
    $r->delete('/api/admin/inquiries/{id}', [PortalController::class, 'destroyInquiry']);

    // System Engineering Controls (Cache Flush & Rate Limit Reset)
    $r->post('/api/admin/system/flush-cache', [PortalController::class, 'flushCache']);
    $r->post('/api/admin/system/reset-ratelimits', [PortalController::class, 'resetRateLimits']);
});

// 5. Dispatch Request
try {
    $router->dispatch($request);
} catch (Throwable $e) {
    Response::error(
        'Server Error: ' . $e->getMessage(),
        500,
        ($_ENV['APP_DEBUG'] ?? 'false') === 'true' ? ['file' => $e->getFile(), 'line' => $e->getLine()] : null
    );
}
