'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { FileText } from 'lucide-react';

interface BlogPostImageProps extends Omit<ImageProps, 'src' | 'onError'> {
  src: string;
  alt: string;
}

export function BlogPostImage({ src, alt, className, ...props }: BlogPostImageProps) {
  const [imageError, setImageError] = useState(false);

  // Check if image path looks valid (not empty and starts with / or http)
  const hasValidImagePath = src && (src.startsWith('/') || src.startsWith('http'));

  if (!hasValidImagePath || imageError) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 ${className || ''}`}>
        <FileText className="h-24 w-24 text-gray-400" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
      {...props}
    />
  );
}

