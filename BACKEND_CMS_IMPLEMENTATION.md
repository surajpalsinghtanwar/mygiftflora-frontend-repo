# Backend Implementation Guide for CMS Pages System

## Overview
This document provides the complete specification for implementing the backend CRUD operations for the CMS (Content Management System) pages. The CMS allows creating and managing website pages like About Us, Privacy Policy, FAQ, Contact Us, etc.

## Database Schema

### Table: `cms_pages`

```sql
CREATE TABLE cms_pages (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    page_name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    meta_description TEXT,
    meta_keywords JSON, -- Array of strings
    content LONGTEXT NOT NULL,
    excerpt TEXT,
    featured_image VARCHAR(500),
    page_type ENUM('static', 'landing', 'blog', 'faq', 'about', 'policy', 'help', 'news', 'tutorial') DEFAULT 'static',
    category VARCHAR(100),
    tags JSON, -- Array of strings
    author VARCHAR(100),
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_page_type (page_type),
    INDEX idx_is_published (is_published),
    INDEX idx_slug (slug),
    INDEX idx_created_at (created_at)
);
```

### Alternative for PostgreSQL:
```sql
CREATE TABLE cms_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    meta_description TEXT,
    meta_keywords JSONB, -- Array of strings
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image VARCHAR(500),
    page_type VARCHAR(20) CHECK (page_type IN ('static', 'landing', 'blog', 'faq', 'about', 'policy', 'help', 'news', 'tutorial')) DEFAULT 'static',
    category VARCHAR(100),
    tags JSONB, -- Array of strings
    author VARCHAR(100),
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cms_page_type ON cms_pages(page_type);
CREATE INDEX idx_cms_is_published ON cms_pages(is_published);
CREATE INDEX idx_cms_slug ON cms_pages(slug);
CREATE INDEX idx_cms_created_at ON cms_pages(created_at);
```

## API Endpoints Specification

### Base URL: `/api/v1/cms`

### 1. GET `/api/v1/cms/pages` - List All CMS Pages
**Purpose**: Retrieve all CMS pages with optional filtering

**Request**:
```
GET /api/v1/cms/pages?page_type=about&is_published=true&limit=10&offset=0
```

**Query Parameters**:
- `page_type` (optional): Filter by page type
- `is_published` (optional): Filter by publication status (true/false)
- `category` (optional): Filter by category
- `search` (optional): Search in page_name, title, or content
- `limit` (optional): Number of records to return (default: 50)
- `offset` (optional): Number of records to skip (default: 0)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "page_name": "About Us",
      "slug": "about-us",
      "title": "About Our Company - Learn Our Story",
      "meta_description": "Learn about our company's mission...",
      "meta_keywords": ["about", "company", "mission"],
      "content": "<h1>About Our Company</h1><p>Welcome to...</p>",
      "excerpt": "Learn about our company's mission...",
      "featured_image": "https://example.com/image.jpg",
      "page_type": "about",
      "category": "Company Info",
      "tags": ["about", "company", "team"],
      "author": "Admin",
      "is_published": true,
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-20T15:30:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 10,
    "offset": 0,
    "has_more": true
  },
  "message": "CMS pages retrieved successfully"
}
```

### 2. POST `/api/v1/cms/page` - Create New CMS Page
**Purpose**: Create a new CMS page

**Request Body**:
```json
{
  "page_name": "About Us",
  "slug": "about-us", // Optional, auto-generate from page_name if not provided
  "title": "About Our Company - Learn Our Story",
  "meta_description": "Learn about our company's mission...",
  "meta_keywords": ["about", "company", "mission"],
  "content": "<h1>About Our Company</h1><p>Welcome to...</p>",
  "excerpt": "Learn about our company's mission...",
  "featured_image": "https://example.com/image.jpg",
  "page_type": "about",
  "category": "Company Info",
  "tags": ["about", "company", "team"],
  "author": "Admin",
  "is_published": false
}
```

**Validation Rules**:
- `page_name`: Required, max 255 characters
- `slug`: Optional, auto-generate if not provided, must be unique, URL-friendly
- `title`: Required, max 500 characters
- `content`: Required
- `page_type`: Must be one of the enum values
- `meta_keywords`: Array of strings, max 20 keywords
- `tags`: Array of strings, max 10 tags

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "page_name": "About Us",
    // ... full page object
  },
  "message": "CMS page created successfully"
}
```

