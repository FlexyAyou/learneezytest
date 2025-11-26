import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, Link as LinkIcon, Trash2 } from 'lucide-react';
import { uploadDirect } from '@/utils/upload';
import { useToast } from '@/hooks/use-toast';
import MediaPreview from './MediaPreview';

export interface OptionMedia {
  type: 'image' | 'video' | 'pdf';
  key?: string;
  url?: string;
  caption?: string;
}

interface OptionsMediaGridProps {
  options: string[];
  value: Array<OptionMedia | null>;
  onChange: (value: Array<OptionMedia | null>) => void;
}

const OptionsMediaGrid: React.FC<OptionsMediaGridProps> = ({ options, value, onChange }) => {
  const { toast } = useToast();

  const updateIndex = (index: number, media: OptionMedia | null) => {
    const copy = [...value];
    copy[index] = media;
    onChange(copy);
  };

  return (
    <div className="mt-4 space-y-2">
      <Label>Médias des options (optionnel)</Label>
      {options.map((_, index) => (
        <div key={`opt-media-${index}`} className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground w-16">Option {index + 1}</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'video/*,.pdf,image/*';
              input.onchange = async (ev: any) => {
                const file = ev.target?.files?.[0];
                if (!file) return;
                try {
                  let kind: 'image' | 'video' | 'pdf';
                  if (file.type.startsWith('video/')) kind = 'video';
                  else if (file.type === 'application/pdf') kind = 'pdf';
                  else kind = 'image';
                  const res = await uploadDirect(file, kind);
                  updateIndex(index, { type: kind, key: res.key });
                  toast({ title: '✅ Média option ajouté', description: file.name });
                } catch (e: any) {
                  toast({ title: 'Erreur upload', description: e?.message || 'Échec upload', variant: 'destructive' });
                }
              };
              input.click();
            }}
            title="Uploader un média"
          >
            <Upload className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const url = window.prompt('URL du média (image/pdf/vidéo)');
              if (!url) return;
              let type: 'image' | 'video' | 'pdf' = 'image';
              const u = url.toLowerCase();
              if (u.endsWith('.mp4') || u.includes('youtube') || u.includes('vimeo')) type = 'video';
              else if (u.endsWith('.pdf')) type = 'pdf';
              updateIndex(index, { type, url });
            }}
            title="Lier par URL"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          {value[index] && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => updateIndex(index, null)}
              title="Supprimer le média"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
          {value[index] && (
            <div className="ml-2">
              <MediaPreview mediaType={value[index]!.type} mediaKey={value[index]!.key} mediaUrl={value[index]!.url} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OptionsMediaGrid;
