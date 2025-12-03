export interface Show {
  slug: string;
  title: string;
  summary: string;
  content: string;
  metaDesc?: string;
  date: string;
  author?: string;
  show?: string;
  subtitle?: string;
  featuredImage: string;
  socialImage?: string;
  alt?: string;
  showlink?: string;
  section?: string;
  number?: number;
  tags?: string[];
  readingTime?: string;
}

export interface ShowMetadata {
  slug: string;
  title: string;
  summary: string;
  metaDesc?: string;
  date: string;
  author?: string;
  show?: string;
  subtitle?: string;
  featuredImage: string;
  socialImage?: string;
  alt?: string;
  showlink?: string;
  section?: string;
  number?: number;
  tags?: string[];
  readingTime?: string;
}

