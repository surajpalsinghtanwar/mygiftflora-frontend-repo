# Database Schema Documentation for Settings System

## Overview
This document provides comprehensive information about the database schema for the EcommercePro settings system. The schema supports platform configuration, email settings, security policies, payment gateways, and more.

## Files Included
- `settings_schema.sql` - PostgreSQL version
- `settings_schema_mysql.sql` - MySQL version

## Database Support
- **PostgreSQL** (Recommended) - Full feature support including arrays, JSONB, and UUIDs
- **MySQL** - Compatible version using JSON columns and CHAR(36) for UUIDs

## Tables Overview

### 1. Core Settings Tables

#### `platform_settings`
**Purpose**: Core platform configuration including site details, contact info, SEO, and theme settings.

**Key Fields**:
- `site_name`, `site_url` - Basic site information
- `contact_*` fields - Contact information
- `social_*` fields - Social media links
- `meta_*` fields - SEO settings
- `*_color`, `font_family` - Theme customization
- `maintenance_enabled`, `maintenance_message` - Maintenance mode

#### `email_settings`
**Purpose**: SMTP configuration and email service settings.

**Key Fields**:
- `smtp_*` fields - SMTP server configuration
- `from_*` fields - Email sender configuration
- `enabled` - Email service status

#### `security_settings`
**Purpose**: Security policies, password rules, and authentication settings.

**Key Fields**:
- `password_*` fields - Password policy rules
- `session_timeout_minutes` - Session management
- `max_login_attempts`, `lockout_duration_minutes` - Brute force protection
- `two_factor_enabled` - 2FA configuration
- `ip_whitelist` - IP access control

#### `payment_settings`
**Purpose**: Payment gateway configuration and transaction settings.

**Key Fields**:
- `currency`, `tax_rate` - Financial configuration
- `*_enabled` fields - Gateway activation status
- `*_key`, `*_secret` fields - Gateway credentials (should be encrypted)
- `shipping_*` fields - Shipping configuration

### 2. Supporting Tables

#### `settings_audit_log`
**Purpose**: Audit trail for all settings changes.

**Key Fields**:
- `table_name`, `record_id` - Reference to changed record
- `action` - INSERT, UPDATE, DELETE
- `old_values`, `new_values` - Change tracking
- `user_id`, `ip_address` - User attribution

#### `email_templates`
**Purpose**: Email template management for system notifications.

**Key Fields**:
- `name` - Template identifier
- `subject`, `html_content`, `text_content` - Template content
- `available_variables` - Supported placeholders
- `is_system` - System templates cannot be deleted

#### `notification_settings`
**Purpose**: Configuration for various notification channels.

**Key Fields**:
- `email_*` fields - Email notification preferences
- `sms_*` fields - SMS notification configuration
- `admin_emails` - Recipient lists

#### `api_settings`
**Purpose**: API configuration including rate limiting and CORS.

**Key Fields**:
- `api_rate_limit` - Requests per hour
- `cors_origins` - Allowed origins
- `webhook_*` fields - Webhook configuration

#### `integration_settings`
**Purpose**: Third-party service integrations.

**Key Fields**:
- `google_*` fields - Google services integration
- `facebook_*` fields - Facebook services integration
- Social login configuration

#### `system_configuration`
**Purpose**: System-level configuration and performance settings.

**Key Fields**:
- `environment` - development, staging, production
- `cache_*` fields - Caching configuration
- `storage_*` fields - File storage settings
- `debug_mode`, `log_level` - Debugging configuration

## Installation Instructions

### PostgreSQL Setup
```bash
# Connect to your PostgreSQL database
psql -U your_username -d your_database

# Run the schema file
\i /path/to/settings_schema.sql
```

### MySQL Setup
```bash
# Connect to your MySQL database
mysql -u your_username -p your_database

# Run the schema file
source /path/to/settings_schema_mysql.sql
```

## Features

### 1. Automatic Timestamps
- All tables include `created_at` and `updated_at` timestamps
- PostgreSQL uses triggers for automatic updates
- MySQL uses `ON UPDATE CURRENT_TIMESTAMP`

### 2. UUID Primary Keys
- PostgreSQL uses native UUID type with `gen_random_uuid()`
- MySQL uses `CHAR(36)` with `UUID()` function

### 3. JSON Support
- PostgreSQL uses JSONB for better performance
- MySQL uses JSON data type (MySQL 5.7+)

### 4. Indexing
- Optimized indexes for common queries
- Performance indexes on timestamps and foreign keys

