import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { BlogPost, BlogPostMetadata } from '@/app/types/BlogPost';
import type { Show, ShowMetadata } from '@/app/types/Show';
import readingTime from 'reading-time';

const documentsDirectory = path.join(process.cwd(), 'documents');
const showsDirectory = path.join(process.cwd(), 'show');

/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Get all markdown files from a directory
 */
function getMarkdownFiles(directory: string): string[] {
  try {
    if (!fs.existsSync(directory)) {
      return [];
    }
    return fs.readdirSync(directory).filter((file) => file.endsWith('.md'));
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error);
    return [];
  }
}

/**
 * Get a single blog post by slug - returns raw markdown
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const files = getMarkdownFiles(documentsDirectory);
    
    for (const file of files) {
      const filePath = path.join(documentsDirectory, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      
      const postSlug = data.slug || generateSlug(file.replace(/\.md$/, ''));
      
      if (postSlug === slug) {
        const stats = readingTime(content);
        
        return {
          slug: postSlug,
          title: data.title || 'Untitled',
          excerpt: data.excerpt || '',
          content, // Return raw markdown instead of HTML
          tags: data.tags || [],
          dateAdded: data.dateAdded || data.date || new Date().toISOString(),
          dateModified: data.dateModified || data.dateAdded || data.date || new Date().toISOString(),
          thumbnail: data.thumbnail || '',
          coverImage: data.coverImage || data.thumbnail || '',
          readingTime: stats.text,
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting post by slug:', error);
    return null;
  }
}

/**
 * Get all blog posts with their metadata
 */
export async function getAllPosts(): Promise<BlogPostMetadata[]> {
  try {
    const files = getMarkdownFiles(documentsDirectory);
    
    const posts = files.map((file) => {
      const filePath = path.join(documentsDirectory, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      const stats = readingTime(content);
      
      const slug = data.slug || generateSlug(file.replace(/\.md$/, ''));
      
      return {
        slug,
        title: data.title || 'Untitled',
        excerpt: data.excerpt || '',
        tags: data.tags || [],
        dateAdded: data.dateAdded || data.date || new Date().toISOString(),
        dateModified: data.dateModified || data.dateAdded || data.date || new Date().toISOString(),
        thumbnail: data.thumbnail || '',
        coverImage: data.coverImage || data.thumbnail || '',
        readingTime: stats.text,
      };
    });
    
    return posts.sort((a, b) => 
      new Date(b.dateModified).getTime() - new Date(a.dateModified).getTime()
    );
  } catch (error) {
    console.error('Error getting all posts:', error);
    return [];
  }
}

/**
 * Get a single show by slug - returns raw markdown
 */
export async function getShowBySlug(slug: string): Promise<Show | null> {
  try {
    const files = getMarkdownFiles(showsDirectory);
    
    for (const file of files) {
      const filePath = path.join(showsDirectory, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      
      const showSlug = data.slug || generateSlug(file.replace(/\.md$/, ''));
      
      if (showSlug === slug) {
        const stats = readingTime(content);
        
        return {
          slug: showSlug,
          title: data.title || 'Untitled Show',
          summary: data.summary || '',
          content, // Return raw markdown instead of HTML
          metaDesc: data.metaDesc || data.summary || '',
          date: data.date || new Date().toISOString(),
          author: data.author || '',
          show: data.show || '',
          subtitle: data.subtitle || '',
          featuredImage: data.featuredImage || '',
          socialImage: data.socialImage || data.featuredImage || '',
          alt: data.alt || data.title || '',
          showlink: data.showlink || '',
          section: data.section || 'show',
          number: data.number || 0,
          tags: data.tags || [],
          readingTime: stats.text,
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting show by slug:', error);
    return null;
  }
}

/**
 * Get all shows with their metadata
 */
export async function getAllShows(): Promise<ShowMetadata[]> {
  try {
    const files = getMarkdownFiles(showsDirectory);
    
    const shows = files.map((file) => {
      const filePath = path.join(showsDirectory, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      const stats = readingTime(content);
      
      const slug = data.slug || generateSlug(file.replace(/\.md$/, ''));
      
      return {
        slug,
        title: data.title || 'Untitled Show',
        summary: data.summary || '',
        metaDesc: data.metaDesc || data.summary || '',
        date: data.date || new Date().toISOString(),
        author: data.author || '',
        show: data.show || '',
        subtitle: data.subtitle || '',
        featuredImage: data.featuredImage || '',
        socialImage: data.socialImage || data.featuredImage || '',
        alt: data.alt || data.title || '',
        showlink: data.showlink || '',
        section: data.section || 'show',
        number: data.number || 0,
        tags: data.tags || [],
        readingTime: stats.text,
      };
    });
    
    return shows.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error('Error getting all shows:', error);
    return [];
  }
}

/**
 * Get all unique tags from all posts
 */
export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tagsSet = new Set<string>();
  
  posts.forEach((post) => {
    post.tags.forEach((tag) => tagsSet.add(tag));
  });
  
  return Array.from(tagsSet).sort();
}

/**
 * Filter posts by tag
 */
export async function getPostsByTag(tag: string): Promise<BlogPostMetadata[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => 
    post.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * Get paginated posts
 */
export interface PaginatedPosts {
  posts: BlogPostMetadata[];
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export async function getPaginatedPosts(
  page: number = 1,
  pageSize: number = 20,
  tag?: string
): Promise<PaginatedPosts> {
  let posts = tag ? await getPostsByTag(tag) : await getAllPosts();
  
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / pageSize);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  posts = posts.slice(startIndex, endIndex);
  
  return {
    posts,
    currentPage,
    totalPages,
    totalPosts,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}

