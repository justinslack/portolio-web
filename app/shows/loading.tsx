import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export default function ShowsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl p-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-12 w-48 mb-4" />
          <Skeleton className="h-6 w-64" />
        </div>

        {/* Shows Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-full">
              <Skeleton className="h-64 w-full rounded-t-lg" />
              <CardHeader>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-32" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

