import React, { useState, useRef, useEffect } from 'react';
import { fabric } from 'fabric';
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

interface OFSignatureManagerProps {
  currentSignatureUrl?: string;
  onSave: (signatureData: string) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export const OFSignatureManager: React.FC<OFSignatureManagerProps> = ({
  currentSignatureUrl,
  onSave,
  onDelete
}) => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("draw");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize fabric canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 400,
      height: 150,
      backgroundColor: '#ffffff',
      isDrawingMode: true,
    });

    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = '#000000';
      canvas.freeDrawingBrush.width = 2;
    }

    canvas.on('path:created', () => {
      setHasDrawn(true);
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  const handleClear = () => {
    if (fabricCanvas) {
      fabricCanvas.clear();
      fabricCanvas.backgroundColor = '#ffffff';
      fabricCanvas.renderAll();
      setHasDrawn(false);
    }
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

  const handleSaveSignature = async () => {
    setIsLoading(true);
    try {
      let signatureData: string;
      
      if (activeTab === "draw" && fabricCanvas && hasDrawn) {
        // Get canvas data as PNG
        signatureData = fabricCanvas.toDataURL({
          format: 'png',
          quality: 1,
          multiplier: 2
        });
      } else if (activeTab === "upload" && uploadedImage) {
        signatureData = uploadedImage;
      } else {
        toast({
          title: "Aucune signature",
          description: "Veuillez dessiner ou uploader votre signature",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      await onSave(signatureData);
      toast({
        title: "Signature enregistrée",
        description: "Votre signature officielle a été sauvegardée avec succès"
      });
      
      // Reset
      handleClear();
      setUploadedImage(null);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la signature",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSignature = async () => {
    if (!onDelete) return;
    setIsLoading(true);
    try {
      await onDelete();
      toast({
        title: "Signature supprimée",
        description: "Votre signature officielle a été supprimée"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la signature",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
          Cette signature sera automatiquement apposée sur les documents officiels de votre organisme (conventions, attestations, certificats, CGV).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current signature status */}
        <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            currentSignatureUrl ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
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
                : 'Configurez votre signature pour pouvoir envoyer des documents officiels'}
            </p>
          </div>
          {currentSignatureUrl && (
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              Active
            </Badge>
          )}
        </div>

        {/* Current signature preview */}
        {currentSignatureUrl && (
          <div className="space-y-3">
            <p className="text-sm font-medium">Signature actuelle :</p>
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-white dark:bg-gray-950">
              <img 
                src={currentSignatureUrl} 
                alt="Signature officielle actuelle" 
                className="max-h-20 border rounded"
              />
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDeleteSignature}
                disabled={isLoading}
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

            <TabsContent value="draw" className="space-y-4">
              <div className="border-2 border-gray-300 dark:border-gray-700 rounded-lg bg-white">
                <canvas ref={canvasRef} className="rounded-lg" />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Dessinez votre signature avec votre souris ou votre doigt
              </p>
            </TabsContent>

            <TabsContent value="upload" className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center bg-muted/30">
                {uploadedImage ? (
                  <div className="space-y-4">
                    <img 
                      src={uploadedImage} 
                      alt="Signature uploadée" 
                      className="max-h-32 mx-auto border rounded bg-white"
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

          {/* Action buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={activeTab === "draw" ? handleClear : () => setUploadedImage(null)}
              disabled={!isValid || isLoading}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {activeTab === "draw" ? "Effacer" : "Supprimer"}
            </Button>
            
            <Button
              type="button"
              onClick={handleSaveSignature}
              disabled={!isValid || isLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Enregistrement...' : 'Enregistrer la signature'}
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
