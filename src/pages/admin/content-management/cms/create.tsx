import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import type { AppDispatch, RootState } from '../../../../store/store';
import { createCmsPage, clearError, clearSuccess } from '../../../../store/cmsSlice';
import { PageType } from '../../../../types/cms';
import AdminLayout from '../../../../layouts/AdminLayout';
import RichTextEditor from '../../../../components/RichTextEditor';

const CreateCmsPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  // Safe destructuring with fallbacks
  const cmsState = useSelector((state: RootState) => state?.cms);
  const loading = cmsState?.loading || false;
  const error = cmsState?.error || null;
  const success = cmsState?.success || false;
  const message = cmsState?.message || null;

  const [formData, setFormData] = useState({
    pageName: '',
    slug: '',
    title: '',
    metaDescription: '',
    metaKeywords: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    pageType: 'static' as PageType,
    category: '',
    tags: '',
    author: '',
    isPublished: false,
  });

  // Predefined page templates for common website pages
  const pageTemplates = {
    'about-us': {
      pageName: 'About Us',
      title: 'About Us - Our Story',
      pageType: PageType.ABOUT,
      category: 'Company Info',
      content: `<h1>About Our Company</h1>
<p>Welcome to our company! We are passionate about providing exceptional products and services.</p>

<h2>Our Mission</h2>
<p>To deliver high-quality solutions that exceed customer expectations while maintaining the highest standards of integrity and innovation.</p>

<h2>Our Vision</h2>
<p>To be the leading provider in our industry, recognized for our commitment to excellence and customer satisfaction.</p>

<h2>Our Values</h2>
<ul>
<li><strong>Quality:</strong> We never compromise on quality</li>
<li><strong>Innovation:</strong> We continuously improve and innovate</li>
<li><strong>Customer Focus:</strong> Our customers are at the heart of everything we do</li>
<li><strong>Integrity:</strong> We conduct business with honesty and transparency</li>
</ul>

<h2>Our Team</h2>
<p>Our experienced team brings together diverse skills and expertise to serve our customers better.</p>`,
      excerpt: 'Learn about our company mission, vision, values, and the dedicated team behind our success.',
    },
    'privacy-policy': {
      pageName: 'Privacy Policy',
      title: 'Privacy Policy - How We Protect Your Data',
      pageType: PageType.POLICY,
      category: 'Legal',
      content: `<h1>Privacy Policy</h1>
<p><strong>Last updated:</strong> [Date]</p>

<h2>1. Information We Collect</h2>
<p>We collect information you provide directly to us, such as when you:</p>
<ul>
<li>Create an account</li>
<li>Make a purchase</li>
<li>Contact us for support</li>
<li>Subscribe to our newsletter</li>
</ul>

<h2>2. How We Use Your Information</h2>
<p>We use the information we collect to:</p>
<ul>
<li>Provide, maintain, and improve our services</li>
<li>Process transactions and send related information</li>
<li>Send technical notices and support messages</li>
<li>Communicate with you about products, services, and events</li>
</ul>

<h2>3. Information Sharing</h2>
<p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>

<h2>4. Data Security</h2>
<p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>

<h2>5. Contact Us</h2>
<p>If you have any questions about this Privacy Policy, please contact us at [contact information].</p>`,
      excerpt: 'Understand how we collect, use, and protect your personal information.',
    },
    'terms-conditions': {
      pageName: 'Terms & Conditions',
      title: 'Terms and Conditions',
      pageType: PageType.POLICY,
      category: 'Legal',
      content: `<h1>Terms and Conditions</h1>
<p><strong>Last updated:</strong> [Date]</p>

<h2>1. Acceptance of Terms</h2>
<p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>

<h2>2. Use License</h2>
<p>Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only.</p>

<h2>3. Disclaimer</h2>
<p>The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

<h2>4. Limitations</h2>
<p>In no event shall our company or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.</p>

<h2>5. Contact Information</h2>
<p>If you have any questions about these Terms and Conditions, please contact us at [contact information].</p>`,
      excerpt: 'Please read our terms and conditions carefully before using our services.',
    },
    'faq': {
      pageName: 'Frequently Asked Questions',
      title: 'FAQ - Frequently Asked Questions',
      pageType: PageType.FAQ,
      category: 'Support',
      content: `<h1>Frequently Asked Questions</h1>
<p>Find answers to common questions about our products and services.</p>

<h2>General Questions</h2>

<h3>Q: What products/services do you offer?</h3>
<p>A: We offer [describe your main products/services here].</p>

<h3>Q: How can I contact customer support?</h3>
<p>A: You can reach our customer support team through [contact methods].</p>

<h3>Q: What are your business hours?</h3>
<p>A: Our business hours are [business hours].</p>

<h2>Account & Ordering</h2>

<h3>Q: How do I create an account?</h3>
<p>A: To create an account, click on "Sign Up" and follow the registration process.</p>

<h3>Q: How do I place an order?</h3>
<p>A: [Explain your ordering process].</p>

<h3>Q: What payment methods do you accept?</h3>
<p>A: We accept [list payment methods].</p>

<h2>Shipping & Returns</h2>

<h3>Q: What is your shipping policy?</h3>
<p>A: [Explain shipping policy].</p>

<h3>Q: What is your return policy?</h3>
<p>A: [Explain return policy].</p>

<p><strong>Still have questions?</strong> Please don't hesitate to <a href="/contact">contact us</a>.</p>`,
      excerpt: 'Find answers to frequently asked questions about our products, services, and policies.',
    },
    'contact': {
      pageName: 'Contact Us',
      title: 'Contact Us - Get in Touch',
      pageType: PageType.STATIC,
      category: 'Contact',
      content: `<h1>Contact Us</h1>
<p>We'd love to hear from you! Get in touch with us through any of the following methods:</p>

<h2>Contact Information</h2>
<div class="row">
<div class="col-md-6">
<h3>📍 Address</h3>
<p>[Your Business Address]<br>
[City, State, ZIP Code]<br>
[Country]</p>

<h3>📞 Phone</h3>
<p><strong>Main:</strong> [Main Phone Number]<br>
<strong>Support:</strong> [Support Phone Number]</p>
</div>
<div class="col-md-6">
<h3>📧 Email</h3>
<p><strong>General:</strong> [General Email]<br>
<strong>Support:</strong> [Support Email]<br>
<strong>Sales:</strong> [Sales Email]</p>

<h3>🕒 Business Hours</h3>
<p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM<br>
<strong>Saturday:</strong> 10:00 AM - 4:00 PM<br>
<strong>Sunday:</strong> Closed</p>
</div>
</div>

<h2>Send Us a Message</h2>
<p>For specific inquiries, please use our <a href="/contact-form">contact form</a> and we'll get back to you as soon as possible.</p>

<h2>Follow Us</h2>
<p>Stay connected with us on social media:</p>
<ul>
<li><a href="#">Facebook</a></li>
<li><a href="#">Twitter</a></li>
<li><a href="#">Instagram</a></li>
<li><a href="#">LinkedIn</a></li>
</ul>`,
      excerpt: 'Get in touch with us through phone, email, or visit our office. We\'re here to help!',
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Auto-generate slug from page name
      if (name === 'pageName') {
        const slug = value.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        setFormData(prev => ({ ...prev, slug }));
      }
    }
  };

  const handleTemplateSelect = (templateKey: string) => {
    const template = pageTemplates[templateKey as keyof typeof pageTemplates];
    if (template) {
      const slug = template.pageName.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      setFormData(prev => ({
        ...prev,
        pageName: template.pageName,
        slug: slug,
        title: template.title,
        pageType: template.pageType,
        category: template.category,
        content: template.content,
        excerpt: template.excerpt,
        metaDescription: template.excerpt,
        tags: template.category.toLowerCase(),
        author: 'Admin',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const pageData = {
        ...formData,
        metaKeywords: formData.metaKeywords ? formData.metaKeywords.split(',').map(k => k.trim()) : [],
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
      };
      
      await dispatch(createCmsPage(pageData)).unwrap();
      alert('CMS page created successfully!');
      router.push('/admin/content-management/cms');
    } catch (error) {
      // Error handled by useEffect
    }
  };

  React.useEffect(() => {
    if (error) {
      alert(`Error: ${error}`);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  React.useEffect(() => {
    if (success && message) {
      alert(`Success: ${message}`);
      dispatch(clearSuccess());
    }
  }, [success, message, dispatch]);

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>📄 Create New CMS Page</h3>
        <button 
          className="btn btn-secondary"
          onClick={() => router.push('/admin/content-management/cms')}
        >
          ← Back to CMS Pages
        </button>
      </div>

      <div className="row">
        <div className="col-lg-8">
          {/* Template Selection */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">📄 Quick Templates</h5>
            </div>
            <div className="card-body">
              <p className="text-muted mb-3">Choose a template to get started quickly with pre-filled content:</p>
              <div className="row g-2">
                <div className="col-md-4">
                  <button 
                    type="button"
                    className="btn btn-outline-primary w-100"
                    onClick={() => handleTemplateSelect('about-us')}
                  >
                    🏢 About Us
                  </button>
                </div>
                <div className="col-md-4">
                  <button 
                    type="button"
                    className="btn btn-outline-primary w-100"
                    onClick={() => handleTemplateSelect('privacy-policy')}
                  >
                    🔒 Privacy Policy
                  </button>
                </div>
                <div className="col-md-4">
                  <button 
                    type="button"
                    className="btn btn-outline-primary w-100"
                    onClick={() => handleTemplateSelect('terms-conditions')}
                  >
                    📋 Terms & Conditions
                  </button>
                </div>
                <div className="col-md-4">
                  <button 
                    type="button"
                    className="btn btn-outline-primary w-100"
                    onClick={() => handleTemplateSelect('faq')}
                  >
                    ❓ FAQ
                  </button>
                </div>
                <div className="col-md-4">
                  <button 
                    type="button"
                    className="btn btn-outline-primary w-100"
                    onClick={() => handleTemplateSelect('contact')}
                  >
                    📞 Contact Us
                  </button>
                </div>
                <div className="col-md-4">
                  <button 
                    type="button"
                    className="btn btn-outline-secondary w-100"
                    onClick={() => setFormData({
                      pageName: '',
                      slug: '',
                      title: '',
                      metaDescription: '',
                      metaKeywords: '',
                      content: '',
                      excerpt: '',
                      featuredImage: '',
                      pageType: 'static' as PageType,
                      category: '',
                      tags: '',
                      author: '',
                      isPublished: false,
                    })}
                  >
                    🆕 Start Blank
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Page Information</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Page Name <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name="pageName"
                        className="form-control"
                        value={formData.pageName}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter page name"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">URL Slug</label>
                      <input
                        type="text"
                        name="slug"
                        className="form-control"
                        value={formData.slug}
                        onChange={handleInputChange}
                        placeholder="auto-generated-from-name"
                      />
                      <div className="form-text">URL-friendly version of the page name</div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-8">
                    <div className="mb-3">
                      <label className="form-label">Page Title <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name="title"
                        className="form-control"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter page title for SEO"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Page Type</label>
                      <select
                        name="pageType"
                        className="form-select"
                        value={formData.pageType}
                        onChange={handleInputChange}
                      >
                        {Object.values(PageType).map(type => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <input
                        type="text"
                        name="category"
                        className="form-control"
                        value={formData.category}
                        onChange={handleInputChange}
                        placeholder="e.g., Company Info, Support, Legal"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Author</label>
                      <input
                        type="text"
                        name="author"
                        className="form-control"
                        value={formData.author}
                        onChange={handleInputChange}
                        placeholder="Content author name"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Excerpt/Summary</label>
                  <textarea
                    name="excerpt"
                    className="form-control"
                    rows={3}
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    placeholder="Brief summary of the page content"
                    maxLength={300}
                  />
                  <div className="form-text">
                    {formData.excerpt.length}/300 characters - Used in previews and search results
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Featured Image URL</label>
                  <input
                    type="url"
                    name="featuredImage"
                    className="form-control"
                    value={formData.featuredImage}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Meta Description</label>
                  <textarea
                    name="metaDescription"
                    className="form-control"
                    rows={3}
                    value={formData.metaDescription}
                    onChange={handleInputChange}
                    placeholder="Brief description for search engines (150-160 characters)"
                    maxLength={160}
                  />
                  <div className="form-text">
                    {formData.metaDescription.length}/160 characters
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Meta Keywords</label>
                  <input
                    type="text"
                    name="metaKeywords"
                    className="form-control"
                    value={formData.metaKeywords}
                    onChange={handleInputChange}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                  <div className="form-text">Separate keywords with commas</div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Tags</label>
                  <input
                    type="text"
                    name="tags"
                    className="form-control"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="tag1, tag2, tag3"
                  />
                  <div className="form-text">Separate tags with commas</div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Page Content <span className="text-danger">*</span></label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                    placeholder="Enter the page content..."
                    height="400px"
                  />
                  <div className="form-text mt-2">Use the rich text editor to format your content</div>
                </div>

                <div className="mb-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="isPublished"
                      className="form-check-input"
                      id="isPublished"
                      checked={formData.isPublished}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="isPublished">
                      Publish this page immediately
                    </label>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? '⏳ Creating...' : '✅ Create Page'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => router.push('/admin/content-management/cms')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h6 className="card-title mb-0">💡 Website Page Templates</h6>
            </div>
            <div className="card-body">
              <div className="small">
                <div className="mb-3">
                  <strong>Available Templates:</strong>
                  <ul className="mt-1">
                    <li><strong>About Us:</strong> Company story, mission, vision</li>
                    <li><strong>Privacy Policy:</strong> Data protection information</li>
                    <li><strong>Terms & Conditions:</strong> Service terms</li>
                    <li><strong>FAQ:</strong> Frequently asked questions</li>
                    <li><strong>Contact Us:</strong> Contact information and form</li>
                  </ul>
                </div>
                <div className="mb-3">
                  <strong>Page Types:</strong>
                  <ul className="mt-1">
                    <li><strong>Static:</strong> Regular pages (Contact, Services)</li>
                    <li><strong>About:</strong> About us, team, company info</li>
                    <li><strong>FAQ:</strong> Frequently asked questions</li>
                    <li><strong>Policy:</strong> Terms, Privacy, legal pages</li>
                    <li><strong>Help:</strong> Support and help pages</li>
                  </ul>
                </div>
                <div className="mb-3">
                  <strong>SEO Tips:</strong>
                  <ul className="mt-1">
                    <li>Keep title under 60 characters</li>
                    <li>Meta description should be 150-160 characters</li>
                    <li>Use relevant keywords naturally</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-header">
              <h6 className="card-title mb-0">📝 Preview</h6>
            </div>
            <div className="card-body">
              <div className="small">
                <div className="mb-2">
                  <strong>URL:</strong> 
                  <code className="ms-1">
                    /page/{formData.slug || 'page-slug'}
                  </code>
                </div>
                <div className="mb-2">
                  <strong>Title:</strong> {formData.title || 'Page Title'}
                </div>
                <div className="mb-2">
                  <strong>Type:</strong> 
                  <span className="badge bg-info ms-1">
                    {formData.pageType.charAt(0).toUpperCase() + formData.pageType.slice(1)}
                  </span>
                </div>
                <div className="mb-2">
                  <strong>Category:</strong> {formData.category || 'None'}
                </div>
                <div className="mb-2">
                  <strong>Author:</strong> {formData.author || 'Not specified'}
                </div>
                <div>
                  <strong>Status:</strong> 
                  <span className={`badge ms-1 ${formData.isPublished ? 'bg-success' : 'bg-dark text-white'}`}>
                    {formData.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateCmsPage;