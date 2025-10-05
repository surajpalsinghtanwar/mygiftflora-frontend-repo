-- =====================================================
-- ECOMMERCE PLATFORM SETTINGS DATABASE SCHEMA (MySQL)
-- =====================================================
-- This file contains all table creation queries for the settings system (MySQL version)
-- Run these queries in your MySQL database to set up the settings infrastructure

-- =====================================================
-- 1. PLATFORM SETTINGS TABLE
-- =====================================================
CREATE TABLE platform_settings (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    site_name VARCHAR(255) NOT NULL,
    site_url VARCHAR(500) NOT NULL,
    logo_url VARCHAR(500),
    dark_logo_url VARCHAR(500),
    
    -- Contact Information
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    contact_address TEXT,
    support_email VARCHAR(255),
    support_phone VARCHAR(50),
    
    -- Social Media Links
    social_facebook VARCHAR(500),
    social_twitter VARCHAR(500),
    social_instagram VARCHAR(500),
    social_linkedin VARCHAR(500),
    social_youtube VARCHAR(500),
    
    -- SEO Settings
    meta_title VARCHAR(255) NOT NULL,
    meta_description TEXT,
    meta_keywords JSON, -- Array of keywords
    og_image VARCHAR(500),
    favicon VARCHAR(500),
    
    -- Theme Settings
    primary_color VARCHAR(7) DEFAULT '#007bff',
    secondary_color VARCHAR(7) DEFAULT '#6c757d',
    font_family VARCHAR(100) DEFAULT 'Inter, Arial, sans-serif',
    logo_width INT DEFAULT 150,
    logo_height INT DEFAULT 50,
    
    -- Maintenance Mode
    maintenance_enabled BOOLEAN DEFAULT FALSE,
    maintenance_message TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by CHAR(36),
    updated_by CHAR(36),
    
    INDEX idx_platform_settings_site_name (site_name),
    INDEX idx_platform_settings_created_at (created_at)
);

-- =====================================================
-- 2. EMAIL SETTINGS TABLE
-- =====================================================
CREATE TABLE email_settings (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    
    -- SMTP Configuration
    smtp_host VARCHAR(255) NOT NULL,
    smtp_port INT NOT NULL DEFAULT 587,
    smtp_secure BOOLEAN DEFAULT FALSE,
    smtp_user VARCHAR(255) NOT NULL,
    smtp_password VARCHAR(500) NOT NULL, -- Should be encrypted
    
    -- Email From Configuration
    from_email VARCHAR(255) NOT NULL,
    from_name VARCHAR(255) NOT NULL,
    reply_to_email VARCHAR(255),
    
    -- Service Status
    enabled BOOLEAN DEFAULT FALSE,
    last_test_at TIMESTAMP NULL,
    last_test_success BOOLEAN,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by CHAR(36),
    updated_by CHAR(36)
);

-- =====================================================
-- 3. SECURITY SETTINGS TABLE
-- =====================================================
CREATE TABLE security_settings (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    
    -- Password Policy
    password_min_length INT DEFAULT 8,
    password_require_uppercase BOOLEAN DEFAULT TRUE,
    password_require_lowercase BOOLEAN DEFAULT TRUE,
    password_require_numbers BOOLEAN DEFAULT TRUE,
    password_require_special_chars BOOLEAN DEFAULT FALSE,
    force_password_change_days INT DEFAULT 90,
    
    -- Session & Login Security
    session_timeout_minutes INT DEFAULT 30,
    max_login_attempts INT DEFAULT 5,
    lockout_duration_minutes INT DEFAULT 15,
    
    -- Two-Factor Authentication
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    
    -- IP Security
    ip_whitelist JSON, -- Array of IP addresses/ranges
    
    -- Audit & Logging
    enable_audit_log BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by CHAR(36),
    updated_by CHAR(36)
);

-- =====================================================
-- 4. PAYMENT SETTINGS TABLE
-- =====================================================
CREATE TABLE payment_settings (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    
    -- General Payment Settings
    enabled BOOLEAN DEFAULT TRUE,
    currency VARCHAR(3) DEFAULT 'USD',
    tax_rate DECIMAL(5,2) DEFAULT 0.00,
    processing_fee DECIMAL(5,2) DEFAULT 0.00,
    minimum_order_amount DECIMAL(10,2) DEFAULT 0.00,
    maximum_order_amount DECIMAL(10,2) DEFAULT 10000.00,
    
    -- Stripe Configuration
    stripe_enabled BOOLEAN DEFAULT FALSE,
    stripe_publishable_key VARCHAR(500),
    stripe_secret_key VARCHAR(500), -- Should be encrypted
    
    -- PayPal Configuration
    paypal_enabled BOOLEAN DEFAULT FALSE,
    paypal_client_id VARCHAR(500),
    paypal_client_secret VARCHAR(500), -- Should be encrypted
    paypal_sandbox BOOLEAN DEFAULT TRUE,
    
    -- Razorpay Configuration
    razorpay_enabled BOOLEAN DEFAULT FALSE,
    razorpay_key_id VARCHAR(500),
    razorpay_key_secret VARCHAR(500), -- Should be encrypted
    
    -- Shipping Settings
    shipping_enabled BOOLEAN DEFAULT TRUE,
    free_shipping_threshold DECIMAL(10,2) DEFAULT 100.00,
    
    -- Policies
    refund_policy TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by CHAR(36),
    updated_by CHAR(36)
);

