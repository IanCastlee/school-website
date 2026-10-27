<?php
declare(strict_types=1);

namespace App\Core\Utils;

final class Security
{
    public static function sanitizeArray(array $data): array
    {
        $clean = [];
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $clean[$key] = self::sanitizeArray($value);
            } elseif (is_string($value)) {
                $clean[$key] = trim($value);
            } else {
                $clean[$key] = $value;
            }
        }
        return $clean;
    }
}
