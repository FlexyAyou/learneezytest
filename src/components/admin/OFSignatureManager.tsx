import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  PenTool, 
  Upload, 
  RotateCcw, 
  Save, 
  Trash2, 
  Check, 
  AlertCircle,
  FileSignature,
  Image,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const OF_SIGNATURE_STORAGE_KEY = 'of_official_signature';

interface OFSignatureManagerProps {
  currentSignatureUrl?: string;
  onSave: (signatureData: string) => void;
  onDelete?: () => void;
}

export const OFSignatureManager: React.FC<OFSignatureManagerProps> = ({
  currentSignatureUrl,
  onSave,
  onDelete
}) => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("draw");
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 500;
    canvas.height = 180;

    // Set white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set drawing style
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getCanvasCoordinates = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const point = getCanvasCoordinates(e);
    setIsDrawing(true);
    setLastPoint(point);
  }, [getCanvasCoordinates]);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing || !lastPoint) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const currentPoint = getCanvasCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();

    setLastPoint(currentPoint);
    setHasDrawn(true);
  }, [isDrawing, lastPoint, getCanvasCoordinates]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    setLastPoint(null);
  }, []);

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: "L'image ne doit pas dépasser 2 Mo",
          variant: "destructive"
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSignature = () => {
    let signatureData: string | null = null;
    
    if (activeTab === "draw" && hasDrawn && canvasRef.current) {
      signatureData = canvasRef.current.toDataURL('image/png');
    } else if (activeTab === "upload" && uploadedImage) {
      signatureData = uploadedImage;
    }

    if (!signatureData) {
      toast({
        title: "Aucune signature",
        description: "Veuillez dessiner ou uploader votre signature",
        variant: "destructive"
      });
      return;
    }

    // Store in localStorage
    localStorage.setItem(OF_SIGNATURE_STORAGE_KEY, signatureData);
    
    onSave(signatureData);
    toast({
      title: "Signature enregistrée",
      description: "Votre signature officielle a été sauvegardée"
    });
    
    // Reset drawing area
    handleClear();
    setUploadedImage(null);
  };

  const handleDeleteSignature = () => {
    localStorage.removeItem(OF_SIGNATURE_STORAGE_KEY);
    if (onDelete) {
      onDelete();
    }
    toast({
      title: "Signature supprimée",
      description: "Votre signature officielle a été supprimée"
    });
  };

  const isValid = (activeTab === "draw" && hasDrawn) || (activeTab === "upload" && uploadedImage);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSignature className="h-5 w-5" />
          Signature officielle de l'organisme
        </CardTitle>
        <CardDescription>
          Cette signature sera automatiquement apposée sur les documents officiels (conventions, attestations, certificats, CGV).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current signature status */}
        <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            currentSignatureUrl 
              ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
              : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
          }`}>
            {currentSignatureUrl ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          </div>
          <div className="flex-1">
            <p className="font-medium">
              {currentSignatureUrl ? 'Signature configurée' : 'Aucune signature configurée'}
            </p>
            <p className="text-sm text-muted-foreground">
              {currentSignatureUrl 
                ? 'Votre signature sera utilisée sur les documents officiels' 
                : 'Configurez votre signature pour envoyer des documents officiels'}
            </p>
          </div>
          {currentSignatureUrl && (
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              Active
            </Badge>
          )}
        </div>

        {/* Current signature preview */}
        {currentSignatureUrl && (
          <div className="space-y-3">
            <p className="text-sm font-medium">Signature actuelle :</p>
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-background">
              <img 
                src={currentSignatureUrl} 
                alt="Signature officielle actuelle" 
                className="max-h-24 border rounded bg-white p-2"
              />
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDeleteSignature}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </div>
        )}

        {/* Signature input tabs */}
        <div className="space-y-4">
          <p className="text-sm font-medium">
            {currentSignatureUrl ? 'Modifier votre signature :' : 'Configurer votre signature :'}
          </p>

          <Tabs defaultValue="draw" onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="draw" className="flex items-center gap-2">
                <PenTool className="w-4 h-4" />
                Dessiner
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Uploader
              </TabsTrigger>
            </TabsList>

            <TabsContent value="draw" className="space-y-4 mt-4">
              <div 
                className="border-2 border-dashed border-muted-foreground/30 rounded-lg bg-white overflow-hidden"
                style={{ touchAction: 'none' }}
              >
                <canvas 
                  ref={canvasRef}
                  className="w-full cursor-crosshair"
                  style={{ 
                    height: '180px',
                    display: 'block'
                  }}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Dessinez votre signature avec votre souris ou votre doigt
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  disabled={!hasDrawn}
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Effacer
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-4 mt-4">
              <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center bg-muted/30">
                {uploadedImage ? (
                  <div className="space-y-4">
                    <img 
                      src={uploadedImage} 
                      alt="Signature uploadée" 
                      className="max-h-32 mx-auto border rounded bg-white p-2"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => setUploadedImage(null)}
                      size="sm"
                    >
                      Changer d'image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Image className="w-12 h-12 text-muted-foreground mx-auto" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Uploadez une image de votre signature
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG ou JPG avec fond transparent recommandé, max 2 Mo
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choisir un fichier
                    </Button>
                  </div>
                )}
              </div>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileUpload}
                className="hidden"
              />
            </TabsContent>
          </Tabs>

          {/* Save button */}
          <div className="flex justify-end pt-4 border-t">
            <Button
              type="button"
              onClick={handleSaveSignature}
              disabled={!isValid}
            >
              <Save className="w-4 h-4 mr-2" />
              Enregistrer la signature
            </Button>
          </div>
        </div>

        {/* Info box */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Documents concernés par cette signature :</strong>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Convention de formation</li>
              <li>• Conditions Générales de Vente (CGV)</li>
              <li>• Attestation de formation</li>
              <li>• Certificat de réalisation</li>
              <li>• Convocation (facultatif)</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

// Helper function to get stored signature
export const getStoredOFSignature = (): string | null => {
  return localStorage.getItem(OF_SIGNATURE_STORAGE_KEY);
};
