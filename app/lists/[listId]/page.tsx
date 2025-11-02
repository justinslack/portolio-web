import Link from "next/link";
import Image from "next/image";
import { getListDetails } from "../../lib/discogs-api";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ listId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { listId } = await params;
  const list = await getListDetails(listId);
  
  if (!list) {
    return {
      title: "List Not Found",
    };
  }
  
  return {
    title: list.name,
    description: list.description || `View items in ${list.name}`,
    openGraph: {
      title: list.name,
      description: list.description || `View items in ${list.name}`,
      images: list.image_url ? [list.image_url] : [],
    },
  };
}

export default async function ListDetailsPage({ params }: PageProps) {
  const { listId } = await params;
  const list = await getListDetails(listId);

  if (!list) {
    notFound();
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="m-auto max-w-7xl p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" asChild>
              <Link href="/lists">← Back to Lists</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">← Home</Link>
            </Button>
          </div>
          
          <h1 className="text-4xl font-bold mb-2">{list.name}</h1>
          
          {list.description && (
            <p className="text-gray-600 text-lg mb-4">{list.description}</p>
          )}
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{list.items.length} items</span>
            <span>•</span>
            <span>{list.public ? "Public" : "Private"}</span>
            <span>•</span>
            <span>Created {new Date(list.date_added).toLocaleDateString()}</span>
          </div>
        </div>

        {/* List Items */}
        {list.items.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {list.items.map((item, index) => {
              // Handle different item types
              const title = item.display_title || "Unknown";
              const hasImage = item.image_url && item.image_url !== "";
              const imageUrl = item.image_url || "";
              
              // For releases, we might have basic_information
              let subtitle = "";
              let year = "";
              
              if (item.basic_information) {
                subtitle = item.basic_information.artists?.[0]?.name || "";
                year = item.basic_information.year?.toString() || "";
              }
              
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-lg p-6 flex flex-col gap-3 shadow-sm"
                >
                  {/* Image */}
                  <div className="relative aspect-square bg-gray-100 flex items-center justify-center overflow-hidden rounded-md">
                    {hasImage ? (
                      <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={index < 6}
                        loading={index < 6 ? "eager" : "lazy"}
                        quality={85}
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
                        className="object-cover"
                      />
                    ) : (
                      <svg
                        width="100"
                        height="100"
                        viewBox="0 0 100 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-gray-300"
                        aria-label="No image available"
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
                      </svg>
                    )}
                  </div>

                  {/* Item Info */}
                  <div>
                    <h2 className="text-lg font-bold">{title}</h2>
                    {subtitle && (
                      <p className="text-base text-gray-700">{subtitle}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs uppercase font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {item.type}
                      </span>
                      {year && (
                        <span className="text-sm text-gray-500">{year}</span>
                      )}
                    </div>
                    {item.basic_information?.formats && item.basic_information.formats.length > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        {item.basic_information.formats
                          .map((f) => f.name)
                          .join(", ")}
                      </p>
                    )}
                  </div>

                  {/* Comment */}
                  {item.comment && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      <p className="italic">&ldquo;{item.comment}&rdquo;</p>
                    </div>
                  )}

                  {/* Link */}
                  <Link
                    className="text-blue-500 hover:text-blue-700 transition-colors text-sm mt-auto"
                    href={item.uri || `https://www.discogs.com/${item.type}/${item.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Discogs →
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">This list is empty</p>
          </div>
        )}
      </main>
    </div>
  );
}

