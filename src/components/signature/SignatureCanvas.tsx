import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Check, RotateCcw } from 'lucide-react';

interface SignatureCanvasProps {
    onSave: (signatureData: string) => void;
    onCancel: () => void;
}

export const SignatureCanvas: React.FC<SignatureCanvasProps> = ({ onSave, onCancel }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // Set drawing styles
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }, []);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        setIsDrawing(true);
        setIsEmpty(false);

        const rect = canvas.getBoundingClientRect();
        const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
        const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
        const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setIsEmpty(true);
    };

    const saveSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas || isEmpty) return;

        // Convert canvas to base64 image
        const signatureData = canvas.toDataURL('image/png');
        onSave(signatureData);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Signature électronique</h3>
                    <p className="text-sm text-muted-foreground">
                        Dessinez votre signature dans le cadre ci-dessous
                    </p>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg bg-white">
                    <canvas
                        ref={canvasRef}
                        className="w-full h-64 cursor-crosshair touch-none"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                    />
                </div>

                <div className="flex justify-between items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={clearCanvas}
                        disabled={isEmpty}
                        className="flex items-center gap-2"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Effacer
                    </Button>

                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            onClick={onCancel}
                            className="flex items-center gap-2"
                        >
                            <X className="h-4 w-4" />
                            Annuler
                        </Button>
                        <Button
                            onClick={saveSignature}
                            disabled={isEmpty}
                            className="flex items-center gap-2"
                        >
                            <Check className="h-4 w-4" />
                            Valider la signature
                        </Button>
                    </div>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                    En signant ce document, vous confirmez avoir lu et accepté son contenu.
                </p>
            </CardContent>
        </Card>
    );
};
