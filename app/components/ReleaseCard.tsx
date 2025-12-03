import Image from "next/image";
import Link from "next/link";
import { getReleaseDetails } from "../lib/discogs-api";
import ReleaseYouTubePlayer from "./ReleaseYouTubePlayer";
import DiscogsRecord from "../types/DiscogsRecords";

interface ReleaseCardProps {
  record: DiscogsRecord;
  shouldPriority?: boolean;
}

export default async function ReleaseCard({ record, shouldPriority = false }: ReleaseCardProps) {
  const hasImage =
    record.basic_information.cover_image &&
    record.basic_information.cover_image !== "";

  // Fetch full release details to get videos
  const releaseDetails = await getReleaseDetails(record.basic_information.id);

  return (
    <div className="bg-white rounded-lg p-6 flex flex-col gap-3 shadow-sm">
      <div className="relative aspect-square bg-gray-100 flex items-center justify-center overflow-hidden rounded-md">
        {hasImage ? (
          <Image
            src={record.basic_information.cover_image}
            alt={`${record.basic_information.artists[0].name} - ${record.basic_information.title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={shouldPriority}
            loading={shouldPriority ? "eager" : "lazy"}
            quality={85}
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
            className="object-cover"
          />
        ) : (
          <svg
            width="150"
            height="150"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-300"
            aria-label="No album artwork available"
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
      {record.basic_information.labels && record.basic_information.labels.length > 0 && (
        <p className="text-sm font-medium text-blue-600">
          {record.basic_information.labels[0].name}
          {record.basic_information.labels[0].catno && ` · ${record.basic_information.labels[0].catno}`}
        </p>
      )}
      <p className="text-sm text-gray-600">{record.basic_information.year}</p>
      <p className="text-sm text-gray-600">{record.basic_information.styles.join(", ")}</p>
      <p>
        <Link
          className="text-blue-500 hover:text-blue-700 transition-colors"
          href={
            record.uri ||
            record.basic_information.uri ||
            `https://www.discogs.com/release/${record.basic_information.id}`
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Discogs
        </Link>
      </p>

      {/* YouTube Player */}
      {releaseDetails?.videos && releaseDetails.videos.length > 0 && (
        <ReleaseYouTubePlayer
          videos={releaseDetails.videos}
          releaseName={`${record.basic_information.artists[0].name} - ${record.basic_information.title}`}
        />
      )}
    </div>
  );
}

