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
import { FileText, Download, Eye, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { useMyDocuments } from '@/hooks/useApi';

export const StudentAssignedDocuments: React.FC = () => {
    const { data: assignments, isLoading, error } = useMyDocuments();

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
                {assignments.map((assignment: any) => (
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
                                    <Badge variant={assignment.is_viewed ? "outline" : "default"} className="flex gap-1">
                                        {assignment.is_viewed ? (
                                            <><CheckCircle className="h-3 w-3" />Consulté</>
                                        ) : (
                                            <><Clock className="h-3 w-3" />Nouveau</>
                                        )}
                                    </Badge>
                                </div>

                                {assignment.message && (
                                    <div className="mt-4 p-3 bg-muted rounded text-sm italic">
                                        "{assignment.message}"
                                    </div>
                                )}

                                <div className="mt-6 flex gap-3">
                                    <Button asChild>
                                        <a href={assignment.media_asset.url} target="_blank" rel="noopener noreferrer">
                                            <Eye className="h-4 w-4 mr-2" />
                                            Consulter
                                        </a>
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <a href={assignment.media_asset.url} download={assignment.media_asset.filename}>
                                            <Download className="h-4 w-4 mr-2" />
                                            Télécharger
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