-- =====================================================
-- 5. SETTINGS AUDIT LOG TABLE
-- =====================================================
CREATE TABLE settings_audit_log (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    
    -- Audit Information
    table_name VARCHAR(100) NOT NULL,
    record_id CHAR(36) NOT NULL,
    action VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    
    -- Change Details
    old_values JSON,
    new_values JSON,
    changed_fields JSON,
    
    -- User Information
    user_id CHAR(36),
    user_email VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_settings_audit_log_table_name (table_name),
    INDEX idx_settings_audit_log_record_id (record_id),
    INDEX idx_settings_audit_log_user_id (user_id),
    INDEX idx_settings_audit_log_created_at (created_at)
);

-- =====================================================
-- 6. EMAIL TEMPLATES TABLE
-- =====================================================
CREATE TABLE email_templates (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    
    -- Template Information
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'general',
    
    -- Template Content
    subject VARCHAR(255) NOT NULL,
    html_content TEXT NOT NULL,
    text_content TEXT,
    
    -- Template Variables
    available_variables JSON, -- Array of available placeholders
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_system BOOLEAN DEFAULT FALSE, -- System templates cannot be deleted
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by CHAR(36),
    updated_by CHAR(36),
    
    INDEX idx_email_templates_name (name),
    INDEX idx_email_templates_category (category)
);

-- =====================================================
-- 7. NOTIFICATION SETTINGS TABLE
-- =====================================================
CREATE TABLE notification_settings (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    
    -- Email Notifications
    email_new_user_registration BOOLEAN DEFAULT TRUE,
    email_new_order BOOLEAN DEFAULT TRUE,
    email_order_status_change BOOLEAN DEFAULT TRUE,
    email_payment_received BOOLEAN DEFAULT TRUE,
    email_low_stock_alert BOOLEAN DEFAULT TRUE,
    email_system_errors BOOLEAN DEFAULT TRUE,
    
    -- SMS Notifications (if implemented)
    sms_enabled BOOLEAN DEFAULT FALSE,
    sms_provider VARCHAR(50),
    sms_api_key VARCHAR(500),
    sms_new_order BOOLEAN DEFAULT FALSE,
    sms_order_status_change BOOLEAN DEFAULT FALSE,
    
    -- Push Notifications
    push_enabled BOOLEAN DEFAULT FALSE,
    push_api_key VARCHAR(500),
    
    -- Notification Recipients
    admin_emails JSON, -- Array of admin email addresses
    developer_emails JSON, -- Array of developer email addresses
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by CHAR(36),
    updated_by CHAR(36)
);

-- =====================================================
-- 8. API SETTINGS TABLE
-- =====================================================
CREATE TABLE api_settings (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    
    -- API Configuration
    api_enabled BOOLEAN DEFAULT TRUE,
    api_rate_limit INT DEFAULT 1000, -- Requests per hour
    api_timeout_seconds INT DEFAULT 30,
    
    -- API Keys Management
    auto_generate_keys BOOLEAN DEFAULT TRUE,
    key_expiry_days INT DEFAULT 365,
    
    -- CORS Settings
    cors_enabled BOOLEAN DEFAULT TRUE,
    cors_origins JSON, -- Array of allowed origins
    
    -- Webhook Settings
    webhook_enabled BOOLEAN DEFAULT FALSE,
    webhook_secret VARCHAR(500),
    webhook_timeout_seconds INT DEFAULT 10,
    
    -- Documentation
    api_docs_enabled BOOLEAN DEFAULT TRUE,
    api_docs_public BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by CHAR(36),
    updated_by CHAR(36)
);

