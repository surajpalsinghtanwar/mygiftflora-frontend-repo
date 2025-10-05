import type { NextApiRequest, NextApiResponse } from 'next';

// Mock CMS pages data - replace with actual database integration
let cmsPages = [
  {
    id: '1',
    pageName: 'About Us',
    slug: 'about-us',
    title: 'About Our Company - Learn Our Story',
    metaDescription: 'Learn about our company\'s mission, values, and the team behind our success. Discover our journey and what makes us unique.',
    metaKeywords: ['about', 'company', 'mission', 'team', 'story'],
    content: `<h1>About Our Company</h1>
<p>Welcome to our company! We are dedicated to providing exceptional products and services to our customers.</p>
<h2>Our Mission</h2>
<p>To deliver high-quality solutions that exceed customer expectations while maintaining the highest standards of integrity and innovation.</p>
<h2>Our Team</h2>
<p>Our experienced team brings together diverse skills and expertise to serve our customers better.</p>`,
    excerpt: 'Learn about our company\'s mission, values, and the dedicated team behind our success.',
    featuredImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
    pageType: 'about',
    category: 'Company Info',
    tags: ['about', 'company', 'team'],
    author: 'Admin',
    isPublished: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  {
    id: '2',
    pageName: 'Privacy Policy',
    slug: 'privacy-policy',
    title: 'Privacy Policy - How We Protect Your Data',
    metaDescription: 'Read our comprehensive privacy policy to understand how we collect, use, and protect your personal information.',
    metaKeywords: ['privacy', 'policy', 'data protection', 'GDPR', 'personal information'],
    content: `<h1>Privacy Policy</h1>
<p>Last updated: January 1, 2024</p>
<h2>Information We Collect</h2>
<p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us.</p>
<h2>How We Use Your Information</h2>
<p>We use the information we collect to provide, maintain, and improve our services.</p>`,
    excerpt: 'Understand how we collect, use, and protect your personal information with our comprehensive privacy policy.',
    featuredImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
    pageType: 'policy',
    category: 'Legal',
    tags: ['privacy', 'policy', 'legal', 'GDPR'],
    author: 'Legal Team',
    isPublished: true,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-15T11:45:00Z',
  },
  {
    id: '3',
    pageName: 'Welcome Landing',
    slug: 'welcome',
    title: 'Welcome to Our Amazing Platform',
    metaDescription: 'Join thousands of satisfied customers who trust our platform for their needs. Get started today!',
    metaKeywords: ['welcome', 'platform', 'get started', 'sign up'],
    content: `<div class="hero-section">
<h1>Welcome to Our Platform</h1>
<p class="lead">Experience the difference with our innovative solutions.</p>
<a href="/signup" class="btn btn-primary">Get Started Today</a>
</div>`,
    excerpt: 'Join thousands of satisfied customers who trust our platform for their needs.',
    featuredImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800',
    pageType: 'landing',
    category: 'Marketing',
    tags: ['welcome', 'landing', 'signup'],
    author: 'Marketing Team',
    isPublished: false,
    createdAt: '2024-01-25T14:00:00Z',
    updatedAt: '2024-01-25T16:20:00Z',
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      // Get all CMS pages
      try {
        res.status(200).json({
          success: true,
          data: cmsPages,
          message: 'CMS pages fetched successfully',
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch CMS pages',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
      break;

    case 'POST':
      // Create new CMS page
      try {
        const { 
          pageName, 
          slug, 
          title, 
          metaDescription, 
          metaKeywords, 
          content, 
          excerpt,
          featuredImage,
          pageType, 
          category,
          tags,
          author,
          isPublished 
        } = req.body;

        // Validation
        if (!pageName || !title || !content) {
          return res.status(400).json({
            success: false,
            message: 'Page name, title, and content are required',
          });
        }

        // Check if slug already exists
        const finalSlug = slug || pageName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
        const slugExists = cmsPages.some(page => page.slug === finalSlug);
        if (slugExists) {
          return res.status(400).json({
            success: false,
            message: 'A page with this slug already exists',
          });
        }

        // Generate new ID
        const newId = (cmsPages.length + 1).toString();
        const now = new Date().toISOString();

        const newPage = {
          id: newId,
          pageName,
          slug: finalSlug,
          title,
          metaDescription: metaDescription || '',
          metaKeywords: metaKeywords || [],
          content,
          excerpt: excerpt || '',
          featuredImage: featuredImage || '',
          pageType: pageType || 'static',
          category: category || '',
          tags: tags || [],
          author: author || '',
          isPublished: isPublished || false,
          createdAt: now,
          updatedAt: now,
        };

        cmsPages.push(newPage);

        res.status(201).json({
          success: true,
          data: newPage,
          message: 'CMS page created successfully',
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Failed to create CMS page',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({
        success: false,
        message: `Method ${method} Not Allowed`,
      });
  }
}