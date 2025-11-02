import Link from 'next/link';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <FileQuestion className="mx-auto h-24 w-24 text-gray-400 mb-6" />
        <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
        <p className="text-xl text-gray-600 mb-8">
          The blog post you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild>
          <Link href="/blog">← Back to Blog</Link>
        </Button>
      </div>
    </div>
  );
}

