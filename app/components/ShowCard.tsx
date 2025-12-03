'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Radio } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ShowMetadata } from '@/app/types/Show';

interface ShowCardProps {
  show: ShowMetadata;
}

export function ShowCard({ show }: ShowCardProps) {
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const hasValidImagePath = (path: string) => {
    return path && (path.startsWith('/') || path.startsWith('http'));
  };

  const shouldShowImage = hasValidImagePath(show.featuredImage) && !imageError;

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200 flex flex-col">
      <Link href={`/shows/${show.slug}`}>
        <div className="relative h-64 w-full overflow-hidden rounded-t-lg bg-gray-100">
          {shouldShowImage ? (
            <Image
              src={show.featuredImage}
              alt={show.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <Radio className="h-20 w-20 text-gray-400" />
            </div>
          )}
        </div>
      </Link>
      
      <CardHeader>
        <Link href={`/shows/${show.slug}`}>
          {show.show && (
            <p className="text-sm text-muted-foreground mb-1">{show.show}</p>
          )}
          <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
            {show.title}
          </CardTitle>
          {show.subtitle && (
            <p className="text-sm font-medium text-muted-foreground mt-1">{show.subtitle}</p>
          )}
        </Link>
        <CardDescription className="line-clamp-3 mt-2">{show.summary}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{formatDate(show.date)}</span>
          {show.readingTime && <span>{show.readingTime}</span>}
        </div>
      </CardContent>
      
      {show.showlink && (
        <CardFooter>
          <Button variant="outline" size="sm" asChild className="w-full">
            <a href={show.showlink} target="_blank" rel="noopener noreferrer">
              Listen on Mixcloud →
            </a>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