-- =====================================================
-- 9. INTEGRATION SETTINGS TABLE
-- =====================================================
CREATE TABLE integration_settings (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    
    -- Google Analytics
    google_analytics_enabled BOOLEAN DEFAULT FALSE,
    google_analytics_id VARCHAR(50),
    
    -- Google Tag Manager
    google_tag_manager_enabled BOOLEAN DEFAULT FALSE,
    google_tag_manager_id VARCHAR(50),
    
    -- Facebook Pixel
    facebook_pixel_enabled BOOLEAN DEFAULT FALSE,
    facebook_pixel_id VARCHAR(50),
    
    -- Social Login
    google_login_enabled BOOLEAN DEFAULT FALSE,
    google_client_id VARCHAR(500),
    google_client_secret VARCHAR(500),
    
    facebook_login_enabled BOOLEAN DEFAULT FALSE,
    facebook_app_id VARCHAR(50),
    facebook_app_secret VARCHAR(500),
    
    -- Third-party Services
    chatbot_enabled BOOLEAN DEFAULT FALSE,
    chatbot_provider VARCHAR(50),
    chatbot_config JSON,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by CHAR(36),
    updated_by CHAR(36)
);

-- =====================================================
-- 10. SYSTEM CONFIGURATION TABLE
-- =====================================================
CREATE TABLE system_configuration (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    
    -- System Information
    system_name VARCHAR(255) DEFAULT 'EcommercePro',
    system_version VARCHAR(20) DEFAULT '1.0.0',
    environment VARCHAR(20) DEFAULT 'development', -- development, staging, production
    
    -- Database Settings
    db_backup_enabled BOOLEAN DEFAULT TRUE,
    db_backup_frequency VARCHAR(20) DEFAULT 'daily', -- hourly, daily, weekly
    db_backup_retention_days INT DEFAULT 30,
    
    -- Cache Settings
    cache_enabled BOOLEAN DEFAULT TRUE,
    cache_provider VARCHAR(20) DEFAULT 'redis', -- redis, memory, file
    cache_ttl_seconds INT DEFAULT 3600,
    
    -- File Storage
    storage_provider VARCHAR(20) DEFAULT 'local', -- local, s3, cloudinary
    storage_config JSON,
    
    -- Performance Settings
    enable_compression BOOLEAN DEFAULT TRUE,
    enable_minification BOOLEAN DEFAULT TRUE,
    enable_cdn BOOLEAN DEFAULT FALSE,
    cdn_url VARCHAR(500),
    
    -- Debug & Logging
    debug_mode BOOLEAN DEFAULT FALSE,
    log_level VARCHAR(10) DEFAULT 'info', -- debug, info, warn, error
    log_retention_days INT DEFAULT 30,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by CHAR(36),
    updated_by CHAR(36)
);

-- =====================================================
-- INSERT DEFAULT DATA
-- =====================================================

-- Insert default platform settings
INSERT INTO platform_settings (
    site_name,
    site_url,
    contact_email,
    contact_phone,
    contact_address,
    support_email,
    support_phone,
    meta_title,
    meta_description,
    meta_keywords,
    primary_color,
    secondary_color,
    font_family,
    logo_width,
    logo_height,
    maintenance_enabled,
    maintenance_message
) VALUES (
    'EcommercePro',
    'https://ecommercepro.com',
    'contact@ecommercepro.com',
    '+1 (555) 123-4567',
    '123 Business Street, City, State 12345',
    'support@ecommercepro.com',
    '+1 (555) 123-4568',
    'EcommercePro - Your Premier Shopping Destination',
    'Discover amazing products at EcommercePro. Quality items, great prices, fast shipping.',
    JSON_ARRAY('ecommerce', 'shopping', 'online store', 'products'),
    '#007bff',
    '#6c757d',
    'Inter, Arial, sans-serif',
    150,
    50,
    FALSE,
    'We are currently performing maintenance. Please check back soon.'
);

-- Insert default email settings
INSERT INTO email_settings (
    smtp_host,
    smtp_port,
    smtp_secure,
    smtp_user,
    smtp_password,
    from_email,
    from_name,
    reply_to_email,
    enabled
) VALUES (
    'smtp.gmail.com',
    587,
    FALSE,
    '',
    '',
    'noreply@ecommercepro.com',
    'EcommercePro',
    'support@ecommercepro.com',
    FALSE
);

-- Insert default security settings
INSERT INTO security_settings (
    password_min_length,
    password_require_uppercase,
    password_require_lowercase,
    password_require_numbers,
    password_require_special_chars,
    force_password_change_days,
    session_timeout_minutes,
    max_login_attempts,
    lockout_duration_minutes,
    two_factor_enabled,
    ip_whitelist,
    enable_audit_log
) VALUES (
    8,
    TRUE,
    TRUE,
    TRUE,
    FALSE,
    90,
    30,
    5,
    15,
    FALSE,
    JSON_ARRAY(),
    TRUE
);

