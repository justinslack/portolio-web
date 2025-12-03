import Link from "next/link";
import { getFolders, getRecords } from "../lib/discogs-api";
import CollectionView from "../components/CollectionView";
import ReleaseCard from "../components/ReleaseCard";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

interface PageProps {
  searchParams: Promise<{ page?: string; folder?: string }>;
}

// Generate dynamic metadata based on page and folder
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const folderId = Number(params.folder) || 0;
  
  const folders = await getFolders();
  const currentFolder = folders.find((f) => f.id === folderId) || folders.find((f) => f.id === 0);
  
  const folderName = currentFolder?.name || 'All Records';
  const title = currentPage > 1 
    ? `${folderName} - Page ${currentPage}`
    : folderName;
  
  const recordCount = currentFolder?.count || 'my';
  const pageInfo = currentPage > 1 ? ` - Page ${currentPage}` : '';
  const description = `Browse ${recordCount} vinyl records${pageInfo}`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function Home({ searchParams }: Readonly<PageProps>) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const folderId = Number(params.folder) || 0;

  const [folders, { records, totalPages }] = await Promise.all([
    getFolders(),
    getRecords(currentPage, folderId),
  ]);

  const currentFolder =
    folders.find((f) => f.id === folderId) || folders.find((f) => f.id === 0);

  // Helper function to build pagination URLs
  const buildPageUrl = (page: number) => {
    const urlParams = new URLSearchParams();
    urlParams.set("page", page.toString());
    if (folderId !== 0) {
      urlParams.set("folder", folderId.toString());
    }
    return `?${urlParams.toString()}`;
  };

  return (
    <div className="bg-gray-100">
      <main className="m-auto max-w-7xl p-8">
        {/* Navigation */}
        <div className="mb-8 flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/">← Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/lists">View My Lists →</Link>
          </Button>
        </div>

        {/* Folder Filter */}
        {folders.length > 0 && (
          <div className="mb-8">
            <label
              htmlFor="folder-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Filter by Folder ({folders.length} folders):
            </label>
            <div className="flex gap-2 flex-wrap">
              {folders.map((folder) => (
                <Button
                  key={folder.id}
                  variant={folderId === folder.id ? "default" : "outline"}
                  asChild
                >
                  <Link href={`?folder=${folder.id}`}>
                    {folder.name} 
                    {/* <span className="text-gray-500 text-sm">({folder.count})</span> */}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Current Folder Info */}
        {currentFolder && (
          <div className="mb-6">
            <h1 className="text-3xl font-bold">{currentFolder.name}</h1>
            <p className="text-gray-600">{currentFolder.count} records</p>
          </div>
        )}

        <CollectionView
          folderId={folderId}
          regularView={
            <>
              <div className="grid md:grid-cols-3 gap-8">
                {records.map((record, index) => {
                  // Only prioritize first 6 images (above the fold)
                  const shouldPriority = index < 6 && currentPage === 1;

                  return (
                    <ReleaseCard 
                      key={record.instance_id}
                      record={record}
                      shouldPriority={shouldPriority}
                    />
                  );
                })}
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-center items-center gap-4 mt-8 mb-8">
                {currentPage > 1 && (
                  <Button asChild>
                    <Link href={buildPageUrl(currentPage - 1)}>
                      Previous
                    </Link>
                  </Button>
                )}

                <span className="text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>

                {currentPage < totalPages && (
                  <Button asChild>
                    <Link href={buildPageUrl(currentPage + 1)}>
                      Next
                    </Link>
                  </Button>
                )}
              </div>
            </>
          }
        />
      </main>
    </div>
  );
}