### 5. Default Data
- Comprehensive default settings for immediate use
- System email templates included
- Sensible security defaults

## Security Considerations

### 1. Sensitive Data Encryption
Fields marked "Should be encrypted" in comments should be encrypted before storage:
- `smtp_password`
- `stripe_secret_key`
- `paypal_client_secret`
- `razorpay_key_secret`
- All other API secrets

### 2. Access Control
```sql
-- Example: Grant permissions to application user
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO app_user;

-- Restrict sensitive operations
REVOKE DELETE ON payment_settings FROM app_user;
REVOKE DELETE ON security_settings FROM app_user;
```

### 3. Audit Logging
The `settings_audit_log` table automatically tracks all changes when implemented with triggers or application-level logging.

## Usage Examples

### 1. Retrieve Platform Settings
```sql
SELECT site_name, site_url, maintenance_enabled 
FROM platform_settings 
ORDER BY created_at DESC 
LIMIT 1;
```

### 2. Update Email Configuration
```sql
UPDATE email_settings 
SET smtp_host = 'smtp.gmail.com',
    smtp_port = 587,
    enabled = TRUE,
    updated_at = CURRENT_TIMESTAMP
WHERE id = (SELECT id FROM email_settings ORDER BY created_at DESC LIMIT 1);
```

### 3. Check Security Policies
```sql
SELECT password_min_length,
       password_require_uppercase,
       session_timeout_minutes,
       two_factor_enabled
FROM security_settings
ORDER BY created_at DESC 
LIMIT 1;
```

### 4. Get Active Payment Gateways
```sql
SELECT currency,
       stripe_enabled,
       paypal_enabled,
       razorpay_enabled
FROM payment_settings
WHERE enabled = TRUE
ORDER BY created_at DESC 
LIMIT 1;
```

### 5. Audit Trail Query
```sql
SELECT table_name,
       action,
       user_email,
       created_at
FROM settings_audit_log
WHERE table_name = 'platform_settings'
ORDER BY created_at DESC
LIMIT 10;
```

## API Integration

### 1. Settings Endpoints
The schema supports the following API endpoints:
- `GET /api/admin/settings` - Platform settings
- `GET /api/admin/settings/email` - Email settings
- `GET /api/admin/settings/security` - Security settings
- `GET /api/admin/settings/payment` - Payment settings

### 2. Data Format
Settings are returned in both camelCase (frontend) and snake_case (database) formats for compatibility.

### 3. Validation
Implement validation rules based on the schema constraints:
- Required fields validation
- Email format validation
- URL format validation
- Numeric range validation

## Maintenance

### 1. Regular Tasks
- Backup settings tables regularly
- Clean old audit logs based on retention policy
- Monitor table sizes and performance

### 2. Updates
- Always backup before schema changes
- Test updates in development environment
- Use migrations for schema changes

### 3. Performance Monitoring
```sql
-- Check table sizes
SELECT table_name, 
       pg_size_pretty(pg_total_relation_size(table_name::regclass)) as size
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%settings%';

-- Check slow queries
-- Use your database's query monitoring tools
```

## Troubleshooting

### Common Issues

1. **UUID Function Not Available (MySQL)**
   - Ensure MySQL version 8.0+ or install uuid() function
   - Alternative: Use `CHAR(36)` with application-generated UUIDs

2. **JSON Support Issues**
   - PostgreSQL: Requires version 9.4+
   - MySQL: Requires version 5.7+

3. **Trigger Issues (PostgreSQL)**
   - Ensure `gen_random_uuid()` extension is installed
   - Install: `CREATE EXTENSION IF NOT EXISTS pgcrypto;`

4. **Permission Issues**
   - Verify user has necessary privileges
   - Check schema ownership and access rights

### Migration from Existing System
```sql
-- Example migration from old settings table
INSERT INTO platform_settings (site_name, contact_email, ...)
SELECT name, email, ... FROM old_settings_table;
```

## Best Practices

1. **Environment-Specific Settings**
   - Use different configurations for dev/staging/production
   - Consider environment variables for sensitive data

2. **Backup Strategy**
   - Regular automated backups
   - Test restore procedures
   - Keep settings backups separate from application data

3. **Change Management**
   - Use version control for schema changes
   - Document all configuration changes
   - Implement approval workflows for production changes

4. **Monitoring**
   - Monitor settings changes
   - Alert on security setting modifications
   - Track payment gateway status

## Support

For additional support or questions about this schema:
1. Check the application documentation
2. Review the API endpoint implementations
3. Consult the frontend settings pages for usage examples

Remember to always test schema changes in a development environment before applying to production!