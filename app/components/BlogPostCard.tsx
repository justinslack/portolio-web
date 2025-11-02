'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { BlogPostMetadata } from '@/app/types/BlogPost';

interface BlogPostCardProps {
  post: BlogPostMetadata;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // Check if image path looks valid (not empty and starts with / or http)
  const hasValidImagePath = (path: string) => {
    return path && (path.startsWith('/') || path.startsWith('http'));
  };

  const shouldShowImage = hasValidImagePath(post.thumbnail) && !imageError;

  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow duration-200">
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-gray-100">
          {shouldShowImage ? (
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <FileText className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </div>
        
        <CardHeader>
          <CardTitle className="line-clamp-2">{post.title}</CardTitle>
          <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="outline">+{post.tags.length - 3}</Badge>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <span>{formatDate(post.dateModified)}</span>
          {post.readingTime && <span>{post.readingTime}</span>}
        </CardFooter>
      </Card>
    </Link>
  );
}

