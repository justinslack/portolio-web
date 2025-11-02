import Image from "next/image";
import Link from "next/link";
import { getFolders, getRecords } from "./lib/discogs-api";
import CollectionView from "./components/CollectionView";
import { Button } from "@/components/ui/button";

interface PageProps {
  searchParams: Promise<{ page?: string; folder?: string }>;
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
              <div className="grid grid-cols-3 gap-12">
                {records.map((record) => {
                  const hasImage =
                    record.basic_information.cover_image &&
                    record.basic_information.cover_image !== "";

                  return (
                    <div key={record.instance_id} className="bg-card-foreground rounded-lg p-8 flex flex-col gap-2">
                      <div className="relative aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                        {hasImage ? (
                          <Image
                            src={record.basic_information.cover_image}
                            alt={record.basic_information.title}
                            width={300}
                            height={300}
                            priority
                          />
                        ) : (
                          <svg
                            width="150"
                            height="150"
                            viewBox="0 0 100 100"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-gray-300"
                          >
                            <circle
                              cx="50"
                              cy="50"
                              r="48"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="35"
                              stroke="currentColor"
                              strokeWidth="1"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="22"
                              stroke="currentColor"
                              strokeWidth="1"
                            />
                            <circle cx="50" cy="50" r="8" fill="currentColor" />
                            <path
                              d="M50 2 L52 10 M50 2 L48 10"
                              stroke="currentColor"
                              strokeWidth="1"
                            />
                          </svg>
                        )}
                      </div>
                      <h2 className="text-lg font-bold">
                        {record.basic_information.artists[0].name} -{" "}
                        {record.basic_information.title}
                      </h2>
                      <p>{record.basic_information.year}</p>
                      <p>{record.basic_information.styles.join(", ")}</p>
                      <p>
                        <Link
                          className="text-blue-500"
                          href={
                            record.uri ||
                            record.basic_information.uri ||
                            `https://www.discogs.com/release/${record.basic_information.id}`
                          }
                          target="_blank"
                        >
                          View on Discogs
                        </Link>
                      </p>
                    </div>
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
