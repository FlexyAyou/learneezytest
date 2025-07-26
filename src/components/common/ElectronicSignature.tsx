import React, { useRef, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Button } from '@/components/ui/button';
import { PenTool, RotateCcw, Check } from 'lucide-react';

interface ElectronicSignatureProps {
  onSignatureComplete: (signatureData: string) => void;
  disabled?: boolean;
}

export const ElectronicSignature: React.FC<ElectronicSignatureProps> = ({ 
  onSignatureComplete, 
  disabled = false 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [isSigned, setIsSigned] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || disabled) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 400,
      height: 150,
      backgroundColor: '#ffffff',
      isDrawingMode: true,
    });

    // Configuration du pinceau
    canvas.freeDrawingBrush.color = '#000000';
    canvas.freeDrawingBrush.width = 2;

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

  const handleSaveSignature = () => {
    if (fabricCanvas && isSigned) {
      // En mode preview, on génère juste des données mockées
      const mockSignatureData = `signature_${Date.now()}_mock`;
      onSignatureComplete(mockSignatureData);
    }
  };

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
      <div className="border-2 border-gray-300 rounded-lg bg-white">
        <canvas ref={canvasRef} className="rounded-lg" />
      </div>
      
      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          onClick={handleClear}
          disabled={!isSigned}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Effacer
        </Button>
        
        <Button
          type="button"
          onClick={handleSaveSignature}
          disabled={!isSigned}
          className="bg-green-600 hover:bg-green-700"
        >
          <Check className="w-4 h-4 mr-2" />
          Valider la signature
        </Button>
      </div>
      
      <p className="text-xs text-gray-500 text-center">
        Signez dans la zone ci-dessus avec votre souris ou votre doigt
      </p>
    </div>
  );
};