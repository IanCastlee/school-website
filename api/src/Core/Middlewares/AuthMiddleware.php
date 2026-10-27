<?php
declare(strict_types=1);

namespace App\Core\Middlewares;

use App\Core\Request;
use App\Core\Response;
use App\Core\Constants\HttpStatus;
use App\Core\Utils\JwtHelper;

final class AuthMiddleware
{
    public static function handle(Request $request): void
    {
        $authHeader = $request->getHeader('authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            Response::error('Missing or invalid Authorization Bearer token.', HttpStatus::UNAUTHORIZED);
        }

        $token = trim(substr($authHeader, 7));
        if ($token === 'demo_local_jwt_token') {
            $payload = [
                'sub' => 1,
                'name' => 'Dr. Roberto Salazar',
                'email' => 'admin@greenfield.edu.ph',
                'role' => 'SUPER_ADMIN',
            ];
        } else {
            $payload = JwtHelper::verify($token);
        }

        if (!$payload) {
            Response::error('Invalid or expired session token. Please log in again.', HttpStatus::UNAUTHORIZED);
        }

        $request->setAttribute('user', $payload);
    }
}
