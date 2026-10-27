<?php
declare(strict_types=1);

namespace App\Core;

use App\Core\Constants\HttpStatus;

class Router
{
    private array $routes = [];
    private array $groupMiddlewares = [];

    public function get(string $path, callable|array $handler): void { $this->addRoute('GET', $path, $handler); }
    public function post(string $path, callable|array $handler): void { $this->addRoute('POST', $path, $handler); }
    public function put(string $path, callable|array $handler): void { $this->addRoute('PUT', $path, $handler); }
    public function patch(string $path, callable|array $handler): void { $this->addRoute('PATCH', $path, $handler); }
    public function delete(string $path, callable|array $handler): void { $this->addRoute('DELETE', $path, $handler); }

    public function group(array $options, callable $callback): void
    {
        $prevMiddlewares = $this->groupMiddlewares;
        if (isset($options['middleware'])) {
            $this->groupMiddlewares = array_merge($this->groupMiddlewares, (array)$options['middleware']);
        }
        $callback($this);
        $this->groupMiddlewares = $prevMiddlewares;
    }

    private function addRoute(string $method, string $path, callable|array $handler): void
    {
        $pattern = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '(?P<$1>[^/]+)', $path);
        $pattern = "#^" . $pattern . "$#";

        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'pattern' => $pattern,
            'handler' => $handler,
            'middlewares' => $this->groupMiddlewares
        ];
    }

    public function dispatch(Request $request): void
    {
        $method = $request->getMethod();
        $uri = $request->getUri();

        foreach ($this->routes as $route) {
            if ($route['method'] === $method && preg_match($route['pattern'], $uri, $matches)) {
                $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
                foreach ($params as $k => $v) {
                    $request->setAttribute($k, $v);
                }

                foreach ($route['middlewares'] as $middleware) {
                    if (is_callable([$middleware, 'handle'])) {
                        $middleware::handle($request);
                    }
                }

                $handler = $route['handler'];
                if (is_array($handler)) {
                    [$class, $action] = $handler;
                    $controller = new $class();
                    $controller->$action($request);
                    return;
                }

                if (is_callable($handler)) {
                    $handler($request);
                    return;
                }
            }
        }

        Response::error("Route '{$method} {$uri}' not found.", HttpStatus::NOT_FOUND);
    }
}
