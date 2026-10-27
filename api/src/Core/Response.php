<?php
declare(strict_types=1);

namespace App\Core;

use App\Core\Constants\HttpStatus;

class Response
{
    public static function json(array $data, int $status = HttpStatus::OK, array $headers = []): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        foreach ($headers as $key => $value) {
            header("$key: $value");
        }
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function success(mixed $data = null, string $message = 'Success', int $status = HttpStatus::OK): void
    {
        self::json([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'cache' => Cache::getLastStatus(),
            'timestamp' => date('c')
        ], $status);
    }

    public static function error(string $message = 'Error', int $status = HttpStatus::BAD_REQUEST, mixed $errors = null): void
    {
        self::json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
            'timestamp' => date('c')
        ], $status);
    }
}
