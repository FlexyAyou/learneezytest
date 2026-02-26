
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
import { getTemplateForType, personalizeDocumentContent } from '@/utils/personalizeDocumentContent';
import { usePrepareUpload, useCompleteUpload, useSignDocument, useSaveDocument, useOrganization } from '@/hooks/useApi';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';
import { fastAPIClient } from '@/services/fastapi-client';
import axios from 'axios';
import { IdentityVerificationModal, IdentityProof } from './IdentityVerificationModal';

interface StudentInteractiveDocumentModalProps {
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

export const StudentInteractiveDocumentModal: React.FC<StudentInteractiveDocumentModalProps> = ({
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
    const [identityModalOpen, setIdentityModalOpen] = useState(false);
    const [identityProof, setIdentityProof] = useState<IdentityProof | null>(null);

    // Hooks API for "sending back"
    const prepareUpload = usePrepareUpload();
    const completeUpload = useCompleteUpload();
    const signDocument = useSignDocument();
    const saveDocument = useSaveDocument();

    // Get current user and OF details for dynamic population
    const { user: currentUser } = useFastAPIAuth();
    const { data: ofData } = useOrganization(currentUser?.of_id || '');

    useEffect(() => {
        if (isOpen) {
            if (initialHtmlContent) {
                // Toujours tenter de personnaliser au cas où il s'agit d'un template brut
                setHtmlContent(getPersonalizedContent(initialHtmlContent));
            } else if (url) {
                fetchContent();
            } else {
                generateFromTemplate();
            }
            setStep('edit');
        }
    }, [isOpen, url, initialHtmlContent, ofData, currentUser]);

    const getPersonalizedContent = (rawHtml: string) => {
        if (!rawHtml) return '';

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

        // Map Learner Data
        const mappedLearnerData = {
            firstName: learnerData?.firstName || currentUser?.first_name || '',
            lastName: learnerData?.lastName || currentUser?.last_name || '',
            email: currentUser?.email || '',
            phone: currentUser?.phone || '',
            address: currentUser?.address || '',
            // These properties don't exist on UserResponse type, 
            // but might be available if learnerData is extended in the future
            postalCode: (learnerData as any)?.postalCode || '',
            city: (learnerData as any)?.city || '',
            company: (learnerData as any)?.company || '',
        };

        const personalized = personalizeDocumentContent(
            rawHtml,
            { id: '0', name: formationData?.name || 'Ma Formation' },
            mappedOFData,
            mappedLearnerData
        );

        return processInteractiveFields(personalized);
    };

    const generateFromTemplate = () => {
        const template = getTemplateForType(docType);
        if (template) {
            setHtmlContent(getPersonalizedContent(template));
        }
    };

    const processInteractiveFields = (htmlContent: string) => {
        // Remplacement des zones vides par des zones de texte éditables
        let processed = htmlContent.replace(
            /<div style="border: 1px solid #ccc; min-height: 80px; padding: 10px; margin-bottom: 20px;"><\/div>/g,
            '<textarea class="interactive-field" placeholder="Saisissez votre réponse ici..." style="width: 100%; border: 1px solid #ccc; min-height: 80px; padding: 10px; margin-bottom: 20px; font-family: inherit; resize: vertical;"></textarea>'
        ).replace(
            /<li>☐ (.*?)<\/li>/g,
            '<li><label style="display: flex; align-items: center; gap: 8px; cursor: pointer;"><input type="checkbox" name="competence" class="interactive-checkbox" /> $1</label></li>'
        );

        // Si le document contenait déjà des valeurs (provenant d'une sauvegarde précédente), 
        // elles sont dans les attributs value ou checked. On les laisse telles quelles.
        return processed;
    };

    const fetchContent = async () => {
        setIsLoading(true);
        try {
            if (url) {
                try {
                    const response = await axios.get(url, { responseType: 'text' });
                    setHtmlContent(getPersonalizedContent(response.data));
                } catch (fetchErr) {
                    console.info("Document non encore généré (404), utilisation du template local.");
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

    const captureCurrentHtml = (): string | null => {
        if (!containerRef.current) return null;

        // Créer un clone pour manipuler le HTML
        const clone = containerRef.current.cloneNode(true) as HTMLElement;
        const sourceInputs = containerRef.current.querySelectorAll('input, textarea, select');
        const cloneInputs = clone.querySelectorAll('input, textarea, select');

        sourceInputs.forEach((source: any, i) => {
            const dest = cloneInputs[i] as any;
            if (!dest) return;

            if (source.type === 'checkbox' || source.type === 'radio') {
                if (source.checked) dest.setAttribute('checked', 'checked');
                else dest.removeAttribute('checked');
            } else {
                dest.setAttribute('value', source.value);
                if (source.tagName.toLowerCase() === 'textarea') {
                    dest.textContent = source.value;
                }
            }
        });

        return clone.innerHTML;
    };

    const handleSaveDraft = async () => {
        const currentHtml = captureCurrentHtml();
        if (!currentHtml) return;

        setIsSaving(true);
        try {
            await saveDocument.mutateAsync({
                assignment_id: assignmentId,
                html_content: currentHtml
            });
            // Update local state to reflect current state
            setHtmlContent(currentHtml);
        } catch (error) {
            console.error("Error saving draft to server:", error);
            // Fallback to local storage if server fails
            const values: Record<string, string | boolean> = {};
            const inputs = containerRef.current?.querySelectorAll('input, textarea') || [];
            inputs.forEach((input: any, index: number) => {
                const key = `field_${index}`;
                values[key] = input.type === 'checkbox' ? input.checked : input.value;
            });
            localStorage.setItem(`draft_${docType}_${assignmentId}`, JSON.stringify(values));
            toast({
                title: "Sauvegarde locale",
                description: "Le serveur n'a pas pu être joint. Vos réponses sont sauvées sur ce navigateur.",
                variant: "destructive"
            });
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        // Apply draft values when component is ready
        if (!isLoading && step === 'edit' && containerRef.current) {
            const draftKey = `draft_${docType}_${assignmentId}`;
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
    }, [isLoading, step, assignmentId, docType]);

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
        setIdentityModalOpen(true);
    };

    const handleIdentityVerified = (proof: IdentityProof) => {
        setIdentityProof(proof);
        setStep('sign');
    };

    const handleSignatureComplete = async (signatureData: string) => {
        if (!assignmentId) {
            toast({
                title: "Erreur interne",
                description: "Identifiant du document manquant. Impossible d'envoyer.",
                variant: "destructive"
            });
            return;
        }

        setIsSaving(true);
        try {
            console.log(`Starting ${docType} submission for assignment:`, assignmentId);

            // 1. Extract filled content and "freeze" it
            const completedHtml = extractFormResults();

            // 2. Wrap and inject signature
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = completedHtml;

            const signatureHtml = `
                <div class="signature-block" style="margin-top: 20px; text-align: center; border: 1px solid #eee; padding: 15px; background: #fff;">
                    <p style="margin-bottom: 8px; font-size: 14px;"><strong>Signé électroniquement le :</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
                    <img src="${signatureData}" alt="Signature" style="max-height: 100px; display: inline-block;" />
                    <p style="font-size: 10px; color: #666; margin-top: 8px;">ID Validation: ${assignmentId}</p>
                </div>
            `;

            // Recherche de la zone de signature
            let signatureZone = tempDiv.querySelector('#signature-zone') || tempDiv.querySelector('.signature-zone');
            if (!signatureZone) {
                const potentialElements = Array.from(tempDiv.querySelectorAll('div, p, td, span'));
                signatureZone = potentialElements.find(el => el.textContent?.includes('La signature sera apposée ici')) as HTMLElement;
            }

            if (signatureZone) {
                const sz = signatureZone as HTMLElement;
                sz.innerHTML = signatureHtml;
                sz.style.background = 'transparent';
                sz.style.border = 'none';
                sz.style.minHeight = 'auto';
            } else {
                tempDiv.insertAdjacentHTML('beforeend', signatureHtml);
            }

            const finalHtmlContent = tempDiv.innerHTML;

            const finalHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: sans-serif; line-height: 1.5; color: #333; }
            .content { max-width: 850px; margin: 0 auto; padding: 40px; background: white; }
            .signature-block { margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; text-align: center; }
            .signature-img { max-width: 250px; height: auto; }
            .filled-value { text-decoration: underline; font-weight: bold; color: #1d4ed8; padding: 0 4px; }
            @page { size: A4; margin: 0; }
          </style>
        </head>
        <body>
          <div class="content">
            ${finalHtmlContent}
          </div>
        </body>
        </html>
      `;

            // 3. Upload the completed document
            const fileName = `${docType}_Apprenant_${assignmentId}_${Date.now()}.html`;
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
                const uploadUrl = (prepareData as any).url || (prepareData as any).upload_url;
                if (!uploadUrl) throw new Error("URL d'upload non reçue du serveur.");

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
                await signDocument.mutateAsync({
                    assignment_id: assignmentId,
                    signature_data: signatureData
                });
            } else {
                const user = await fastAPIClient.getCurrentUser();
                await fastAPIClient.signLearnerDocument(
                    user.of_id,
                    user.id,
                    assignmentId,
                    signatureData,
                    finalHtml,
                    identityProof || undefined
                );
            }

            console.log("Submission successful!");
            setStep('success');
            toast({
                title: "Document envoyé !",
                description: `${title} a été complété, signé et renvoyé avec succès.`,
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
                            {step === 'edit' ? "Veuillez vérifier les informations ci-dessous et signer le document." :
                                step === 'sign' ? "Apposez votre signature pour valider le document." :
                                    "Document envoyé avec succès."}
                        </DialogDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        {step === 'edit' && (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleSaveDraft}
                                    className="gap-2"
                                    disabled={isSaving}
                                >
                                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
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
                            <p className="text-muted-foreground animate-pulse">Chargement du document...</p>
                        </div>
                    ) : step === 'success' ? (
                        <div className="flex flex-col items-center justify-center h-full p-12 text-center space-y-6">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-12 w-12 text-green-600" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold">C'est envoyé !</h3>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                    Votre {title.toLowerCase()} a été transmise à votre organisme de formation.
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
                                Retour au document
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
            <IdentityVerificationModal
                isOpen={identityModalOpen}
                onClose={() => setIdentityModalOpen(false)}
                onVerified={handleIdentityVerified}
            />
        </Dialog>
    );
};
