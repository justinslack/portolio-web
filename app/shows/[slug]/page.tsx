import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getShowBySlug, getAllShows } from '@/app/lib/markdown-renderer';
import { ShowImage } from '@/app/components/ShowImage';
import { markdownComponents } from '@/app/components/MarkdownComponents';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import type { Metadata } from 'next';
import 'highlight.js/styles/github-dark-dimmed.css';

interface ShowPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all shows
export async function generateStaticParams() {
  const shows = await getAllShows();
  return shows.map((show) => ({
    slug: show.slug,
  }));
}

// Generate metadata for each show
export async function generateMetadata({ params }: ShowPageProps): Promise<Metadata> {
  const { slug } = await params;
  const show = await getShowBySlug(slug);

  if (!show) {
    return {
      title: 'Show Not Found',
    };
  }

  return {
    title: show.title,
    description: show.summary,
    openGraph: {
      title: show.title,
      description: show.summary,
      images: show.socialImage ? [{ url: show.socialImage }] : [],
    },
  };
}

export default async function ShowPage({ params }: ShowPageProps) {
  const { slug } = await params;
  const show = await getShowBySlug(slug);

  if (!show) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Featured Image */}
      <div className="relative h-[400px] w-full overflow-hidden bg-gray-100">
        <ShowImage
          src={show.featuredImage}
          alt={show.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-8 py-12">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/shows">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shows
          </Link>
        </Button>

        {/* Header */}
        <header className="mb-8">
          {show.show && (
            <p className="text-lg text-muted-foreground mb-2">{show.show}</p>
          )}
          
          <h1 className="mb-2 text-4xl font-bold lg:text-5xl">{show.title}</h1>
          
          {show.subtitle && (
            <p className="text-xl font-medium text-gray-600 mb-4">{show.subtitle}</p>
          )}

          {show.summary && (
            <p className="mb-6 text-xl text-gray-600">{show.summary}</p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <time dateTime={show.date}>
                {formatDate(show.date)}
              </time>
            </div>
            {show.readingTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{show.readingTime}</span>
              </div>
            )}
            {show.author && (
              <div className="text-sm">
                By <span className="font-medium">{show.author}</span>
              </div>
            )}
          </div>

          {/* Listen Link */}
          {show.showlink && (
            <Button asChild size="lg" className="mb-6">
              <a href={show.showlink} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Listen on Mixcloud
              </a>
            </Button>
          )}
        </header>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={markdownComponents}
          >
            {show.content}
          </ReactMarkdown>
        </article>

        {/* Footer */}
        <footer className="mt-12 border-t pt-8 flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/shows">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to all shows
            </Link>
          </Button>
          
          {show.showlink && (
            <Button variant="outline" asChild>
              <a href={show.showlink} target="_blank" rel="noopener noreferrer">
                Listen <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}
        </footer>
      </main>
    </div>
  );
}

