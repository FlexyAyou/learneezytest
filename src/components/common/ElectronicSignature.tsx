import React, { useRef, useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PenTool, RotateCcw, Check, Upload, Image } from 'lucide-react';

interface ElectronicSignatureProps {
  onSignatureComplete: (signatureData: string) => void;
  disabled?: boolean;
}

export const ElectronicSignature: React.FC<ElectronicSignatureProps> = ({ 
  onSignatureComplete, 
  disabled = false 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [isSigned, setIsSigned] = useState(false);
  const [uploadedSignature, setUploadedSignature] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("draw");

  useEffect(() => {
    if (!canvasRef.current || disabled) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 400,
      height: 150,
      backgroundColor: '#ffffff',
      isDrawingMode: true,
    });

    // Configuration du pinceau pour Fabric.js v6
    // Vérifier que freeDrawingBrush existe avant de l'utiliser
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = '#000000';
      canvas.freeDrawingBrush.width = 2;
    }

    // Événement pour détecter quand l'utilisateur signe
    canvas.on('path:created', () => {
      setIsSigned(true);
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [disabled]);

  const handleClear = () => {
    if (fabricCanvas) {
      fabricCanvas.clear();
      fabricCanvas.backgroundColor = '#ffffff';
      fabricCanvas.renderAll();
      setIsSigned(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedSignature(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveSignature = () => {
    if (activeTab === "draw" && fabricCanvas && isSigned) {
      // En mode preview, on génère juste des données mockées
      const mockSignatureData = `signature_${Date.now()}_mock_drawn`;
      onSignatureComplete(mockSignatureData);
    } else if (activeTab === "upload" && uploadedSignature) {
      // En mode preview, on génère juste des données mockées
      const mockSignatureData = `signature_${Date.now()}_mock_uploaded`;
      onSignatureComplete(mockSignatureData);
    }
  };

  const isValid = (activeTab === "draw" && isSigned) || (activeTab === "upload" && uploadedSignature);

  if (disabled) {
    return (
      <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
        <div className="text-center text-gray-500">
          <PenTool className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p>Signature électronique désactivée</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
          <div className="border-2 border-gray-300 rounded-lg bg-white">
            <canvas ref={canvasRef} className="rounded-lg" />
          </div>
          <p className="text-xs text-gray-500 text-center">
            Dessinez votre signature avec votre souris ou votre doigt
          </p>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
            {uploadedSignature ? (
              <div className="space-y-4">
                <img 
                  src={uploadedSignature} 
                  alt="Signature uploadée" 
                  className="max-h-32 mx-auto border rounded"
                />
                <Button 
                  variant="outline" 
                  onClick={() => setUploadedSignature(null)}
                  size="sm"
                >
                  Changer d'image
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Image className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Cliquez pour uploader votre signature
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG jusqu'à 2MB
                  </p>
                </div>
                <Button variant="outline" onClick={handleUploadClick}>
                  <Upload className="w-4 h-4 mr-2" />
                  Choisir un fichier
                </Button>
              </div>
            )}
          </div>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          onClick={activeTab === "draw" ? handleClear : () => setUploadedSignature(null)}
          disabled={!isValid}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          {activeTab === "draw" ? "Effacer" : "Supprimer"}
        </Button>
        
        <Button
          type="button"
          onClick={handleSaveSignature}
          disabled={!isValid}
          className="bg-green-600 hover:bg-green-700"
        >
          <Check className="w-4 h-4 mr-2" />
          Valider la signature
        </Button>
      </div>
    </div>
  );
};