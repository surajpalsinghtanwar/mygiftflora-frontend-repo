export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address?: string;
  supportEmail?: string;
  supportPhone?: string;
}

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  ogImage?: string;
  favicon?: string;
}

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  fontFamily?: string;
  logoWidth?: number;
  logoHeight?: number;
}

export interface PlatformSettings {
  id?: string;
  siteName: string;
  logoUrl: string;
  darkLogoUrl?: string;
  siteUrl: string;
  contact: ContactInfo;
  social: SocialLinks;
  seo: SeoSettings;
  theme: ThemeSettings;
  maintenance: {
    enabled: boolean;
    message?: string;
  };
  smtp?: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  createdAt?: string;
  updatedAt?: string;
}
