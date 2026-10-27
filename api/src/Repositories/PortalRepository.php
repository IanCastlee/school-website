<?php
declare(strict_types=1);

namespace App\Repositories;

use App\Core\Database;
use PDO;

/**
 * Unified School Portal Repository (PHP 8.4)
 * Executes indexed MySQL PDO queries when MySQL is active, and seamlessly falls back
 * to the local persistent store so live demos and CRUD mutations always succeed.
 */
final class PortalRepository
{
    public function findUserByEmail(string $email): ?array
    {
        if (Database::isMySql()) {
            $stmt = Database::getPdo()->prepare("SELECT * FROM users WHERE email = :email LIMIT 1");
            $stmt->execute([':email' => $email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            return $user ?: null;
        }

        $store = Database::readStore();
        foreach ($store['users'] ?? [] as $user) {
            if (strcasecmp($user['email'], $email) === 0) {
                return $user;
            }
        }
        return null;
    }

    public function getSchoolSettings(): array
    {
        if (Database::isMySql()) {
            $stmt = Database::getPdo()->query("SELECT setting_key, setting_value FROM school_settings");
            $rows = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
            if (!empty($rows)) {
                return $rows;
            }
        }

        $store = Database::readStore();
        return $store['school_settings'] ?? [];
    }

    public function updateSchoolSettings(array $settings): array
    {
        if (Database::isMySql()) {
            $pdo = Database::getPdo();
            $stmt = $pdo->prepare("
                INSERT INTO school_settings (setting_key, setting_value, setting_group)
                VALUES (:k, :v, 'general')
                ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
            ");
            foreach ($settings as $key => $val) {
                if (is_scalar($val)) {
                    $stmt->execute([':k' => (string)$key, ':v' => (string)$val]);
                }
            }
            return $this->getSchoolSettings();
        }

        $store = Database::readStore();
        foreach ($settings as $key => $val) {
            if (is_scalar($val)) {
                $store['school_settings'][$key] = (string)$val;
            }
        }
        Database::writeStore($store);
        return $store['school_settings'];
    }

    public function getAccomplishments(): array
    {
        if (Database::isMySql()) {
            $stmt = Database::getPdo()->query("
                SELECT id, category, title, subtitle, event_date AS date, badge, image_url AS image,
                       description, athletes_json, metrics_json, is_featured, created_at
                FROM accomplishments
                ORDER BY sort_order ASC, id DESC
            ");
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return array_map(static function (array $r): array {
                $r['athletes'] = json_decode($r['athletes_json'] ?? '[]', true) ?: [];
                $r['metrics'] = json_decode($r['metrics_json'] ?? '[]', true) ?: [];
                unset($r['athletes_json'], $r['metrics_json']);
                return $r;
            }, $rows);
        }

        $store = Database::readStore();
        return array_values($store['accomplishments'] ?? []);
    }

    public function createAccomplishment(array $payload): array
    {
        $athletes = is_array($payload['athletes'] ?? null)
            ? $payload['athletes']
            : array_filter(array_map('trim', explode(',', (string)($payload['athletes'] ?? 'Varsity Delegation'))));
        $metrics = is_array($payload['metrics'] ?? null)
            ? $payload['metrics']
            : array_filter(array_map('trim', explode(',', (string)($payload['metrics'] ?? 'Official Distinction'))));

        if (Database::isMySql()) {
            $pdo = Database::getPdo();
            $stmt = $pdo->prepare("
                INSERT INTO accomplishments (category, title, subtitle, event_date, badge, image_url, description, athletes_json, metrics_json, is_featured)
                VALUES (:cat, :title, :sub, :dt, :badge, :img, :desc, :ath, :met, 1)
            ");
            $stmt->execute([
                ':cat' => $payload['category'] ?? 'Academic & Sci-Tech',
                ':title' => $payload['title'],
                ':sub' => $payload['subtitle'] ?? 'School Distinction',
                ':dt' => $payload['date'] ?? date('Y'),
                ':badge' => $payload['badge'] ?? 'HONORABLE MENTION',
                ':img' => $payload['image'] ?? 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80',
                ':desc' => $payload['description'] ?? '',
                ':ath' => json_encode(array_values($athletes)),
                ':met' => json_encode(array_values($metrics)),
            ]);
            return ['id' => (int)$pdo->lastInsertId()] + $payload;
        }

        $store = Database::readStore();
        $list = $store['accomplishments'] ?? [];
        $nextId = empty($list) ? 1 : (max(array_column($list, 'id')) + 1);

        $newItem = [
            'id' => $nextId,
            'category' => $payload['category'] ?? 'Academic & Sci-Tech',
            'title' => $payload['title'],
            'subtitle' => $payload['subtitle'] ?? 'School Distinction',
            'date' => $payload['date'] ?? date('Y'),
            'badge' => $payload['badge'] ?? 'HONORABLE MENTION',
            'image' => !empty($payload['image'])
                ? $payload['image']
                : 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80',
            'description' => $payload['description'] ?? '',
            'athletes' => array_values($athletes),
            'metrics' => array_values($metrics),
            'is_featured' => 1,
            'created_at' => date('Y-m-d H:i:s'),
        ];

        array_unshift($list, $newItem);
        $store['accomplishments'] = $list;
        Database::writeStore($store);
        return $newItem;
    }

    public function updateAccomplishment(int $id, array $payload): ?array
    {
        $athletes = is_array($payload['athletes'] ?? null)
            ? $payload['athletes']
            : array_filter(array_map('trim', explode(',', (string)($payload['athletes'] ?? 'Varsity Delegation'))));
        $metrics = is_array($payload['metrics'] ?? null)
            ? $payload['metrics']
            : array_filter(array_map('trim', explode(',', (string)($payload['metrics'] ?? 'Official Distinction'))));

        if (Database::isMySql()) {
            $stmt = Database::getPdo()->prepare("
                UPDATE accomplishments
                SET category = :cat, title = :title, subtitle = :sub, event_date = :dt,
                    badge = :badge, description = :desc, athletes_json = :ath, metrics_json = :met
                WHERE id = :id
            ");
            $stmt->execute([
                ':id' => $id,
                ':cat' => $payload['category'] ?? 'Academic & Sci-Tech',
                ':title' => $payload['title'],
                ':sub' => $payload['subtitle'] ?? 'School Distinction',
                ':dt' => $payload['date'] ?? date('Y'),
                ':badge' => $payload['badge'] ?? 'HONORABLE MENTION',
                ':desc' => $payload['description'] ?? '',
                ':ath' => json_encode(array_values($athletes)),
                ':met' => json_encode(array_values($metrics)),
            ]);
            return ['id' => $id] + $payload;
        }

        $store = Database::readStore();
        $updatedItem = null;
        foreach ($store['accomplishments'] as &$item) {
            if ((int)$item['id'] === $id) {
                $item['category'] = $payload['category'] ?? $item['category'];
                $item['title'] = $payload['title'] ?? $item['title'];
                $item['subtitle'] = $payload['subtitle'] ?? $item['subtitle'];
                $item['date'] = $payload['date'] ?? $item['date'];
                $item['badge'] = $payload['badge'] ?? $item['badge'];
                $item['description'] = $payload['description'] ?? $item['description'];
                $item['athletes'] = array_values($athletes);
                $item['metrics'] = array_values($metrics);
                $updatedItem = $item;
                break;
            }
        }
        Database::writeStore($store);
        return $updatedItem;
    }

    public function deleteAccomplishment(int $id): bool
    {
        if (Database::isMySql()) {
            $stmt = Database::getPdo()->prepare("DELETE FROM accomplishments WHERE id = :id");
            return $stmt->execute([':id' => $id]);
        }

        $store = Database::readStore();
        $store['accomplishments'] = array_values(array_filter(
            $store['accomplishments'] ?? [],
            static fn(array $item): bool => (int)$item['id'] !== $id
        ));
        Database::writeStore($store);
        return true;
    }

    public function getProjects(): array
    {
        if (Database::isMySql()) {
            $stmt = Database::getPdo()->query("
                SELECT id, title, category, project_date AS date, status, progress,
                       lead_unit AS lead, description, impact_summary AS impact, created_at
                FROM school_projects
                ORDER BY id DESC
            ");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        $store = Database::readStore();
        return array_values($store['school_projects'] ?? []);
    }

    public function createProject(array $payload): array
    {
        if (Database::isMySql()) {
            $pdo = Database::getPdo();
            $stmt = $pdo->prepare("
                INSERT INTO school_projects (title, category, project_date, status, progress, lead_unit, description, impact_summary)
                VALUES (:title, :cat, :dt, :status, :prog, :lead, :desc, :impact)
            ");
            $stmt->execute([
                ':title' => $payload['title'],
                ':cat' => $payload['category'] ?? 'Infrastructure & SIP',
                ':dt' => $payload['date'] ?? 'SY 2025–2026',
                ':status' => $payload['status'] ?? 'Ongoing',
                ':prog' => min(100, max(0, (int)($payload['progress'] ?? 50))),
                ':lead' => $payload['lead'] ?? 'School Administration',
                ':desc' => $payload['description'] ?? '',
                ':impact' => $payload['impact'] ?? 'Campus-Wide Benefit',
            ]);
            return ['id' => (int)$pdo->lastInsertId()] + $payload;
        }

        $store = Database::readStore();
        $list = $store['school_projects'] ?? [];
        $nextId = empty($list) ? 1 : (max(array_column($list, 'id')) + 1);

        $newItem = [
            'id' => $nextId,
            'title' => $payload['title'],
            'category' => $payload['category'] ?? 'Infrastructure & SIP',
            'date' => $payload['date'] ?? 'SY 2025–2026',
            'status' => $payload['status'] ?? 'Ongoing',
            'progress' => min(100, max(0, (int)($payload['progress'] ?? 50))),
            'lead' => $payload['lead'] ?? 'School Administration',
            'description' => $payload['description'] ?? '',
            'impact' => $payload['impact'] ?? 'Campus-Wide Benefit',
            'created_at' => date('Y-m-d H:i:s'),
        ];

        array_unshift($list, $newItem);
        $store['school_projects'] = $list;
        Database::writeStore($store);
        return $newItem;
    }

    public function updateProject(int $id, array $payload): ?array
    {
        if (Database::isMySql()) {
            $stmt = Database::getPdo()->prepare("
                UPDATE school_projects
                SET title = :title, category = :cat, project_date = :dt, status = :status,
                    progress = :prog, lead_unit = :lead, description = :desc, impact_summary = :impact
                WHERE id = :id
            ");
            $stmt->execute([
                ':id' => $id,
                ':title' => $payload['title'],
                ':cat' => $payload['category'] ?? 'Infrastructure & SIP',
                ':dt' => $payload['date'] ?? 'SY 2025–2026',
                ':status' => $payload['status'] ?? 'Ongoing',
                ':prog' => min(100, max(0, (int)($payload['progress'] ?? 50))),
                ':lead' => $payload['lead'] ?? 'School Administration',
                ':desc' => $payload['description'] ?? '',
                ':impact' => $payload['impact'] ?? 'Campus-Wide Benefit',
            ]);
            return ['id' => $id] + $payload;
        }

        $store = Database::readStore();
        $updatedItem = null;
        foreach ($store['school_projects'] as &$item) {
            if ((int)$item['id'] === $id) {
                $item['title'] = $payload['title'] ?? $item['title'];
                $item['category'] = $payload['category'] ?? $item['category'];
                $item['date'] = $payload['date'] ?? $item['date'];
                $item['status'] = $payload['status'] ?? $item['status'];
                $item['progress'] = min(100, max(0, (int)($payload['progress'] ?? $item['progress'])));
                $item['lead'] = $payload['lead'] ?? $item['lead'];
                $item['description'] = $payload['description'] ?? $item['description'];
                $item['impact'] = $payload['impact'] ?? $item['impact'];
                $updatedItem = $item;
                break;
            }
        }
        Database::writeStore($store);
        return $updatedItem;
    }

    public function deleteProject(int $id): bool
    {
        if (Database::isMySql()) {
            $stmt = Database::getPdo()->prepare("DELETE FROM school_projects WHERE id = :id");
            return $stmt->execute([':id' => $id]);
        }

        $store = Database::readStore();
        $store['school_projects'] = array_values(array_filter(
            $store['school_projects'] ?? [],
            static fn(array $item): bool => (int)$item['id'] !== $id
        ));
        Database::writeStore($store);
        return true;
    }

    public function getTransparencyDocuments(): array
    {
        if (Database::isMySql()) {
            $stmt = Database::getPdo()->query("
                SELECT id, document_code AS code, title, category, fiscal_year,
                       date_published AS datePublished, file_size AS fileSize,
                       allocated_amount, utilized_amount, status, created_at
                FROM transparency_documents
                ORDER BY fiscal_year DESC, id DESC
            ");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        $store = Database::readStore();
        return array_values($store['transparency_documents'] ?? []);
    }

    public function createTransparencyDocument(array $payload): array
    {
        if (Database::isMySql()) {
            $pdo = Database::getPdo();
            $stmt = $pdo->prepare("
                INSERT INTO transparency_documents (document_code, title, category, fiscal_year, date_published, file_size, allocated_amount, utilized_amount, status)
                VALUES (:code, :title, :cat, :fy, :pub, :size, :alloc, :util, :status)
            ");
            $stmt->execute([
                ':code' => $payload['code'] ?? ('DOC-' . date('Y') . '-' . rand(100, 999)),
                ':title' => $payload['title'],
                ':cat' => $payload['category'] ?? 'Annual Report',
                ':fy' => (int)($payload['fiscal_year'] ?? date('Y')),
                ':pub' => $payload['datePublished'] ?? date('F Y'),
                ':size' => $payload['fileSize'] ?? '1.5 MB PDF',
                ':alloc' => (float)($payload['allocated_amount'] ?? 0),
                ':util' => (float)($payload['utilized_amount'] ?? 0),
                ':status' => $payload['status'] ?? 'Verified & Posted',
            ]);
            return ['id' => (int)$pdo->lastInsertId()] + $payload;
        }

        $store = Database::readStore();
        $list = $store['transparency_documents'] ?? [];
        $nextId = empty($list) ? 1 : (max(array_column($list, 'id')) + 1);

        $newItem = [
            'id' => $nextId,
            'code' => !empty($payload['code']) ? $payload['code'] : ('DOC-' . date('Y') . '-' . rand(100, 999)),
            'title' => $payload['title'],
            'category' => $payload['category'] ?? 'Annual Report',
            'fiscal_year' => (int)($payload['fiscal_year'] ?? date('Y')),
            'datePublished' => $payload['datePublished'] ?? date('F Y'),
            'fileSize' => $payload['fileSize'] ?? '1.5 MB PDF',
            'allocated_amount' => (float)($payload['allocated_amount'] ?? 0),
            'utilized_amount' => (float)($payload['utilized_amount'] ?? 0),
            'status' => $payload['status'] ?? 'Verified & Posted',
            'created_at' => date('Y-m-d H:i:s'),
        ];

        array_unshift($list, $newItem);
        $store['transparency_documents'] = $list;
        Database::writeStore($store);
        return $newItem;
    }

    public function updateTransparencyDocument(int $id, array $payload): ?array
    {
        if (Database::isMySql()) {
            $stmt = Database::getPdo()->prepare("
                UPDATE transparency_documents
                SET document_code = :code, title = :title, category = :cat, fiscal_year = :fy,
                    date_published = :pub, file_size = :size, allocated_amount = :alloc,
                    utilized_amount = :util, status = :status
                WHERE id = :id
            ");
            $stmt->execute([
                ':id' => $id,
                ':code' => $payload['code'] ?? ('DOC-' . date('Y')),
                ':title' => $payload['title'],
                ':cat' => $payload['category'] ?? 'Annual Report',
                ':fy' => (int)($payload['fiscal_year'] ?? date('Y')),
                ':pub' => $payload['datePublished'] ?? date('F Y'),
                ':size' => $payload['fileSize'] ?? '1.5 MB PDF',
                ':alloc' => (float)($payload['allocated_amount'] ?? 0),
                ':util' => (float)($payload['utilized_amount'] ?? 0),
                ':status' => $payload['status'] ?? 'Verified & Posted',
            ]);
            return ['id' => $id] + $payload;
        }

        $store = Database::readStore();
        $updatedItem = null;
        foreach ($store['transparency_documents'] as &$item) {
            if ((int)$item['id'] === $id) {
                $item['code'] = $payload['code'] ?? $item['code'];
                $item['title'] = $payload['title'] ?? $item['title'];
                $item['category'] = $payload['category'] ?? $item['category'];
                $item['fiscal_year'] = (int)($payload['fiscal_year'] ?? $item['fiscal_year']);
                $item['datePublished'] = $payload['datePublished'] ?? $item['datePublished'];
                $item['fileSize'] = $payload['fileSize'] ?? $item['fileSize'];
                $item['allocated_amount'] = (float)($payload['allocated_amount'] ?? $item['allocated_amount']);
                $item['utilized_amount'] = (float)($payload['utilized_amount'] ?? $item['utilized_amount']);
                $item['status'] = $payload['status'] ?? $item['status'];
                $updatedItem = $item;
                break;
            }
        }
        Database::writeStore($store);
        return $updatedItem;
    }

    public function deleteTransparencyDocument(int $id): bool
    {
        if (Database::isMySql()) {
            $stmt = Database::getPdo()->prepare("DELETE FROM transparency_documents WHERE id = :id");
            return $stmt->execute([':id' => $id]);
        }

        $store = Database::readStore();
        $store['transparency_documents'] = array_values(array_filter(
            $store['transparency_documents'] ?? [],
            static fn(array $item): bool => (int)$item['id'] !== $id
        ));
        Database::writeStore($store);
        return true;
    }

    public function getInquiries(): array
    {
        if (Database::isMySql()) {
            $stmt = Database::getPdo()->query("
                SELECT id, full_name, contact_info, stakeholder_role, subject, message, status, ip_address, created_at
                FROM contact_inquiries
                ORDER BY id DESC
            ");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        $store = Database::readStore();
        return array_values($store['contact_inquiries'] ?? []);
    }

    public function createInquiry(array $payload, string $ip): array
    {
        if (Database::isMySql()) {
            $pdo = Database::getPdo();
            $stmt = $pdo->prepare("
                INSERT INTO contact_inquiries (full_name, contact_info, stakeholder_role, subject, message, status, ip_address)
                VALUES (:name, :contact, :role, :subj, :msg, 'UNREAD', :ip)
            ");
            $stmt->execute([
                ':name' => $payload['fullName'] ?? $payload['full_name'] ?? 'Anonymous',
                ':contact' => $payload['email'] ?? $payload['contact_info'] ?? '',
                ':role' => $payload['role'] ?? $payload['stakeholder_role'] ?? 'Student / Learner',
                ':subj' => $payload['subject'] ?? 'General Inquiry',
                ':msg' => $payload['message'] ?? '',
                ':ip' => $ip,
            ]);
            return ['id' => (int)$pdo->lastInsertId()] + $payload;
        }

        $store = Database::readStore();
        $list = $store['contact_inquiries'] ?? [];
        $nextId = empty($list) ? 1 : (max(array_column($list, 'id')) + 1);

        $newItem = [
            'id' => $nextId,
            'full_name' => $payload['fullName'] ?? $payload['full_name'] ?? 'Anonymous',
            'contact_info' => $payload['email'] ?? $payload['contact_info'] ?? '',
            'stakeholder_role' => $payload['role'] ?? $payload['stakeholder_role'] ?? 'Student / Learner',
            'subject' => $payload['subject'] ?? 'General Inquiry',
            'message' => $payload['message'] ?? '',
            'status' => 'UNREAD',
            'ip_address' => $ip,
            'created_at' => date('Y-m-d H:i:s'),
        ];

        array_unshift($list, $newItem);
        $store['contact_inquiries'] = $list;
        Database::writeStore($store);
        return $newItem;
    }

    public function updateInquiryStatus(int $id, string $status): bool
    {
        if (Database::isMySql()) {
            $stmt = Database::getPdo()->prepare("UPDATE contact_inquiries SET status = :status WHERE id = :id");
            return $stmt->execute([':status' => $status, ':id' => $id]);
        }

        $store = Database::readStore();
        foreach ($store['contact_inquiries'] as &$item) {
            if ((int)$item['id'] === $id) {
                $item['status'] = $status;
                break;
            }
        }
        Database::writeStore($store);
        return true;
    }

    public function deleteInquiry(int $id): bool
    {
        if (Database::isMySql()) {
            $stmt = Database::getPdo()->prepare("DELETE FROM contact_inquiries WHERE id = :id");
            return $stmt->execute([':id' => $id]);
        }

        $store = Database::readStore();
        $store['contact_inquiries'] = array_values(array_filter(
            $store['contact_inquiries'] ?? [],
            static fn(array $item): bool => (int)$item['id'] !== $id
        ));
        Database::writeStore($store);
        return true;
    }

    public function getDatabaseIndexesRegistry(): array
    {
        return [
            [
                'table' => 'users',
                'index_name' => 'idx_users_email_unique',
                'index_type' => 'BTREE (UNIQUE)',
                'columns' => 'email',
                'cardinality' => 'High (1:1)',
                'purpose' => 'O(log n) instant admin authentication lookup',
            ],
            [
                'table' => 'users',
                'index_name' => 'idx_users_role_status',
                'index_type' => 'BTREE (COMPOSITE)',
                'columns' => 'role, status',
                'cardinality' => 'Selective',
                'purpose' => 'RBAC authorization & active staff filtering',
            ],
            [
                'table' => 'accomplishments',
                'index_name' => 'idx_accomplishments_cat_featured_sort',
                'index_type' => 'BTREE (COMPOSITE)',
                'columns' => 'category, is_featured, sort_order, created_at',
                'cardinality' => 'Composite High',
                'purpose' => 'Zero-filesort filtering by category (Boxing, Sepak Takraw, DLC)',
            ],
            [
                'table' => 'accomplishments',
                'index_name' => 'ft_accomplishments_search',
                'index_type' => 'FULLTEXT (INVERTED)',
                'columns' => 'title, subtitle, description',
                'cardinality' => 'Full-Text Tokenized',
                'purpose' => 'Sub-millisecond natural language portal search',
            ],
            [
                'table' => 'school_projects',
                'index_name' => 'idx_projects_status_progress',
                'index_type' => 'BTREE (COMPOSITE)',
                'columns' => 'status, progress, created_at',
                'cardinality' => 'Composite',
                'purpose' => 'SIP implementation progress & dashboard aggregation',
            ],
            [
                'table' => 'transparency_documents',
                'index_name' => 'idx_transparency_fy_category_status',
                'index_type' => 'BTREE (COMPOSITE)',
                'columns' => 'fiscal_year, category, status',
                'cardinality' => 'Composite High',
                'purpose' => 'DepEd Transparency Seal fiscal year & MOOE filtering',
            ],
            [
                'table' => 'contact_inquiries',
                'index_name' => 'idx_inquiries_status_created',
                'index_type' => 'BTREE (COMPOSITE)',
                'columns' => 'status, created_at',
                'cardinality' => 'Chronological',
                'purpose' => 'Admin Inbox UNREAD badge count & date sorting',
            ],
            [
                'table' => 'rate_limits',
                'index_name' => 'idx_ratelimits_ip_endpoint',
                'index_type' => 'BTREE (COMPOSITE)',
                'columns' => 'ip_address, endpoint_group',
                'cardinality' => 'High Velocity',
                'purpose' => 'O(1) Token-Bucket rate limiter & brute-force throttling',
            ],
            [
                'table' => 'cache_store',
                'index_name' => 'idx_cache_tag_expires',
                'index_type' => 'BTREE (COMPOSITE)',
                'columns' => 'cache_tag, expires_at',
                'cardinality' => 'Tag Grouped',
                'purpose' => 'Instant tag-based cache invalidation & TTL pruning',
            ],
        ];
    }
}
