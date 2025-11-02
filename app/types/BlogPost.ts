export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  dateAdded: string;
  dateModified: string;
  thumbnail: string;
  coverImage: string;
  readingTime?: string;
}

export interface BlogPostMetadata {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  dateAdded: string;
  dateModified: string;
  thumbnail: string;
  coverImage: string;
  readingTime?: string;
}

