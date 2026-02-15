
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
import { usePrepareUpload, useCompleteUpload, useSignDocument, useOrganization } from '@/hooks/useApi';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';
import { fastAPIClient } from '@/services/fastapi-client';
import axios from 'axios';
import { getTemplateForType, personalizeDocumentContent } from '@/utils/personalizeDocumentContent';

interface StudentNeedsAnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    assignmentId: string | number;
    title: string;
    url?: string;
    docType?: string;
    learnerData?: {
        firstName: string;
        lastName: string;
    };
    formationData?: {
        name: string;
    };
    initialHtmlContent?: string;
    onSuccess?: () => void;
}

export const StudentNeedsAnalysisModal: React.FC<StudentNeedsAnalysisModalProps> = ({
    isOpen,
    onClose,
    assignmentId,
    title,
    url,
    docType = 'analyse_besoin',
    learnerData,
    formationData,
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

    // Get current user and OF details for dynamic population
    const { user: currentUser } = useFastAPIAuth();
    const { data: ofData } = useOrganization(currentUser?.of_id || '');

    useEffect(() => {
        if (isOpen) {
            if (initialHtmlContent) {
                setHtmlContent(initialHtmlContent);
            } else if (url) {
                fetchContent();
            } else {
                // If no URL and no initial content, generate from template immediately
                // This handles cases where document is not yet generated/assigned as a file
                generateFromTemplate();
            }
            setStep('edit');
        }
    }, [isOpen, url, initialHtmlContent, ofData, currentUser]); // Add dependencies to regenerate if data loads

    const generateFromTemplate = () => {
        const template = getTemplateForType(docType);
        if (template) {
            // Map Organization Data
            const mappedOFData = ofData ? {
                na: ofData.name,
                siret: ofData.siret,
                nda: ofData.numero_declaration,
                address: ofData.address,
                postalCode: ofData.postal_code,
                city: ofData.city,
                phone: ofData.phone,
                email: ofData.contact_email || ofData.email,
                managerName: ofData.legal_representative
            } : undefined;

            // Map Learner Data (merge props with current user data if available)
            const mappedLearnerData = {
                firstName: learnerData?.firstName || currentUser?.first_name || '',
                lastName: learnerData?.lastName || currentUser?.last_name || '',
                email: currentUser?.email || '',
                phone: currentUser?.phone || '',
                address: currentUser?.address || '',
                // Add other fields if available in user object
            };

            const generatedHtml = personalizeDocumentContent(
                template,
                { id: '0', name: formationData?.name || 'Ma Formation' },
                mappedOFData,
                mappedLearnerData
            );

            // Pre-process interactive fields
            const processedHtml = processInteractiveFields(generatedHtml);
            setHtmlContent(processedHtml);
        }
    };

    const processInteractiveFields = (html: string) => {
        return html.replace(
            /<div style="border: 1px solid #ccc; min-height: 80px; padding: 10px; margin-bottom: 20px;"><\/div>/g,
            '<textarea class="interactive-field" placeholder="Saisissez votre réponse ici..." style="width: 100%; border: 1px solid #ccc; min-height: 80px; padding: 10px; margin-bottom: 20px; font-family: inherit; resize: vertical;"></textarea>'
        ).replace(
            /<li>☐ (.*?)<\/li>/g,
            '<li><label style="display: flex; align-items: center; gap: 8px; cursor: pointer;"><input type="checkbox" name="competence" class="interactive-checkbox" /> $1</label></li>'
        );
    };

    const fetchContent = async () => {
        setIsLoading(true);
        try {
            let rawHtml = '';

            if (url) {
                try {
                    const response = await axios.get(url, { responseType: 'text' });
                    rawHtml = response.data;
                    // If successfully fetched, process it
                    setHtmlContent(processInteractiveFields(rawHtml));
                } catch (fetchErr) {
                    console.info("Document non encore généré (404), utilisation du template local.");
                    // Fallback to template generation
                    generateFromTemplate();
                }
            } else {
                generateFromTemplate();
            }
        } catch (error) {
            console.error("Error fetching document content:", error);
            toast({
                title: "Erreur de chargement",
                description: "Le document est manquant sur le serveur. Utilisation du template par défaut.",
                variant: "destructive"
            });
            generateFromTemplate();
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveDraft = () => {
        if (!containerRef.current) return;

        const values: Record<string, string | boolean> = {};
        const inputs = containerRef.current.querySelectorAll('input, textarea');
        inputs.forEach((input: any, index: number) => {
            const key = `field_${index}`;
            values[key] = input.type === 'checkbox' ? input.checked : input.value;
        });

        localStorage.setItem(`draft_analysis_${assignmentId}`, JSON.stringify(values));
        toast({
            title: "Brouillon enregistré",
            description: "Vos réponses ont été sauvegardées localement.",
        });
    };

    useEffect(() => {
        // Apply draft values when component is ready
        if (!isLoading && step === 'edit' && containerRef.current) {
            const draftKey = `draft_analysis_${assignmentId}`;
            const savedDraft = localStorage.getItem(draftKey);
            if (savedDraft) {
                try {
                    const values = JSON.parse(savedDraft);
                    const inputs = containerRef.current.querySelectorAll('input, textarea');
                    inputs.forEach((input: any, index: number) => {
                        const key = `field_${index}`;
                        if (values[key] !== undefined) {
                            if (input.type === 'checkbox') input.checked = values[key];
                            else input.value = values[key];
                        }
                    });
                } catch (e) { console.error("Error loading draft", e); }
            }
        }
    }, [isLoading, step, assignmentId]);

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
        if (assignmentId === undefined || assignmentId === null || assignmentId === '') {
            toast({
                title: "Erreur interne",
                description: "Identifiant du document manquant. Impossible d'envoyer.",
                variant: "destructive"
            });
            return;
        }

        setIsSaving(true);
        try {
            console.log("Starting Needs Analysis submission for assignment:", assignmentId);

            // 1. Extract filled content
            const completedHtml = extractFormResults();

            // 2. Wrap in basic HTML structure
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
            .filled-value { text-decoration: underline; font-weight: bold; color: #1d4ed8; }
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
            const fileName = `Analyse_Besoin_Apprenant_${assignmentId}_${Date.now()}.html`;
            const blob = new Blob([finalHtml], { type: 'text/html' });

            console.log("Preparing upload for:", fileName);
            const prepareData = await prepareUpload.mutateAsync({
                filename: fileName,
                content_type: 'text/html',
                size: blob.size,
                kind: 'resource'
            });

            console.log("Uploading to S3...");
            try {
                // Use .url from PrepareUploadResponse (not .upload_url)
                const uploadUrl = (prepareData as any).url || (prepareData as any).upload_url;
                if (!uploadUrl) {
                    throw new Error("URL d'upload non reçue du serveur.");
                }

                await axios.put(uploadUrl, blob, {
                    headers: { 'Content-Type': 'text/html' }
                });
            } catch (uploadErr: any) {
                console.error("S3 Upload failed:", uploadErr);
                throw new Error(`Échec du transfert vers le serveur de stockage: ${uploadErr.message}`);
            }

            console.log("Completing upload...");
            await completeUpload.mutateAsync({
                strategy: (prepareData as any).strategy || 'single',
                key: prepareData.key,
                upload_id: (prepareData as any).upload_id,
                content_type: 'text/html',
                size: blob.size
            });

            // 4. Update the assignment status by signing it
            console.log("Signing document...");
            if (typeof assignmentId === 'number') {
                // Legacy system: uses integer assignmentId and S3 file
                await signDocument.mutateAsync({
                    assignment_id: assignmentId,
                    signature_data: signatureData
                });
            } else {
                // New system: uses string UUID for SentDocument and stores HTML in DB
                const user = await fastAPIClient.getCurrentUser();
                await fastAPIClient.signLearnerDocument(
                    user.of_id,
                    user.id,
                    assignmentId,
                    signatureData,
                    finalHtml // Send updated HTML to be stored in DB
                );
            }

            console.log("Submission successful!");
            setStep('success');
            toast({
                title: "Document envoyé !",
                description: "Votre analyse de besoin a été complétée, signée et renvoyée avec succès.",
                variant: "default"
            });

            if (onSuccess) onSuccess();
        } catch (error: any) {
            console.error("Full submission process error:", error);
            const detail = error.response?.data?.detail || error.message || "Erreur inconnue";
            toast({
                title: "Échec de l'envoi",
                description: `Détail: ${detail}`,
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
                                <Button variant="outline" size="sm" onClick={handleSaveDraft} className="gap-2">
                                    <Save className="h-4 w-4" />
                                    Enregistrer
                                </Button>
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

                <div className="flex-1 overflow-hidden relative flex flex-col min-h-0">
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
                        <div className="flex-1 flex flex-col items-center justify-start p-8 space-y-8 overflow-y-auto min-h-0">
                            <div className="text-center">
                                <h3 className="text-xl font-bold">Signature électronique</h3>
                                <p className="text-muted-foreground text-sm mt-2">
                                    En signant ce document, vous certifiez l'exactitude des informations fournies.
                                </p>
                            </div>

                            <div className="w-full max-w-xl bg-white p-4 rounded-xl border-2 border-dashed border-gray-200">
                                <ElectronicSignature
                                    onSignatureComplete={handleSignatureComplete}
                                    disabled={isSaving}
                                />
                            </div>

                            {isSaving && (
                                <div className="flex items-center gap-2 text-blue-600 font-medium bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Envoi du document en cours...
                                </div>
                            )}

                            <Button variant="outline" onClick={() => setStep('edit')} disabled={isSaving}>
                                Retour au questionnaire
                            </Button>
                        </div>
                    ) : (
                        <div className="flex-1 w-full bg-slate-100/50 overflow-y-auto custom-scrollbar min-h-0">
                            <div className="py-8 flex flex-col items-center min-h-full w-full">
                                <style dangerouslySetInnerHTML={{
                                    __html: `
                                    .custom-scrollbar::-webkit-scrollbar {
                                        width: 8px;
                                    }
                                    .custom-scrollbar::-webkit-scrollbar-track {
                                        background: #f1f1f1;
                                    }
                                    .custom-scrollbar::-webkit-scrollbar-thumb {
                                        background: #cbd5e1;
                                        border-radius: 4px;
                                    }
                                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                                        background: #94a3b8;
                                    }
                                    .interactive-document-container {
                                        background-color: #fff;
                                        padding: 4rem !important;
                                        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                                        border-radius: 8px;
                                        width: 90%;
                                        max-width: 850px;
                                        margin-bottom: 3rem;
                                    }
                                    .interactive-document-container input[type="checkbox"] {
                                        width: 22px;
                                        height: 22px;
                                        cursor: pointer;
                                    }
                                    .interactive-document-container textarea.interactive-field {
                                        background-color: #f8fafc !important;
                                        border: 2px solid #e2e8f0 !important;
                                        border-radius: 8px !important;
                                        padding: 12px !important;
                                        width: 100% !important;
                                        margin-top: 10px !important;
                                        margin-bottom: 24px !important;
                                        transition: all 0.2s !important;
                                        font-size: 15px !important;
                                        line-height: 1.6 !important;
                                        color: #1e293b !important;
                                        display: block !important;
                                        min-height: 120px !important;
                                    }
                                    .interactive-document-container textarea.interactive-field:focus {
                                        border-color: #3b82f6 !important;
                                        background-color: #fff !important;
                                        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1) !important;
                                        outline: none !important;
                                    }
                                    .interactive-document-container .filled-value {
                                        color: #1d4ed8;
                                        font-weight: 600;
                                        padding: 2px 4px;
                                        background-color: #eff6ff;
                                        border-radius: 4px;
                                    }
                                `}} />
                                <div
                                    ref={containerRef}
                                    className="interactive-document-container prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
