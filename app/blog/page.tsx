import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BlogPostCard } from '@/app/components/BlogPostCard';
import { BlogPagination } from '@/app/components/BlogPagination';
import { getPaginatedPosts, getAllTags } from '@/app/lib/markdown';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read my latest thoughts, tutorials, and insights',
  openGraph: {
    title: 'Blog',
    description: 'Read my latest thoughts, tutorials, and insights',
  },
};

interface BlogPageProps {
  searchParams: Promise<{ readonly page?: string; readonly tag?: string }>;
}

export default async function BlogPage({ searchParams }: Readonly<BlogPageProps>) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const tag = params.tag;

  const [paginatedData, allTags] = await Promise.all([
    getPaginatedPosts(page, 20, tag),
    getAllTags(),
  ]);

  const { posts, currentPage, totalPages, totalPosts } = paginatedData;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold">Blog</h1>
            <Button variant="outline" asChild>
              <Link href="/">← Home</Link>
            </Button>
          </div>
          <p className="text-xl text-gray-600">
            {tag
              ? `Posts tagged with "${tag}" (${totalPosts})`
              : `All posts (${totalPosts})`}
          </p>
        </div>

        {/* Tag Filter */}
        {allTags.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-600 mb-3">Filter by tag:</h2>
            <div className="flex flex-wrap gap-2">
              {tag && (
                <Button variant="outline" asChild size="sm">
                  <Link href="/blog">Clear filter</Link>
                </Button>
              )}
              {allTags.map((tagName) => (
                <Link key={tagName} href={`/blog?tag=${encodeURIComponent(tagName)}`}>
                  <Badge
                    variant={tag === tagName ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  >
                    {tagName}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        {posts.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogPostCard key={post.slug} post={post} />
              ))}
            </div>

            {/* Pagination */}
            <BlogPagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/blog"
              tag={tag}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-xl text-gray-600 mb-4">
              {tag ? `No posts found with tag "${tag}"` : 'No blog posts yet'}
            </p>
            {tag && (
              <Button variant="outline" asChild>
                <Link href="/blog">View all posts</Link>
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

