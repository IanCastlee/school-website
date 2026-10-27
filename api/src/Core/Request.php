<?php
declare(strict_types=1);

namespace App\Core;

use App\Core\Utils\Security;

class Request
{
    private string $method;
    private string $uri;
    private array $headers;
    private array $queryParams;
    private array $body;
    private array $attributes = [];

    public function __construct()
    {
        $this->method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        $this->uri = (string)parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
        $this->headers = $this->extractHeaders();
        $this->queryParams = Security::sanitizeArray($_GET);
        $this->body = $this->parseBody();
    }

    private function extractHeaders(): array
    {
        $headers = [];
        foreach ($_SERVER as $key => $value) {
            if (str_starts_with($key, 'HTTP_')) {
                $header = strtolower(str_replace('_', '-', substr($key, 5)));
                $headers[$header] = $value;
            } elseif ($key === 'CONTENT_TYPE') {
                $headers['content-type'] = $value;
            } elseif ($key === 'CONTENT_LENGTH') {
                $headers['content-length'] = $value;
            } elseif ($key === 'HTTP_AUTHORIZATION' || $key === 'REDIRECT_HTTP_AUTHORIZATION') {
                $headers['authorization'] = $value;
            }
        }
        return $headers;
    }

    private function parseBody(): array
    {
        $contentType = $this->getHeader('content-type') ?? '';
        if (str_contains($contentType, 'application/json')) {
            $raw = file_get_contents('php://input');
            $data = $raw ? json_decode($raw, true) : [];
            return is_array($data) ? Security::sanitizeArray($data) : [];
        }

        return Security::sanitizeArray($_POST);
    }

    public function getMethod(): string { return $this->method; }
    public function getUri(): string { return $this->uri; }
    public function getHeader(string $name): ?string { return $this->headers[strtolower($name)] ?? null; }
    public function query(string $key, mixed $default = null): mixed { return $this->queryParams[$key] ?? $default; }
    public function all(): array { return array_merge($this->queryParams, $this->body); }
    public function input(string $key, mixed $default = null): mixed { return $this->body[$key] ?? $this->queryParams[$key] ?? $default; }
    public function setAttribute(string $key, mixed $value): void { $this->attributes[$key] = $value; }
    public function getAttribute(string $key, mixed $default = null): mixed { return $this->attributes[$key] ?? $default; }
    public function user(): ?array { return $this->getAttribute('user'); }
}
