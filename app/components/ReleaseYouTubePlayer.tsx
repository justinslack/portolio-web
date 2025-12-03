'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Video {
  uri: string;
  title: string;
  description: string;
  duration: number;
  embed: boolean;
}

interface ReleaseYouTubePlayerProps {
  videos: Video[];
  releaseName: string;
}

export default function ReleaseYouTubePlayer({ videos, releaseName }: ReleaseYouTubePlayerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Filter to only embeddable videos
  const embeddableVideos = videos.filter(v => v.embed);

  if (embeddableVideos.length === 0) {
    return null;
  }

  const currentVideo = embeddableVideos[currentVideoIndex];

  // Extract YouTube video ID from URI
  const getYouTubeId = (uri: string): string | null => {
    const match = uri.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\s]+)/);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeId(currentVideo.uri);

  if (!videoId) {
    return null;
  }

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg 
            className="w-5 h-5 text-red-600" 
            fill="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          <span className="text-sm font-semibold text-gray-700">
            {embeddableVideos.length} video{embeddableVideos.length > 1 ? 's' : ''} available
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Hide Videos' : 'Show Videos'}
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-3">
          {/* Video Player */}
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-md"
              src={`https://www.youtube.com/embed/${videoId}`}
              title={currentVideo.title || `${releaseName} - Video ${currentVideoIndex + 1}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Video Info */}
          <div className="bg-gray-50 p-3 rounded-md">
            <h4 className="font-medium text-sm text-gray-900 mb-1">
              {currentVideo.title}
            </h4>
            {currentVideo.description && (
              <p className="text-xs text-gray-600 mb-2">
                {currentVideo.description}
              </p>
            )}
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>Duration: {formatDuration(currentVideo.duration)}</span>
              <span>•</span>
              <a 
                href={currentVideo.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Watch on YouTube
              </a>
            </div>
          </div>

          {/* Video Selection (if multiple videos) */}
          {embeddableVideos.length > 1 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-700">
                Select Track:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {embeddableVideos.map((video, index) => {
                  const isActive = index === currentVideoIndex;
                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentVideoIndex(index)}
                      className={`text-left p-2 rounded-md border transition-colors ${
                        isActive
                          ? 'bg-blue-50 border-blue-500 text-blue-900'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <p className="text-xs font-medium truncate">
                        {video.title || `Track ${index + 1}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDuration(video.duration)}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

