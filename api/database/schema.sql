-- =============================================================================
-- GREENFIELD NATIONAL HIGH SCHOOL (WHITE-LABEL PORTAL) - MYSQL 8.0+ SCHEMA
-- Engineered with Proper B-Tree, Composite, and FULLTEXT Indexing,
-- Token-Bucket Rate Limiting / Throttling Table, and Tag-Based Cache Store
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Admin & Staff Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('SUPER_ADMIN', 'PRINCIPAL', 'REGISTRAR', 'CONTENT_EDITOR') NOT NULL DEFAULT 'SUPER_ADMIN',
    status ENUM('ACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    last_login_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- Proper Indexing for Authentication & Role Filtering
    UNIQUE INDEX idx_users_email_unique (email),
    INDEX idx_users_role_status (role, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. School Settings / White-Label Configuration (Key-Value Store)
CREATE TABLE IF NOT EXISTS school_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT NOT NULL,
    setting_group VARCHAR(60) NOT NULL DEFAULT 'general',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_settings_group (setting_group)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Accomplishments & Achievements Table (Sports, Boxing, Sepak Takraw, DLC, Sci-Tech)
CREATE TABLE IF NOT EXISTS accomplishments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(80) NOT NULL,
    title VARCHAR(220) NOT NULL,
    subtitle VARCHAR(220) NOT NULL,
    event_date VARCHAR(100) NOT NULL,
    badge VARCHAR(80) NULL,
    image_url VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    athletes_json JSON NOT NULL,
    metrics_json JSON NOT NULL,
    is_featured TINYINT(1) NOT NULL DEFAULT 1,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- Composite Index for Category Filtering + Featured Sorting
    INDEX idx_accomplishments_cat_featured_sort (category, is_featured, sort_order, created_at),
    -- Fulltext Index for Instant Portal Global Search
    FULLTEXT INDEX ft_accomplishments_search (title, subtitle, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. School Plans & SIP Action Projects Table
CREATE TABLE IF NOT EXISTS school_projects (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(220) NOT NULL,
    category VARCHAR(100) NOT NULL,
    project_date VARCHAR(100) NOT NULL,
    status ENUM('Planned', 'In Progress', 'Ongoing', 'Active Monitoring', 'Completed') NOT NULL DEFAULT 'Ongoing',
    progress TINYINT UNSIGNED NOT NULL DEFAULT 0,
    lead_unit VARCHAR(160) NOT NULL,
    description TEXT NOT NULL,
    impact_summary VARCHAR(200) NULL,
    is_flagship TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- Composite Index for Status & Progress Dashboard Queries
    INDEX idx_projects_status_progress (status, progress, created_at),
    INDEX idx_projects_category (category),
    -- Fulltext Index for Global Search
    FULLTEXT INDEX ft_projects_search (title, description, lead_unit)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Transparency Documents & Financial Disclosures Table
CREATE TABLE IF NOT EXISTS transparency_documents (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    document_code VARCHAR(60) NOT NULL UNIQUE,
    title VARCHAR(250) NOT NULL,
    category ENUM('Annual Report', 'Financial Statement', 'Procurement', 'School Governance', 'MOOE Liquidation') NOT NULL DEFAULT 'Annual Report',
    fiscal_year SMALLINT UNSIGNED NOT NULL DEFAULT 2025,
    date_published VARCHAR(80) NOT NULL,
    file_size VARCHAR(40) NOT NULL DEFAULT '1.5 MB PDF',
    file_url VARCHAR(500) NULL,
    allocated_amount DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    utilized_amount DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(60) NOT NULL DEFAULT 'Verified & Posted',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- Composite Index for Fiscal Year & Category Filtering
    UNIQUE INDEX idx_transparency_code (document_code),
    INDEX idx_transparency_fy_category_status (fiscal_year, category, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Public Contact Inquiries & Citizen's Charter Desk Table
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    contact_info VARCHAR(150) NOT NULL,
    stakeholder_role VARCHAR(80) NOT NULL DEFAULT 'Student / Learner',
    subject VARCHAR(220) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('UNREAD', 'IN_PROGRESS', 'RESOLVED', 'ARCHIVED') NOT NULL DEFAULT 'UNREAD',
    admin_notes TEXT NULL,
    ip_address VARCHAR(45) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- Composite Index for Inbox Status & Chronological Sorting
    INDEX idx_inquiries_status_created (status, created_at),
    INDEX idx_inquiries_ip_created (ip_address, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Rate Limits & Throttling Bucket Table (Token Bucket / Sliding Window)
CREATE TABLE IF NOT EXISTS rate_limits (
    rate_key VARCHAR(190) PRIMARY KEY,
    ip_address VARCHAR(45) NOT NULL,
    endpoint_group VARCHAR(60) NOT NULL,
    hits INT UNSIGNED NOT NULL DEFAULT 1,
    reset_at INT UNSIGNED NOT NULL,
    blocked_until INT UNSIGNED NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- Proper Indexing for High-Speed Rate Limit Pruning & Lookups
    INDEX idx_ratelimits_ip_endpoint (ip_address, endpoint_group),
    INDEX idx_ratelimits_reset_at (reset_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Application Cache Store Table (Write-Through / Read-Aside Cache)
CREATE TABLE IF NOT EXISTS cache_store (
    cache_key VARCHAR(190) PRIMARY KEY,
    cache_tag VARCHAR(80) NOT NULL DEFAULT 'portal',
    payload LONGTEXT NOT NULL,
    hits INT UNSIGNED NOT NULL DEFAULT 0,
    expires_at INT UNSIGNED NOT NULL,
    created_at INT UNSIGNED NOT NULL,
    -- Proper Indexing for Tag Invalidation & TTL Garbage Collection
    INDEX idx_cache_tag_expires (cache_tag, expires_at),
    INDEX idx_cache_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
