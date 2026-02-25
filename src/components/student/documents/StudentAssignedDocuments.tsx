import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { FileText, Download, Eye, Clock, CheckCircle, Loader2, FileSignature } from 'lucide-react';
import { useMyDocuments, useSignDocumentFields } from '@/hooks/useApi';
import { fastAPIClient } from '@/services/fastapi-client';
import { DocumentSignerViewer } from './DocumentSignerViewer';
import { useToast } from '@/hooks/use-toast';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';

interface MediaAsset {
    id: number;
    filename: string;
    kind: string;
    size: number;
    url?: string;
    created_at: string;
}

interface UserMediaAssignment {
    id: number;
    media_asset: MediaAsset;
    is_viewed: boolean;
    assigned_at: string;
    message?: string;
    phase?: string;
    is_signed: boolean;
    signature_fields?: any[];
    signed_field_values?: Record<string, string>;
}

interface StudentAssignedDocumentsProps {
    targetPhase?: string;
}

export const StudentAssignedDocuments: React.FC<StudentAssignedDocumentsProps> = ({ targetPhase }) => {
    const { data: allAssignments, isLoading, error } = useMyDocuments();

    const assignments = React.useMemo(() => {
        if (!allAssignments) return [];
        if (!targetPhase) return allAssignments as UserMediaAssignment[];
        return (allAssignments as UserMediaAssignment[]).filter((a) => a.phase === targetPhase);
    }, [allAssignments, targetPhase]);

    const { toast } = useToast();
    const { user: currentUser } = useFastAPIAuth();
    const [selectedAssignment, setSelectedAssignment] = React.useState<UserMediaAssignment | null>(null);
    const [viewerOpen, setViewerOpen] = React.useState(false);
    const signFieldsMutation = useSignDocumentFields();

    const handleSign = (assignment: UserMediaAssignment) => {
        setSelectedAssignment(assignment);
        setViewerOpen(true);
    };

    const handleDownload = async (assignment: UserMediaAssignment) => {
        if (assignment.is_signed && assignment.signature_fields && assignment.signature_fields.length > 0) {
            try {
                await fastAPIClient.downloadSignedPdf(assignment.id);
                return;
            } catch (error) {
                console.error("Download error:", error);
                toast({ title: "Erreur", description: "Impossible de télécharger le document signé.", variant: "destructive" });
            }
        }

        if (assignment.media_asset.url) {
            window.open(assignment.media_asset.url, '_blank');
        }
    };

    const handleSignatureComplete = async (fieldValues: Record<string, string>) => {
        if (!selectedAssignment) return;

        try {
            await signFieldsMutation.mutateAsync({
                assignment_id: selectedAssignment.id,
                field_values: fieldValues
            });
            setViewerOpen(false);
            setSelectedAssignment(null);
            // Invalidate queries will handle refetch
        } catch (error) {
            console.error("Sign error:", error);
            throw error;
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Chargement de vos documents...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-12 text-center text-destructive">
                Impossible de charger les documents.
            </div>
        );
    }

    if (!assignments || assignments.length === 0) {
        return (
            <div className="p-12 text-center">
                <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">Aucun document assigné</h3>
                <p className="text-muted-foreground">Vous n'avez pas encore reçu de documents personnels de votre organisme.</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="grid gap-4">
                {assignments.map((assignment: UserMediaAssignment) => (
                    <Card key={assignment.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                            <div className="p-6 flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-lg">{assignment.media_asset.filename}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Reçu le {new Date(assignment.assigned_at).toLocaleDateString('fr-FR')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {assignment.phase && (
                                            <Badge variant="secondary" className="capitalize">
                                                {assignment.phase.replace('phase-', '').replace('-', ' ')}
                                            </Badge>
                                        )}
                                        <Badge variant={assignment.is_viewed ? "outline" : "default"} className="flex gap-1">
                                            {assignment.is_viewed ? (
                                                <><CheckCircle className="h-3 w-3" />Consulté</>
                                            ) : (
                                                <><Clock className="h-3 w-3" />Nouveau</>
                                            )}
                                        </Badge>
                                    </div>
                                </div>

                                {assignment.message && (
                                    <div className="mt-4 p-3 bg-muted rounded text-sm italic">
                                        "{assignment.message}"
                                    </div>
                                )}

                                <div className="mt-6 flex flex-wrap gap-3">
                                    {!assignment.is_signed && assignment.signature_fields && assignment.signature_fields.length > 0 ? (
                                        <>
                                            <Button className="bg-pink-600 hover:bg-pink-700" onClick={() => handleSign(assignment)}>
                                                <FileSignature className="h-4 w-4 mr-2" />
                                                Signer le document
                                            </Button>
                                            <Button variant="outline" onClick={() => handleSign(assignment)}>
                                                <Eye className="h-4 w-4 mr-2" />
                                                Consulter
                                            </Button>
                                        </>
                                    ) : (
                                        <Button variant="outline" onClick={() => window.open(assignment.media_asset.url, '_blank')}>
                                            <Eye className="h-4 w-4 mr-2" />
                                            Consulter
                                        </Button>
                                    )}

                                    <Button variant="outline" onClick={() => handleDownload(assignment)}>
                                        <Download className="h-4 w-4 mr-2" />
                                        Télécharger
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {selectedAssignment && (
                <DocumentSignerViewer
                    isOpen={viewerOpen}
                    onClose={() => {
                        setViewerOpen(false);
                        setSelectedAssignment(null);
                    }}
                    pdfUrl={selectedAssignment.media_asset.url || ''}
                    fields={selectedAssignment.signature_fields || []}
                    documentName={selectedAssignment.media_asset.filename}
                    learnerName={currentUser ? `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() : undefined}
                    onComplete={handleSignatureComplete}
                />
            )}
        </div>
    );
};
