import Link from 'next/link';
import { Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <Radio className="mx-auto h-24 w-24 text-gray-400 mb-6" />
        <h1 className="text-4xl font-bold mb-4">Show Not Found</h1>
        <p className="text-xl text-gray-600 mb-8">
          The show you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild>
          <Link href="/shows">← Back to Shows</Link>
        </Button>
      </div>
    </div>
  );
}

