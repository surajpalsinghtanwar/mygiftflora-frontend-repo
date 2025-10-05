# CMS System Documentation

## Overview
The CMS (Content Management System) allows you to create and manage website pages like About Us, Privacy Policy, FAQ, Contact Us, and other static content pages.

## Features

### 🎯 Key Capabilities
- **Rich Text Editor**: Full-featured WYSIWYG editor with formatting options
- **Page Templates**: Pre-built templates for common pages
- **SEO Optimization**: Meta descriptions, keywords, and SEO-friendly URLs
- **Content Organization**: Categories, tags, and author attribution
- **Draft/Publish System**: Save drafts and publish when ready

### 📄 Available Page Templates
1. **About Us**: Company story, mission, vision, values, and team info
2. **Privacy Policy**: Data protection and privacy information
3. **Terms & Conditions**: Service terms and legal information
4. **FAQ**: Frequently asked questions with structured Q&A format
5. **Contact Us**: Contact information, address, and social media links

### 🛠️ Page Types
- **Static**: Regular informational pages
- **About**: Company and team information
- **FAQ**: Question and answer pages
- **Policy**: Legal and compliance pages
- **Help**: Support and assistance pages

## How to Use

### Creating a New Page
1. Navigate to **Admin Panel > Content Management > Website Pages**
2. Click **"Add New Page"**
3. Choose a template or start blank:
   - Click template buttons for pre-filled content
   - Click "Start Blank" for custom content
4. Fill in the page information:
   - **Page Name**: Internal reference name
   - **URL Slug**: SEO-friendly URL (auto-generated)
   - **Title**: Page title for SEO
   - **Type**: Select appropriate page type
   - **Category**: Organize pages by category
   - **Author**: Content creator name
5. Add content using the rich text editor
6. Set SEO information (meta description, keywords)
7. Choose to save as draft or publish immediately

### Managing Existing Pages
1. View all pages in the CMS list
2. Filter by type, status, or search by name
3. Edit pages by clicking the edit button
4. Delete pages with confirmation prompt

### Rich Text Editor Features
- **Formatting**: Bold, italic, underline, strikethrough
- **Headings**: H1-H6 heading styles
- **Lists**: Ordered and unordered lists
- **Links**: Add hyperlinks to text
- **Images**: Insert images (requires URL)
- **Alignment**: Left, center, right, justify
- **Colors**: Text and background colors
- **Code**: Inline code and code blocks
- **Quotes**: Blockquotes for emphasis

## File Structure
```
src/pages/admin/content-management/
├── index.tsx                 # Content management overview
└── cms/
    ├── index.tsx            # CMS pages list
    ├── create.tsx           # Create new page
    └── edit/[id].tsx        # Edit existing page

src/components/
└── RichTextEditor.tsx       # Rich text editor component

src/types/
└── cms.ts                   # CMS type definitions

src/store/
└── cmsSlice.ts             # Redux store for CMS

src/pages/api/cms/
├── pages.ts                # API for listing/creating pages
└── page/[id].ts            # API for individual page operations
```

## API Endpoints
- `GET /api/cms/pages` - List all CMS pages
- `POST /api/cms/pages` - Create new page
- `GET /api/cms/page/[id]` - Get specific page
- `PUT /api/cms/page/[id]` - Update page
- `DELETE /api/cms/page/[id]` - Delete page

## Navigation
- Access CMS from: **Admin Panel > Content Management > Website Pages**
- Direct URL: `/admin/content-management/cms`

## Best Practices
1. **Use Templates**: Start with templates for consistency
2. **SEO Optimization**: Always fill meta descriptions and keywords
3. **Content Organization**: Use categories to group related pages
4. **Draft First**: Save as draft, review, then publish
5. **Regular Updates**: Keep content current and relevant
6. **URL Slugs**: Use SEO-friendly URLs (auto-generated but editable)

## Technical Notes
- Built with Next.js and React
- Uses React Quill for rich text editing
- Redux for state management
- Bootstrap for styling
- TypeScript for type safety

## Future Enhancements
- [ ] Image upload functionality
- [ ] Content blocks/widgets
- [ ] Page preview functionality
- [ ] Content versioning
- [ ] Multi-language support
- [ ] Content scheduling