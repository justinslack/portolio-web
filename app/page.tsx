import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to my vinyl collection",
  openGraph: {
    title: "Home",
    description: "Welcome to my vinyl collection",
  },
};

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="m-auto max-w-7xl p-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4">Welcome to My Vinyl Collection</h1>
            <p className="text-xl text-gray-600">
              Explore my curated collection of records and lists
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="/collection">
                Browse Collection →
              </Link>
            </Button>
            
            <Button size="lg" variant="outline" asChild>
              <Link href="/lists">
                View My Lists
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
