import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import type { BlogPost, BlogPostMetadata } from '@/app/types/BlogPost';
import readingTime from 'reading-time';

const documentsDirectory = path.join(process.cwd(), 'documents');

/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars except spaces and hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Get all markdown files from the documents directory
 */
function getDocumentFiles(): string[] {
  try {
    if (!fs.existsSync(documentsDirectory)) {
      return [];
    }
    return fs.readdirSync(documentsDirectory).filter((file) => file.endsWith('.md'));
  } catch (error) {
    console.error('Error reading documents directory:', error);
    return [];
  }
}

/**
 * Parse markdown content to HTML with syntax highlighting
 */
async function parseMarkdown(content: string): Promise<string> {
  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(content);
  
  return processedContent.toString();
}

/**
 * Get a single blog post by slug
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const files = getDocumentFiles();
    
    for (const file of files) {
      const filePath = path.join(documentsDirectory, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      
      const postSlug = data.slug || generateSlug(file.replace(/\.md$/, ''));
      
      if (postSlug === slug) {
        const htmlContent = await parseMarkdown(content);
        const stats = readingTime(content);
        
        return {
          slug: postSlug,
          title: data.title || 'Untitled',
          excerpt: data.excerpt || '',
          content: htmlContent,
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
    const files = getDocumentFiles();
    
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
    
    // Sort by dateModified, newest first
    return posts.sort((a, b) => 
      new Date(b.dateModified).getTime() - new Date(a.dateModified).getTime()
    );
  } catch (error) {
    console.error('Error getting all posts:', error);
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

