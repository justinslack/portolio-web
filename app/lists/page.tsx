import Link from "next/link";
import { getLists } from "../lib/discogs-api";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Discogs Lists",
  description: "Browse my curated Discogs lists and collections",
  openGraph: {
    title: "My Discogs Lists",
    description: "Browse my curated Discogs lists and collections",
  },
};

export default async function ListsPage() {
  const lists = await getLists();

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="m-auto max-w-7xl p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" asChild>
              <Link href="/">← Back to Collection</Link>
            </Button>
          </div>
          <h1 className="text-4xl font-bold mb-2">My Discogs Lists</h1>
          <p className="text-gray-600">
            {lists.length} {lists.length === 1 ? "list" : "lists"}
          </p>
        </div>

        {/* Lists Grid */}
        {lists.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lists.map((list) => (
              <Link
                key={list.id}
                href={`/lists/${list.id}`}
                className="block bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col gap-3">
                  {/* List Image */}
                  {list.image_url && (
                    <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
                      <img
                        src={list.image_url}
                        alt={list.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* List Info */}
                  <div>
                    <h2 className="text-xl font-bold mb-1">{list.name}</h2>
                    {list.description && (
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {list.description}
                      </p>
                    )}
                  </div>

                  {/* List Metadata */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-3 border-t">
                    <span>{list.public ? "Public" : "Private"}</span>
                    <span>
                      {new Date(list.date_added).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No lists found</p>
            <p className="text-gray-500 text-sm">
              Create lists on{" "}
              <a
                href="https://www.discogs.com/lists"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                Discogs
              </a>{" "}
              to see them here
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

