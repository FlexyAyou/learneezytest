import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, CheckCircle, Clock, Eye, PenTool, Download } from 'lucide-react';
import { useMyDocuments, useSignDocument, useSaveDocument, useOrganization, useSignDocumentFields } from '@/hooks/useApi';
import { SignatureCanvas } from '@/components/signature/SignatureCanvas';
import { DocumentSignerViewer } from '@/components/student/documents/DocumentSignerViewer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Loader2, Save } from 'lucide-react';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';

export const StudentDocumentsPage: React.FC = () => {
    const { user } = useFastAPIAuth();
    const { data: documents, isLoading } = useMyDocuments();
    const signDocument = useSignDocument();
    const signDocumentFields = useSignDocumentFields();
    const saveDocument = useSaveDocument();

    const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
    const [showSignatureDialog, setShowSignatureDialog] = useState(false);
    const [showDocumentDialog, setShowDocumentDialog] = useState(false);
    const [showSignerViewer, setShowSignerViewer] = useState(false);

    const [htmlContent, setHtmlContent] = useState<string | null>(null);
    const documentContainerRef = React.useRef<HTMLDivElement>(null);

    const replacePlaceholders = (html: string) => {
        if (!html || !user) return html;
        let result = html;
        const data: any = {
            apprenant: {
                nom: user.last_name || '',
                prenom: user.first_name || '',
                email: user.email || '',
                nom_complet: `${user.first_name} ${user.last_name}`,
            },
            date: {
                jour: new Date().toLocaleDateString('fr-FR'),
                Heure: new Date().toLocaleTimeString('fr-FR'),
            }
        };

        for (const cat in data) {
            for (const field in data[cat]) {
                const placeholder = `{{${cat}.${field}}}`;
                result = result.split(placeholder).join(data[cat][field]);
            }
        }
        return result;
    };

    const handleViewDocument = async (doc: any) => {
        setSelectedDocument(doc);
        if (doc.html_content) {
            setHtmlContent(replacePlaceholders(doc.html_content));
        } else if (doc.media_asset && doc.media_asset.content_type === 'text/html') {
            try {
                const response = await fetch(doc.media_asset.download_url);
                const text = await response.text();
                setHtmlContent(replacePlaceholders(text));
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
        // Si le document a des signature_fields, ouvrir le DocumentSignerViewer
        if (doc.signature_fields && doc.signature_fields.length > 0) {
            setShowSignerViewer(true);
        } else {
            // Sinon, utiliser l'ancien système de signature
            if (doc.html_content) {
                setHtmlContent(replacePlaceholders(doc.html_content));
            } else if (doc.media_asset && doc.media_asset.content_type === 'text/html') {
                try {
                    const response = await fetch(doc.media_asset.download_url);
                    const text = await response.text();
                    setHtmlContent(replacePlaceholders(text));
                } catch (error) {
                    console.error("Erreur chargement document HTML", error);
                }
            }
            setShowSignatureDialog(true);
        }
    };

    const handleSignerComplete = async (fieldValues: Record<string, string>) => {
        if (!selectedDocument) return;
        try {
            await signDocumentFields.mutateAsync({
                assignment_id: selectedDocument.id,
                field_values: fieldValues
            });
            setShowSignerViewer(false);
            setSelectedDocument(null);
        } catch (error) {
            console.error('Erreur lors de la signature', error);
        }
    };

    const captureHtmlContent = (freeze: boolean = false): string | null => {
        const container = documentContainerRef.current;
        if (!container) return htmlContent;

        const clone = container.cloneNode(true) as HTMLElement;
        const sourceInputs = container.querySelectorAll('input, textarea, select');
        const cloneInputs = clone.querySelectorAll('input, textarea, select');

        sourceInputs.forEach((source: any, i) => {
            const dest = cloneInputs[i] as any;
            if (!dest) return;

            const val = source.value;

            if (freeze) {
                // Remplacer l'élément par un span statique pour "figer" le document
                const span = document.createElement('span');
                span.style.padding = '2px 5px';
                span.style.backgroundColor = '#f0f4f8';
                span.style.borderBottom = '1px solid #cbd5e1';
                span.style.borderRadius = '3px';
                span.style.display = 'inline-block';
                span.style.minWidth = '50px';

                if (source.type === 'checkbox' || source.type === 'radio') {
                    span.textContent = source.checked ? ' [X] ' : ' [ ] ';
                } else {
                    span.textContent = val || '...';
                    if (source.tagName.toLowerCase() === 'textarea') {
                        span.style.display = 'block';
                        span.style.width = '100%';
                        span.style.minHeight = '60px';
                        span.style.whiteSpace = 'pre-wrap';
                    }
                }
                dest.parentNode.replaceChild(span, dest);
            } else {
                // Juste mettre à jour les attributs
                if (source.type === 'checkbox' || source.type === 'radio') {
                    if (source.checked) dest.setAttribute('checked', 'checked');
                    else dest.removeAttribute('checked');
                } else {
                    dest.setAttribute('value', val);
                    if (source.tagName.toLowerCase() === 'textarea') {
                        dest.textContent = val;
                        dest.innerHTML = val;
                    }
                }
            }
        });

        return clone.innerHTML;
    };

    const handleSaveDraft = async () => {
        if (!selectedDocument) return;

        const capturedHtml = captureHtmlContent(false);
        if (!capturedHtml) return;

        try {
            await saveDocument.mutateAsync({
                assignment_id: selectedDocument.id,
                html_content: capturedHtml
            });
            setHtmlContent(capturedHtml);
        } catch (error) {
            console.error("Failed to save draft", error);
        }
    };

    const handleSaveSignature = async (signatureData: string) => {
        if (!selectedDocument) return;

        // On fige les réponses dans le HTML final (conversion inputs -> spans)
        const frozenHtml = captureHtmlContent(true);
        if (!frozenHtml) return;

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = frozenHtml;

        const cleanSignatureData = signatureData.replace(/\s/g, '');
        const signatureHtml = `
            <div style="margin-top: 15px; text-align: center; font-family: sans-serif; border: 1px solid #eee; padding: 15px; background: #fff; max-width: 400px; margin-left: auto; margin-right: auto;">
                <p style="margin-bottom: 8px; font-size: 14px; color: #1a1a1a;">
                    <strong>Document signé électroniquement le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</strong>
                </p>
                <img src="${cleanSignatureData}" alt="Signature" style="max-height: 100px; display: inline-block;" />
                <p style="font-size: 10px; color: #666; margin-top: 8px;">ID Validation: ${selectedDocument.id}</p>
            </div>
        `;

        // Recherche de la zone de signature (très robuste)
        let signatureZone = tempDiv.querySelector('#signature-zone') || tempDiv.querySelector('.signature-zone');

        // Alternative : chercher l'élément qui contient le texte "La signature sera apposée ici"
        if (!signatureZone) {
            const potentialElements = Array.from(tempDiv.querySelectorAll('div, p, td, span'));
            signatureZone = potentialElements.find(el => el.textContent?.includes('La signature sera apposée ici')) as HTMLElement;
        }

        if (signatureZone) {
            const sz = signatureZone as HTMLElement;
            sz.innerHTML = signatureHtml;
            // Nettoyage des styles de placeholder du template
            sz.style.background = 'transparent';
            sz.style.border = 'none';
            sz.style.minHeight = 'auto';
            sz.style.color = 'inherit';
        } else {
            // Append à la fin si vraiment rien trouvé
            tempDiv.insertAdjacentHTML('beforeend', `
                <div style="margin-top: 50px; border-top: 2px solid #333; padding-top: 20px;">
                    ${signatureHtml}
                </div>
            `);
        }

        const finalHtmlContent = tempDiv.innerHTML;

        await signDocument.mutateAsync({
            assignment_id: selectedDocument.id,
            signature_data: signatureData,
            html_content: finalHtmlContent
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
                                                    Consulter
                                                </Button>
                                                {doc.signature_fields && doc.signature_fields.length > 0 && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleSignDocument(doc)}
                                                    >
                                                        <PenTool className="h-4 w-4 mr-1" />
                                                        Signer le document
                                                    </Button>
                                                )}
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
                                // CAPTURE DES RÉPONSES AVANT DE FERMER
                                const updatedHtml = captureHtmlContent();
                                if (updatedHtml) {
                                    setHtmlContent(updatedHtml);
                                }
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

            {/* Document Signer Viewer */}
            {selectedDocument && (
                <DocumentSignerViewer
                    isOpen={showSignerViewer}
                    onClose={() => {
                        setShowSignerViewer(false);
                        setSelectedDocument(null);
                    }}
                    pdfUrl={selectedDocument.media_asset?.download_url || ''}
                    fields={selectedDocument.signature_fields || []}
                    documentName={selectedDocument.media_asset?.key?.split('/').pop() || 'Document'}
                    onComplete={handleSignerComplete}
                    learnerName={user ? `${user.first_name} ${user.last_name}` : undefined}
                    initialFieldValues={selectedDocument.signed_field_values || {}}
                />
            )}
        </div>
    );
};

export default StudentDocumentsPage;
