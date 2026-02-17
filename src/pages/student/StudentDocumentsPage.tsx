import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, CheckCircle, Clock, Eye, PenTool, Download } from 'lucide-react';
import { useMyDocuments, useSignDocument, useSaveDocument } from '@/hooks/useApi';
import { SignatureCanvas } from '@/components/signature/SignatureCanvas';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Loader2, Save } from 'lucide-react';

export const StudentDocumentsPage: React.FC = () => {
    const { data: documents, isLoading } = useMyDocuments();
    const signDocument = useSignDocument();
    const saveDocument = useSaveDocument();

    const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
    const [showSignatureDialog, setShowSignatureDialog] = useState(false);
    const [showDocumentDialog, setShowDocumentDialog] = useState(false);

    const [htmlContent, setHtmlContent] = useState<string | null>(null);
    const documentContainerRef = React.useRef<HTMLDivElement>(null);

    const handleViewDocument = async (doc: any) => {
        setSelectedDocument(doc);
        if (doc.media_asset && doc.media_asset.content_type === 'text/html') {
            try {
                const response = await fetch(doc.media_asset.download_url);
                const text = await response.text();
                setHtmlContent(text);
            } catch (error) {
                console.error("Erreur chargement document HTML", error);
                setHtmlContent(null);
            }
        } else {
            setHtmlContent(null);
        }
        setShowDocumentDialog(true);
    };

    const handleSignDocument = async (doc: any) => {
        setSelectedDocument(doc);
        // Pré-charger le HTML pour qu'il soit affiché en signature
        if (doc.media_asset && doc.media_asset.content_type === 'text/html') {
            try {
                const response = await fetch(doc.media_asset.download_url);
                const text = await response.text();
                setHtmlContent(text);
            } catch (error) {
                console.error("Erreur chargement document HTML", error);
            }
        }
        setShowSignatureDialog(true);
    };

    const captureHtmlContent = (): string | null => {
        if (!documentContainerRef.current) return htmlContent;

        const container = documentContainerRef.current;
        console.log("Capturing HTML content from container:", container);

        // 1. Inputs text / email / number / date / checkbox / radio
        const inputs = container.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.type === 'checkbox' || input.type === 'radio') {
                if (input.checked) {
                    input.setAttribute('checked', 'checked');
                } else {
                    input.removeAttribute('checked');
                }
            } else {
                input.setAttribute('value', input.value);
            }
            // Note: pas de disabled ici car on veut pouvoir continuer à éditer si c'est une sauvegarde
        });

        // 2. Textareas
        const textareas = container.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            textarea.textContent = textarea.value;
            textarea.innerHTML = textarea.value; // Fallback
        });

        // 3. Selects
        const selects = container.querySelectorAll('select');
        selects.forEach(select => {
            const options = select.querySelectorAll('option');
            options.forEach(option => {
                if (option.selected) {
                    option.setAttribute('selected', 'selected');
                } else {
                    option.removeAttribute('selected');
                }
            });
        });

        return container.innerHTML;
    };

    const handleSaveDraft = async () => {
        if (!selectedDocument) return;

        const capturedHtml = captureHtmlContent();
        if (!capturedHtml) {
            console.warn("No HTML content to save");
            return;
        }

        try {
            await saveDocument.mutateAsync({
                assignment_id: selectedDocument.id,
                html_content: capturedHtml
            });
            // Update local state is handled by query invalidation
        } catch (error) {
            console.error("Failed to save draft", error);
        }
    };

    const handleSaveSignature = async (signatureData: string) => {
        if (!selectedDocument) return;

        // CAPTURE DU HTML REMPLI
        let finalHtmlContent = captureHtmlContent();

        // Si on a un conteneur actif, on désactive les champs et on ajoute la signature
        if (finalHtmlContent && documentContainerRef.current) {
            // On recrée un élément temporaire pour manipuler le HTML final sans toucher à l'affichage live
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = finalHtmlContent;

            // Désactiver tous les inputs
            tempDiv.querySelectorAll('input, textarea, select').forEach(el => {
                el.setAttribute('disabled', 'disabled');
            });

            // 4. INJECTION DE LA SIGNATURE
            const signatureZone = tempDiv.querySelector('#signature-zone') || tempDiv.querySelector('.signature-zone');

            const signatureHtml = `
                <div style="margin-top: 20px; border-top: 1px solid #ccc; padding-top: 10px;">
                    <p><strong>Signé le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</strong></p>
                    <img src="${signatureData}" alt="Signature Apprenant" style="max-height: 100px; border: 1px solid #eee; padding: 5px; background: white;" />
                </div>
             `;

            if (signatureZone) {
                signatureZone.innerHTML = signatureHtml;
            } else {
                tempDiv.insertAdjacentHTML('beforeend', signatureHtml);
            }

            finalHtmlContent = tempDiv.innerHTML;
        }

        await signDocument.mutateAsync({
            assignment_id: selectedDocument.id,
            signature_data: signatureData,
            html_content: finalHtmlContent || undefined // On envoie le HTML rempli
        });

        setShowSignatureDialog(false);
        setSelectedDocument(null);
        setHtmlContent(null);
    };

    const getStatusBadge = (doc: any) => {
        if (doc.is_signed) {
            return (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Signé
                </Badge>
            );
        }
        return (
            <Badge variant="outline" className="text-orange-600 border-orange-600">
                <Clock className="h-3 w-3 mr-1" />
                En attente
            </Badge>
        );
    };

    const getPhaseBadge = (phase: string) => {
        const phaseConfig: Record<string, { label: string; color: string }> = {
            inscription: { label: 'Inscription', color: 'bg-blue-100 text-blue-800' },
            'pre-formation': { label: 'Pré-formation', color: 'bg-purple-100 text-purple-800' },
            formation: { label: 'Formation', color: 'bg-green-100 text-green-800' },
            'post-formation': { label: 'Post-formation', color: 'bg-orange-100 text-orange-800' },
            suivi: { label: 'Suivi', color: 'bg-gray-100 text-gray-800' },
        };

        const config = phaseConfig[phase] || { label: phase, color: 'bg-gray-100 text-gray-800' };
        return (
            <Badge className={`${config.color} hover:${config.color}`}>
                {config.label}
            </Badge>
        );
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const pendingDocs = documents?.filter((d: any) => !d.is_signed) || [];
    const signedDocs = documents?.filter((d: any) => d.is_signed) || [];

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Mes Documents</h1>
                <p className="text-muted-foreground">
                    Consultez et signez vos documents de formation
                </p>
            </div>

            {/* Documents en attente */}
            {pendingDocs.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-orange-600" />
                            Documents en attente de signature ({pendingDocs.length})
                        </CardTitle>
                        <CardDescription>
                            Ces documents nécessitent votre signature
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Document</TableHead>
                                    <TableHead>Phase</TableHead>
                                    <TableHead>Reçu le</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pendingDocs.map((doc: any) => (
                                    <TableRow key={doc.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="font-medium">
                                                        {doc.media_asset?.key?.split('/').pop() || 'Document'}
                                                    </p>
                                                    {doc.message && (
                                                        <p className="text-sm text-muted-foreground">{doc.message}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getPhaseBadge(doc.phase || 'inscription')}</TableCell>
                                        <TableCell>
                                            {format(new Date(doc.assigned_at), 'dd MMM yyyy', { locale: fr })}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(doc)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleViewDocument(doc)}
                                                >
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    Voir
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleSignDocument(doc)}
                                                >
                                                    <PenTool className="h-4 w-4 mr-1" />
                                                    Signer
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {/* Documents signés */}
            {signedDocs.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            Documents signés ({signedDocs.length})
                        </CardTitle>
                        <CardDescription>
                            Documents que vous avez déjà signés
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Document</TableHead>
                                    <TableHead>Phase</TableHead>
                                    <TableHead>Signé le</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {signedDocs.map((doc: any) => (
                                    <TableRow key={doc.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="font-medium">
                                                        {doc.media_asset?.key?.split('/').pop() || 'Document'}
                                                    </p>
                                                    {doc.message && (
                                                        <p className="text-sm text-muted-foreground">{doc.message}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getPhaseBadge(doc.phase || 'inscription')}</TableCell>
                                        <TableCell>
                                            {doc.signed_at && format(new Date(doc.signed_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(doc)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewDocument(doc)}
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                Voir
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {/* Empty state */}
            {(!documents || documents.length === 0) && (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Aucun document</h3>
                        <p className="text-muted-foreground text-center">
                            Vous n'avez pas encore reçu de documents à signer.
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Signature Dialog */}
            <Dialog open={showSignatureDialog} onOpenChange={setShowSignatureDialog}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Signer le document</DialogTitle>
                    </DialogHeader>
                    <SignatureCanvas
                        onSave={handleSaveSignature}
                        onCancel={() => setShowSignatureDialog(false)}
                    />

                    {/* Affichage du document EN DESSOUS de la zone de signature pour permettre la validation visuelle et le remplissage */}
                    {selectedDocument && htmlContent && (
                        <div className="mt-6 border-t pt-4">
                            <h3 className="font-semibold mb-2">Vérifiez et remplissez le document avant de signer :</h3>
                            <div
                                ref={documentContainerRef}
                                className="w-full h-[400px] border rounded p-4 bg-white overflow-auto text-sm"
                                dangerouslySetInnerHTML={{ __html: htmlContent }}
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Document View Dialog */}
            <Dialog open={showDocumentDialog} onOpenChange={setShowDocumentDialog}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Aperçu du document</DialogTitle>
                    </DialogHeader>
                    {selectedDocument && selectedDocument.media_asset && (
                        <div className="space-y-4">
                            {selectedDocument.media_asset.content_type === 'text/html' && htmlContent ? (
                                <div
                                    ref={documentContainerRef}
                                    className="w-full min-h-[600px] border rounded p-8 bg-white shadow-sm overflow-auto"
                                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                                />
                            ) : (
                                selectedDocument.media_asset.content_type === 'application/pdf' ? (
                                    <iframe
                                        src={selectedDocument.media_asset.download_url}
                                        className="w-full h-[600px] border rounded"
                                        title="Document"
                                    />
                                ) : (
                                    <div className="text-center p-8">
                                        <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                                        <p className="mb-4">Prévisualisation non disponible pour ce type de fichier</p>
                                        <Button asChild>
                                            <a href={selectedDocument.media_asset.download_url} download>
                                                <Download className="h-4 w-4 mr-2" />
                                                Télécharger
                                            </a>
                                        </Button>
                                    </div>
                                )
                            )}

                            {selectedDocument.is_signed && selectedDocument.signature_data && (
                                <div className="border-t pt-4">
                                    <h4 className="font-semibold mb-2">Signature</h4>
                                    <img
                                        src={selectedDocument.signature_data}
                                        alt="Signature"
                                        className="border rounded p-2 bg-white max-w-md"
                                    />
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Signé le {format(new Date(selectedDocument.signed_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Actions dans le footer du dialogue */}
                    {selectedDocument && !selectedDocument.is_signed && selectedDocument.media_asset?.content_type === 'text/html' && (
                        <div className="flex justify-end gap-2 mt-4 pt-4 border-t sticky bottom-0 bg-white">
                            <Button
                                variant="outline"
                                onClick={handleSaveDraft}
                                disabled={saveDocument.isPending}
                            >
                                {saveDocument.isPending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Enregistrement...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Enregistrer le brouillon
                                    </>
                                )}
                            </Button>
                            <Button onClick={() => {
                                setShowDocumentDialog(false);
                                setShowSignatureDialog(true);
                            }}>
                                <PenTool className="h-4 w-4 mr-2" />
                                Signer le document
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default StudentDocumentsPage;
