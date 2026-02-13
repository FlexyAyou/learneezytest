
import React, { useState, useEffect, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    X,
    Printer,
    Download,
    Save,
    Send,
    Loader2,
    CheckCircle,
    AlertTriangle,
    FileSignature,
    FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ElectronicSignature } from '@/components/common/ElectronicSignature';
import { usePrepareUpload, useCompleteUpload, useSignDocument } from '@/hooks/useApi';
import axios from 'axios';

interface StudentNeedsAnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    assignmentId: number;
    title: string;
    url?: string;
    initialHtmlContent?: string;
    onSuccess?: () => void;
}

export const StudentNeedsAnalysisModal: React.FC<StudentNeedsAnalysisModalProps> = ({
    isOpen,
    onClose,
    assignmentId,
    title,
    url,
    initialHtmlContent,
    onSuccess
}) => {
    const { toast } = useToast();
    const [htmlContent, setHtmlContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<'edit' | 'sign' | 'success'>('edit');
    const [isSaving, setIsSaving] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Hooks API for "sending back"
    const prepareUpload = usePrepareUpload();
    const completeUpload = useCompleteUpload();
    const signDocument = useSignDocument();

    useEffect(() => {
        if (isOpen) {
            if (initialHtmlContent) {
                setHtmlContent(initialHtmlContent);
            } else if (url) {
                fetchContent();
            }
            setStep('edit');
        }
    }, [isOpen, url, initialHtmlContent]);

    const fetchContent = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(url!, { responseType: 'text' });
            setHtmlContent(response.data);
        } catch (error) {
            console.error("Error fetching document content:", error);
            toast({
                title: "Erreur",
                description: "Impossible de charger le contenu du document.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; line-height: 1.6; }
            table { border-collapse: collapse; width: 100%; }
            td, th { border: 1px solid #ddd; padding: 8px; }
            input, textarea { border: none; background: #f9f9f9; padding: 4px; width: 100%; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `);
            printWindow.document.close();
            printWindow.print();
        }
    };

    const extractFormResults = () => {
        if (!containerRef.current) return htmlContent;

        const clone = containerRef.current.cloneNode(true) as HTMLDivElement;

        // Process input elements to "bake" their values into the HTML
        const inputs = clone.querySelectorAll('input, textarea, select');
        inputs.forEach((input: any) => {
            const value = input.value || '';
            const span = document.createElement('span');
            span.textContent = value;
            span.className = "filled-value";
            span.style.fontWeight = "bold";
            span.style.textDecoration = "underline";
            input.parentNode?.replaceChild(span, input);
        });

        return clone.innerHTML;
    };

    const handleSaveAndSign = async () => {
        setStep('sign');
    };

    const handleSignatureComplete = async (signatureData: string) => {
        setIsSaving(true);
        try {
            // 1. Extract filled content
            const completedHtml = extractFormResults();

            // 2. Wrap in basic HTML structure if needed
            const finalHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: sans-serif; line-height: 1.5; color: #333; }
            .content { max-width: 800px; margin: 0 auto; padding: 40px; }
            .signature-block { margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px; }
            .signature-img { max-width: 200px; height: auto; }
          </style>
        </head>
        <body>
          <div class="content">
            ${completedHtml}
            <div class="signature-block">
              <p><strong>Signé électroniquement le :</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
              <img src="${signatureData}" alt="Signature" class="signature-img" />
            </div>
          </div>
        </body>
        </html>
      `;

            // 3. Upload the completed document
            const fileName = `Analyse_Besoin_Complete_${Date.now()}.html`;
            const blob = new Blob([finalHtml], { type: 'text/html' });
            const file = new File([blob], fileName, { type: 'text/html' });

            const prepareData = await prepareUpload.mutateAsync({
                filename: fileName,
                content_type: 'text/html',
                size: blob.size,
                kind: 'resource'
            });

            // Upload to S3 (presigned URL)
            await axios.put(prepareData.upload_url, blob, {
                headers: { 'Content-Type': 'text/html' }
            });

            // Complete upload to get media_asset_id
            const asset = await completeUpload.mutateAsync({
                upload_id: prepareData.upload_id,
                key: prepareData.key
            });

            // 4. Update the assignment status by signing it
            await signDocument.mutateAsync({
                assignment_id: assignmentId,
                signature_data: signatureData
            });

            setStep('success');
            toast({
                title: "Document envoyé !",
                description: "Votre analyse de besoin a été complétée, signée et renvoyée à l'OF.",
                variant: "default"
            });

            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error saving completed document:", error);
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de l'envoi du document.",
                variant: "destructive"
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-[95vh] p-0 overflow-hidden flex flex-col">
                <DialogHeader className="p-4 border-b bg-muted/50 flex flex-row items-center justify-between">
                    <div>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-500" />
                            {title}
                        </DialogTitle>
                        <DialogDescription>
                            {step === 'edit' ? "Veuillez répondre aux questions ci-dessous et signer le document." :
                                step === 'sign' ? "Apposez votre signature pour valider vos réponses." :
                                    "Document envoyé avec succès."}
                        </DialogDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        {step === 'edit' && (
                            <>
                                <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
                                    <Printer className="h-4 w-4" />
                                    Imprimer
                                </Button>
                                <Button variant="default" size="sm" onClick={handleSaveAndSign} className="gap-2 bg-blue-600 hover:bg-blue-700">
                                    <FileSignature className="h-4 w-4" />
                                    Signer et Envoyer
                                </Button>
                            </>
                        )}
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-hidden relative">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                            <p className="text-muted-foreground animate-pulse">Chargement du questionnaire...</p>
                        </div>
                    ) : step === 'success' ? (
                        <div className="flex flex-col items-center justify-center h-full p-12 text-center space-y-6">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-12 w-12 text-green-600" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold">C'est envoyé !</h3>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                    Votre analyse de besoin a été transmise à votre organisme de formation.
                                    Vous recevrez une notification dès que celle-ci sera validée.
                                </p>
                            </div>
                            <Button onClick={onClose} size="lg" className="bg-green-600 hover:bg-green-700">
                                Fermer
                            </Button>
                        </div>
                    ) : step === 'sign' ? (
                        <div className="p-12 flex flex-col items-center max-w-2xl mx-auto space-y-8">
                            <div className="text-center">
                                <h3 className="text-xl font-bold">Signature électronique</h3>
                                <p className="text-muted-foreground text-sm mt-2">
                                    En signant ce document, vous certifiez l'exactitude des informations fournies.
                                </p>
                            </div>

                            <div className="w-full bg-white p-4 rounded-xl border-2 border-dashed border-gray-200">
                                <ElectronicSignature
                                    onSignatureComplete={handleSignatureComplete}
                                    disabled={isSaving}
                                />
                            </div>

                            {isSaving && (
                                <div className="flex items-center gap-2 text-blue-600 font-medium">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Envoi du document en cours...
                                </div>
                            )}

                            <Button variant="outline" onClick={() => setStep('edit')} disabled={isSaving}>
                                Retour au questionnaire
                            </Button>
                        </div>
                    ) : (
                        <ScrollArea className="h-full">
                            <div className="p-12 bg-white flex justify-center">
                                <style>{`
                                    .interactive-document-container input, 
                                    .interactive-document-container textarea, 
                                    .interactive-document-container select {
                                        background-color: #f3f4f6;
                                        border: 1px solid #d1d5db;
                                        border-radius: 4px;
                                        padding: 4px 8px;
                                        width: 100%;
                                        margin-bottom: 8px;
                                        transition: border-color 0.2s;
                                    }
                                    .interactive-document-container input:focus, 
                                    .interactive-document-container textarea:focus {
                                        border-color: #3b82f6;
                                        outline: none;
                                        background-color: #fff;
                                    }
                                    .interactive-document-container .filled-value {
                                        color: #1d4ed8;
                                        font-weight: 600;
                                    }
                                `}</style>
                                <div
                                    ref={containerRef}
                                    className="interactive-document-container prose prose-sm max-w-none w-full max-w-[800px]"
                                    style={{
                                        backgroundColor: '#fff',
                                        padding: '2rem',
                                        boxShadow: '0 0 50px rgba(0,0,0,0.05)',
                                        borderRadius: '8px'
                                    }}
                                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                                />
                            </div>
                        </ScrollArea>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
