import React from 'react';
import VideoPlayer from '@/components/common/VideoPlayer';
import PDFViewer from '@/components/common/PDFViewer';
import { usePresignedUrl } from '@/hooks/usePresignedUrl';
import { FileText, Video, Image } from 'lucide-react';

interface MediaPreviewProps {
  mediaType: 'video' | 'pdf' | 'image';
  mediaKey?: string;
  mediaUrl?: string;
  fileName?: string;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ mediaType, mediaKey, mediaUrl, fileName }) => {
  const { url: presignedUrl } = usePresignedUrl(mediaKey || '');

  if (mediaType === 'video') {
    return (
      <div className="rounded-lg overflow-hidden bg-black">
        <VideoPlayer videoKey={mediaKey} videoUrl={mediaUrl} title="Média de question (vidéo)" />
      </div>
    );
  }

  if (mediaType === 'pdf') {
    if (mediaKey) {
      return (
        <div className="border rounded-lg overflow-hidden" style={{ height: '400px' }}>
          <PDFViewer pdfKey={mediaKey} title={fileName || "Média de question (PDF)"} height="400px" />
        </div>
      );
    }
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
        <FileText className="h-8 w-8 text-red-600" />
        <div>
          <p className="font-medium text-red-900">{fileName || 'Document PDF'}</p>
          <p className="text-sm text-red-700">Fichier PDF joint</p>
        </div>
      </div>
    );
  }

  if (mediaType === 'image') {
    const imageUrl = mediaKey ? presignedUrl : mediaUrl;
    return (
      <div className="rounded-lg overflow-hidden border">
        <img 
          src={imageUrl} 
          alt="Question media"
          className="w-full h-auto max-h-96 object-contain"
        />
      </div>
    );
  }

  return null;
};

export default MediaPreview;
