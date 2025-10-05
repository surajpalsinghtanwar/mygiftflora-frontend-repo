export interface CmsPage {
  id: string;
  pageName?: string;
  page_name?: string; // Backend snake_case format
  slug?: string;
  title: string;
  metaDescription?: string;
  meta_description?: string; // Backend snake_case format
  metaKeywords?: string[];
  meta_keywords?: string[]; // Backend snake_case format
  content: string;
  excerpt?: string;
  featuredImage?: string;
  featured_image?: string; // Backend snake_case format
  contentBlocks?: any;
  isPublished?: boolean;
  is_published?: boolean; // Backend snake_case format
  pageType?: PageType;
  page_type?: string; // Backend snake_case format
  category?: string;
  tags?: string[];
  author?: string;
  seoData?: any;
  createdAt?: string;
  created_at?: string; // Backend snake_case format
  updatedAt?: string;
  updated_at?: string; // Backend snake_case format
}

export const ContentStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

export type ContentStatus = typeof ContentStatus[keyof typeof ContentStatus];

export const PageType = {
  STATIC: 'static',
  LANDING: 'landing',
  BLOG: 'blog',
  FAQ: 'faq',
  ABOUT: 'about',
  POLICY: 'policy',
  HELP: 'help',
  NEWS: 'news',
  TUTORIAL: 'tutorial',
} as const;

export type PageType = typeof PageType[keyof typeof PageType];