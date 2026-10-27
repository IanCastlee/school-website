<?php
declare(strict_types=1);

require_once __DIR__ . '/../src/Core/Database.php';

use App\Core\Database;

Database::init();

if (Database::isMySql()) {
    echo "[OK] Connected to Laragon MySQL 8.4 (Database: school_portal_db)\n";
    $pdo = Database::getPdo();
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    echo "[OK] Active MySQL Tables (" . count($tables) . "): " . implode(', ', $tables) . "\n";
} else {
    echo "[INFO] MySQL service on port 3306 is not reachable yet; using local fallback store (api/storage/database/portal_store.json).\n";
}
