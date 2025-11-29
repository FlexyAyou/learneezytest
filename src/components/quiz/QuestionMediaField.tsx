import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Upload, Link as LinkIcon, Trash2, Video, FileText, Image as ImageIcon } from 'lucide-react';
import { uploadDirect } from '@/utils/upload';
import { useToast } from '@/hooks/use-toast';
import MediaPreview from './MediaPreview';
import { Progress } from '@/components/ui/progress';

export interface MediaValue {
  type: 'image' | 'video' | 'pdf';
  key?: string;
  url?: string;
  caption?: string;
}

interface QuestionMediaFieldProps {
  media?: MediaValue | null;
  onChange: (media: MediaValue | null | undefined) => void;
  label?: string;
  toggleable?: boolean; // si false, toujours visible
}

const QuestionMediaField: React.FC<QuestionMediaFieldProps> = ({ media, onChange, label = 'Média de la question (optionnel)', toggleable = true }) => {
  const { toast } = useToast();
  const [enabled, setEnabled] = useState<boolean>(!!media || !toggleable);
  const [useUrl, setUseUrl] = useState<boolean>(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const mediaType = media?.type;

  const handleRemove = () => {
    // Signale une suppression explicite (utile côté update: media: null)
    onChange(null);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      let kind: 'image' | 'video' | 'pdf';
      if (file.type.startsWith('video/')) kind = 'video';
      else if (file.type === 'application/pdf') kind = 'pdf';
      else kind = 'image';
      const res = await uploadDirect(file, kind, {
        onProgress: (uploaded, total) => setProgress((uploaded / total) * 100)
      });
      onChange({ type: kind, key: res.key });
      toast({ title: '✅ Média uploadé', description: file.name });
    } catch (e: any) {
      toast({ title: 'Erreur upload', description: e?.message || 'Échec upload', variant: 'destructive' });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const setUrl = (url: string) => {
    if (!mediaType) return; // Choix du type requis
    onChange({ type: mediaType, url, caption: media?.caption });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base">{label}</Label>
        {toggleable && (
          <Switch
            checked={enabled}
            onCheckedChange={(checked) => {
              setEnabled(checked);
              if (!checked) handleRemove();
            }}
          />
        )}
      </div>
      {enabled && (
        <div className="space-y-4">
          {!media && (
            <div className="flex gap-2">
              <Button
                variant={!useUrl ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUseUrl(false)}
                className={!useUrl ? 'bg-pink-500 hover:bg-pink-600 text-white' : ''}
              >
                <Upload className="h-4 w-4 mr-2" /> Upload fichier
              </Button>
              <Button
                variant={useUrl ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUseUrl(true)}
                className={useUrl ? 'bg-purple-500 hover:bg-purple-600 text-white' : ''}
              >
                <LinkIcon className="h-4 w-4 mr-2" /> Lien URL
              </Button>
            </div>
          )}
          {!media && !useUrl && (
            <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-accent/50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-4 pb-4">
                <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">Vidéo, PDF ou Image</p>
                <div className="mt-2 px-3 py-1 border border-input rounded-md text-xs font-medium hover:bg-accent hover:text-accent-foreground inline-block">
                  Choisir un fichier
                </div>
              </div>
              <input
                type="file"
                className="hidden"
                accept="video/*,.pdf,image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleUpload(f);
                }}
                disabled={uploading}
              />
            </label>
          )}
          {!media && useUrl && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={mediaType === 'video' ? 'default' : 'outline'}
                  onClick={() => onChange({ type: 'video' })}
                >
                  <Video className="h-4 w-4 mr-1" /> Vidéo
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={mediaType === 'pdf' ? 'default' : 'outline'}
                  onClick={() => onChange({ type: 'pdf' })}
                >
                  <FileText className="h-4 w-4 mr-1" /> PDF
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={mediaType === 'image' ? 'default' : 'outline'}
                  onClick={() => onChange({ type: 'image' })}
                >
                  <ImageIcon className="h-4 w-4 mr-1" /> Image
                </Button>
              </div>
              {mediaType && (
                <Input
                  placeholder="https://exemple.com/media..."
                  value={media?.url || ''}
                  onChange={(e) => setUrl(e.target.value)}
                />
              )}
            </div>
          )}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs"><span>Upload...</span><span>{Math.round(progress)}%</span></div>
              <Progress value={progress} />
            </div>
          )}
          {media && media.type && (
            <div className="space-y-4">
              <MediaPreview mediaType={media.type} mediaKey={media.key} mediaUrl={media.url} />
              <div className="space-y-2">
                <Label>Légende (optionnel)</Label>
                <Input
                  placeholder="Légende du média..."
                  value={media.caption || ''}
                  onChange={(e) => {
                    const newCaption = e.target.value;
                    if (media.key) onChange({ type: media.type, key: media.key, caption: newCaption });
                    else if (media.url) onChange({ type: media.type, url: media.url, caption: newCaption });
                    else onChange({ type: media.type, caption: newCaption });
                  }}
                />
              </div>
              <Button variant="outline" size="sm" onClick={handleRemove} className="w-full">
                <Trash2 className="h-4 w-4 mr-2" /> Supprimer le média
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionMediaField;