### 3. GET `/api/v1/cms/page/{id}` - Get Single CMS Page
**Purpose**: Retrieve a specific CMS page by ID

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "page_name": "About Us",
    // ... full page object
  },
  "message": "CMS page retrieved successfully"
}
```

### 4. PUT `/api/v1/cms/page/{id}` - Update CMS Page
**Purpose**: Update an existing CMS page

**Request Body**: Same as POST, but all fields optional except those being updated

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "page_name": "Updated About Us",
    // ... full updated page object
  },
  "message": "CMS page updated successfully"
}
```

### 5. DELETE `/api/v1/cms/page/{id}` - Delete CMS Page
**Purpose**: Delete a CMS page

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid-string"
  },
  "message": "CMS page deleted successfully"
}
```

## Error Responses

### Validation Error (400):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "page_name": "Page name is required",
    "slug": "Slug must be unique"
  }
}
```

### Not Found (404):
```json
{
  "success": false,
  "message": "CMS page not found"
}
```

### Server Error (500):
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details for debugging"
}
```

## Business Logic Requirements

### Slug Generation
- If slug is not provided, auto-generate from page_name
- Convert to lowercase, replace spaces with hyphens, remove special characters
- Ensure uniqueness by appending numbers if needed
- Example: "About Us" → "about-us", "About Us 2" → "about-us-2"

### Content Sanitization
- Sanitize HTML content to prevent XSS attacks
- Allow safe HTML tags: h1-h6, p, div, span, a, ul, ol, li, strong, em, img, br
- Remove script tags and dangerous attributes

### SEO Optimization
- Auto-generate meta_description from excerpt or first 160 chars of content if not provided
- Validate meta_description length (max 160 characters)
- Process meta_keywords as array of strings

## Authentication & Authorization
- All endpoints require authentication via Bearer token
- Check user permissions for CMS management
- Log all CMS operations for audit trail

## Implementation Notes

### Database Considerations
1. Use transactions for create/update operations
2. Index frequently queried fields (page_type, is_published, slug)
3. Consider full-text search on content for search functionality
4. Store JSON fields (meta_keywords, tags) properly based on your database

### Performance Optimizations
1. Implement database pagination for large datasets
2. Cache frequently accessed published pages
3. Use database indexes effectively
4. Consider CDN for featured images

### Content Management
1. Version control: Consider adding version tracking for content changes
2. Backup: Regular backups of CMS content
3. Media management: Implement proper image upload and management system

## Frontend Integration Points

The frontend expects:
1. All API responses in the specified JSON format
2. Proper HTTP status codes
3. Consistent error message structure
4. ISO 8601 timestamp format for dates
5. Base64 or URL-based image handling

## Example Implementation (Node.js/Express)

```javascript
// Example controller structure
const CmsController = {
  // GET /api/v1/cms/pages
  async getAllPages(req, res) {
    try {
      const { page_type, is_published, limit = 50, offset = 0 } = req.query;
      // Implementation here
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  // POST /api/v1/cms/page
  async createPage(req, res) {
    try {
      // Validate input
      // Generate slug if not provided
      // Sanitize content
      // Save to database
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  // PUT /api/v1/cms/page/:id
  async updatePage(req, res) {
    try {
      // Validate input
      // Check if page exists
      // Update database
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  // DELETE /api/v1/cms/page/:id
  async deletePage(req, res) {
    try {
      // Check if page exists
      // Delete from database
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
};
```

## Testing Requirements

1. Unit tests for all CRUD operations
2. Integration tests for API endpoints
3. Test data validation and sanitization
4. Test error handling scenarios
5. Performance testing for large datasets

## Security Considerations

1. Input validation and sanitization
2. SQL injection prevention
3. XSS prevention in content
4. Authentication and authorization
5. Rate limiting on API endpoints
6. Audit logging for all operations

---

**Questions or clarifications needed? Please reach out to the frontend team.**

**Frontend Contact**: [Your contact information]
**Documentation Updated**: October 1, 2025