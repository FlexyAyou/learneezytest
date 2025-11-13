import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { usePlayback, useAttachHls } from '@/hooks/usePlayback';
import MediaStatusBadge from '@/components/common/MediaStatusBadge';

interface VideoPlayerProps {
  videoKey?: string;
  videoUrl?: string;
  title: string;
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoKey, 
  videoUrl, 
  title,
  onTimeUpdate,
  onEnded 
}) => {
  // Function to convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    }
    return null;
  };

  // Check if videoUrl is YouTube - if so, use it directly (iframe embed)
  const youtubeUrl = videoUrl ? getYouTubeEmbedUrl(videoUrl) : null;

  // Si YouTube, pas besoin de clé storage ni de refresh TTL
  if (youtubeUrl) {
    return (
      <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border-4 border-gray-800">
        <iframe
          src={youtubeUrl}
          title={title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Si on a une clé storage: utiliser le hook playback (TTL + HLS/MP4)
  if (videoKey) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { url, isHls, isMp4, loading, error, refresh } = usePlayback(videoKey, {
      autoRefresh: true,
      refreshThresholdSec: 120,
    });
    useAttachHls(isHls ? url : undefined, videoRef);

    if (loading) {
      return (
        <div className="w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner />
            <p className="text-sm text-gray-600 mt-2">Chargement de la vidéo...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="w-full aspect-video bg-gradient-to-br from-red-50 to-red-100 rounded-lg flex items-center justify-center border-2 border-red-200">
          <div className="text-center">
            <Video className="h-12 w-12 text-red-400 mx-auto mb-2" />
            <p className="text-red-600 font-medium">{error}</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => refresh()}>Réessayer</Button>
          </div>
        </div>
      );
    }

    if (!url) {
      return (
        <div className="w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-300">
          <div className="text-center">
            <Video className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Aucune vidéo disponible</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MediaStatusBadge assetKey={videoKey} />
          {isHls && <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">HLS</Badge>}
          {isMp4 && <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">MP4</Badge>}
        </div>
        <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border-4 border-gray-800">
          <video
            ref={videoRef}
            src={isMp4 ? url : undefined}
            controls
            className="w-full h-full"
            title={title}
            onTimeUpdate={(e) => onTimeUpdate?.(e.currentTarget.currentTime)}
            onEnded={onEnded}
          >
            Votre navigateur ne supporte pas la lecture vidéo.
          </video>
        </div>
      </div>
    );
  }

  // Sinon, si on a une URL directe non YouTube (peut être mp4), l'utiliser telle quelle
  if (videoUrl) {
    return (
      <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border-4 border-gray-800">
        <video
          src={videoUrl}
          controls
          className="w-full h-full"
          title={title}
          onTimeUpdate={(e) => onTimeUpdate?.(e.currentTarget.currentTime)}
          onEnded={onEnded}
        >
          Votre navigateur ne supporte pas la lecture vidéo.
        </video>
      </div>
    );
  }

  // Aucune source vidéo disponible
  return (
    <div className="w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-300">
      <div className="text-center">
        <Video className="h-12 w-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">Aucune vidéo disponible</p>
      </div>
    </div>
  );
};

export default VideoPlayer;
