import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShowCard } from '@/app/components/ShowCard';
import { ShowPagination } from '@/app/components/ShowPagination';
import { getPaginatedShows } from '@/app/lib/shows';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shows',
  description: 'Listen to radio shows and music mixes',
  openGraph: {
    title: 'Shows',
    description: 'Listen to radio shows and music mixes',
  },
};

interface ShowsPageProps {
  searchParams: Promise<{ readonly page?: string }>;
}

export default async function ShowsPage({ searchParams }: Readonly<ShowsPageProps>) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const paginatedData = await getPaginatedShows(page, 20);
  const { shows, currentPage, totalPages, totalShows } = paginatedData;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold">Shows</h1>
            <Button variant="outline" asChild>
              <Link href="/">← Home</Link>
            </Button>
          </div>
          <p className="text-xl text-gray-600">
            Radio shows and music mixes ({totalShows})
          </p>
        </div>

        {/* Shows Grid */}
        {shows.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {shows.map((show) => (
                <ShowCard key={show.slug} show={show} />
              ))}
            </div>

            {/* Pagination */}
            <ShowPagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/shows"
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-xl text-gray-600 mb-4">No shows available yet</p>
          </div>
        )}
      </main>
    </div>
  );
}