-- Insert default payment settings
INSERT INTO payment_settings (
    enabled,
    currency,
    tax_rate,
    processing_fee,
    minimum_order_amount,
    maximum_order_amount,
    stripe_enabled,
    paypal_enabled,
    paypal_sandbox,
    razorpay_enabled,
    shipping_enabled,
    free_shipping_threshold,
    refund_policy
) VALUES (
    TRUE,
    'USD',
    0.00,
    0.00,
    0.00,
    10000.00,
    FALSE,
    FALSE,
    TRUE,
    FALSE,
    TRUE,
    100.00,
    'All refunds will be processed within 7-14 business days. Items must be returned in original condition.'
);

-- Insert default notification settings
INSERT INTO notification_settings (
    email_new_user_registration,
    email_new_order,
    email_order_status_change,
    email_payment_received,
    email_low_stock_alert,
    email_system_errors,
    sms_enabled,
    push_enabled,
    admin_emails,
    developer_emails
) VALUES (
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    FALSE,
    FALSE,
    JSON_ARRAY('admin@ecommercepro.com'),
    JSON_ARRAY('dev@ecommercepro.com')
);

-- Insert default API settings
INSERT INTO api_settings (
    api_enabled,
    api_rate_limit,
    api_timeout_seconds,
    auto_generate_keys,
    key_expiry_days,
    cors_enabled,
    cors_origins,
    webhook_enabled,
    webhook_timeout_seconds,
    api_docs_enabled,
    api_docs_public
) VALUES (
    TRUE,
    1000,
    30,
    TRUE,
    365,
    TRUE,
    JSON_ARRAY('http://localhost:3000', 'https://ecommercepro.com'),
    FALSE,
    10,
    TRUE,
    FALSE
);

-- Insert default integration settings
INSERT INTO integration_settings (
    google_analytics_enabled,
    google_tag_manager_enabled,
    facebook_pixel_enabled,
    google_login_enabled,
    facebook_login_enabled,
    chatbot_enabled
) VALUES (
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    FALSE
);

-- Insert default system configuration
INSERT INTO system_configuration (
    system_name,
    system_version,
    environment,
    db_backup_enabled,
    db_backup_frequency,
    db_backup_retention_days,
    cache_enabled,
    cache_provider,
    cache_ttl_seconds,
    storage_provider,
    enable_compression,
    enable_minification,
    enable_cdn,
    debug_mode,
    log_level,
    log_retention_days
) VALUES (
    'EcommercePro',
    '1.0.0',
    'development',
    TRUE,
    'daily',
    30,
    TRUE,
    'redis',
    3600,
    'local',
    TRUE,
    TRUE,
    FALSE,
    FALSE,
    'info',
    30
);

-- Insert default email templates
INSERT INTO email_templates (name, display_name, description, category, subject, html_content, text_content, available_variables, is_system) VALUES
('welcome_email', 'Welcome Email', 'Email sent to new users upon registration', 'user', 'Welcome to {{site_name}}!', 
'<h1>Welcome to {{site_name}}!</h1><p>Thank you for joining us, {{user_name}}. We are excited to have you on board.</p>', 
'Welcome to {{site_name}}! Thank you for joining us, {{user_name}}. We are excited to have you on board.',
JSON_ARRAY('site_name', 'user_name', 'user_email'), TRUE),

('order_confirmation', 'Order Confirmation', 'Email sent when an order is placed', 'order', 'Order Confirmation - {{order_number}}',
'<h1>Order Confirmation</h1><p>Thank you for your order {{order_number}}. Total: {{order_total}}</p>',
'Order Confirmation - Thank you for your order {{order_number}}. Total: {{order_total}}',
JSON_ARRAY('order_number', 'order_total', 'customer_name'), TRUE),

('password_reset', 'Password Reset', 'Email sent for password reset requests', 'user', 'Reset Your Password',
'<h1>Password Reset</h1><p>Click <a href="{{reset_link}}">here</a> to reset your password.</p>',
'Password Reset - Click here to reset your password: {{reset_link}}',
JSON_ARRAY('user_name', 'reset_link'), TRUE);

-- =====================================================
-- CREATE VIEWS FOR EASIER QUERYING
-- =====================================================

-- View for all settings combined
CREATE VIEW all_settings_summary AS
SELECT 
    'platform' as setting_type,
    p.id,
    p.site_name as name,
    p.updated_at,
    CASE WHEN p.maintenance_enabled THEN 'Maintenance Mode' ELSE 'Active' END as status
FROM platform_settings p
UNION ALL
SELECT 
    'email' as setting_type,
    e.id,
    e.from_name as name,
    e.updated_at,
    CASE WHEN e.enabled THEN 'Enabled' ELSE 'Disabled' END as status
FROM email_settings e
UNION ALL
SELECT 
    'payment' as setting_type,
    pay.id,
    pay.currency as name,
    pay.updated_at,
    CASE WHEN pay.enabled THEN 'Enabled' ELSE 'Disabled' END as status
FROM payment_settings pay;

-- =====================================================
-- END OF SCHEMA
-- =====================================================