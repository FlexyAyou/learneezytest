import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
    FileText, Eye, Send, Edit, Users, Sparkles,
    CheckCircle, Loader2, AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useOFUsers, useAssignMedia, usePrepareUpload, useCompleteUpload } from '@/hooks/useApi';
import { useOrganization } from '@/contexts/OrganizationContext';
import { useAuth } from '@/hooks/useApi';
import { DEFAULT_TEMPLATES } from './defaultTemplates';

interface AnalyseBesoinSenderProps {
    ofId?: number;
    ofInfo?: any;
    isOpen?: boolean;
    onClose?: () => void;
    template?: any;
}

export const AnalyseBesoinSender: React.FC<AnalyseBesoinSenderProps> = ({ ofId: propOfId, ofInfo: propOfInfo, isOpen, onClose, template }) => {
    const { toast } = useToast();
    const { organization } = useOrganization();
    const { user: authUser } = useAuth();

    // Get OF ID from props, context, or auth
    const ofId = propOfId || organization?.organizationId || (organization as any)?.organization_id || authUser?.of_id;

    // State
    const [activeStep, setActiveStep] = useState<'edit' | 'preview' | 'send'>('edit');
    const [htmlContent, setHtmlContent] = useState(template?.htmlContent || DEFAULT_TEMPLATES.analyse_besoin || '');
    const [selectedLearners, setSelectedLearners] = useState<number[]>([]);
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // Update htmlContent if template changes
    React.useEffect(() => {
        if (template?.htmlContent) {
            setHtmlContent(template.htmlContent);
        }
    }, [template]);

    // Hooks
    const { data: learnersRaw, isLoading: learnersLoading } = useOFUsers(ofId);
    const assign = useAssignMedia();
    const prepare = usePrepareUpload();
    const complete = useCompleteUpload();

    // Convert API users to learners
    const learners = useMemo(() => {
        return (learnersRaw || [])
            .filter(u => {
                const role = u.role?.toLowerCase();
                return role === 'student' || role === 'apprenant' || role === 'stagiaire' || role === 'eleve';
            })
            .map(u => ({
                id: u.id,
                firstName: u.first_name || '',
                lastName: u.last_name || '',
                email: u.email,
                phone: u.phone || '',
            }));
    }, [learnersRaw]);

    // Dynamic fields replacement for preview
    const replaceDynamicFields = (html: string, learner?: any) => {
        const now = new Date();
        const org = propOfInfo || organization || {};
        const mockData = {
            'of.nom': org.name || org.nom || 'Nom OF',
            'of.nda': org.numero_declaration || org.nda || '',
            'of.siret': org.siret || '',
            'of.adresse': org.address || org.adresse || '',
            'of.code_postal': org.postal_code || org.postalCode || org.code_postal || '',
            'of.ville': org.city || org.ville || '',
            'of.telephone': org.phone || org.telephone || '',
            'of.email': org.contact_email || org.email || '',
            'of.responsable': org.legal_representative || org.responsable || '',
            'apprenant.nom': learner?.lastName || 'Nom',
            'apprenant.prenom': learner?.firstName || 'Prénom',
            'apprenant.entreprise': learner?.company || 'Entreprise',
            'apprenant.poste': learner?.position || 'Poste',
            'formation.nom': 'Formation Exemple',
            'date.jour': now.toLocaleDateString('fr-FR'),
        };

        let result = html;
        Object.entries(mockData).forEach(([key, value]) => {
            const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
            result = result.replace(regex, value || '');
        });
        return result;
    };

    // Handle HTML upload and send
    const handleSendDocument = async () => {
        console.log('handleSendDocument: Start', { learnersCount: selectedLearners.length });

        if (selectedLearners.length === 0) {
            toast({
                title: 'Erreur',
                description: 'Veuillez sélectionner au moins un apprenant.',
                variant: 'destructive',
            });
            return;
        }

        setIsUploading(true);
        try {
            // Replaces OF fields once for the batch
            const basePersonalizedHtml = replaceDynamicFields(htmlContent);

            console.log('handleSendDocument: Creating blob...');
            // Create HTML blob
            const blob = new Blob([basePersonalizedHtml], { type: 'text/html' });
            const file = new File([blob], 'analyse_besoin.html', { type: 'text/html' });

            // Prepare upload
            console.log('handleSendDocument: Preparing upload...', { size: file.size, type: file.type });
            const prepareResponse = await prepare.mutateAsync({
                filename: file.name,
                content_type: file.type,
                size: file.size,
                kind: 'resource',
            });

            // Upload file
            console.log('handleSendDocument: Uploading to S3...');
            const uploadResponse = await fetch(prepareResponse.upload_url, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type,
                },
            });

            if (!uploadResponse.ok) {
                throw new Error('Upload failed');
            }

            // Complete upload
            const completeResponse = await complete.mutateAsync({
                strategy: 'single',
                key: prepareResponse.key,
                content_type: file.type,
                size: file.size,
            });

            // Assign to learners
            const promises = selectedLearners.map(userId =>
                assign.mutateAsync({
                    user_id: userId,
                    media_asset_id: completeResponse.id!,
                    message: message || 'Veuillez compléter votre analyse de besoin',
                    phase: 'inscription',
                })
            );

            await Promise.all(promises);

            toast({
                title: 'Document envoyé',
                description: `L'analyse de besoin a été envoyée à ${selectedLearners.length} apprenant(s).`,
            });

            // Reset
            setSelectedLearners([]);
            setMessage('');
            setActiveStep('edit');
            if (onClose) onClose();
        } catch (error) {
            console.error('Error sending document:', error);
            toast({
                title: 'Erreur',
                description: 'Impossible d\'envoyer le document.',
                variant: 'destructive',
            });
        } finally {
            setIsUploading(false);
        }
    };

    const toggleLearner = (learnerId: number) => {
        setSelectedLearners(prev =>
            prev.includes(learnerId)
                ? prev.filter(id => id !== learnerId)
                : [...prev, learnerId]
        );
    };

    const selectAllLearners = () => {
        if (selectedLearners.length === learners.length) {
            setSelectedLearners([]);
        } else {
            setSelectedLearners(learners.map(l => l.id));
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Analyse du Besoin de Formation
                    </CardTitle>
                    <CardDescription>
                        Personnalisez, prévisualisez et envoyez l'analyse de besoin à vos apprenants
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Steps Navigation */}
            <Tabs value={activeStep} onValueChange={(v) => setActiveStep(v as any)}>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="edit" className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        Édition
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Prévisualisation
                    </TabsTrigger>
                    <TabsTrigger value="send" className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Envoi
                    </TabsTrigger>
                </TabsList>

                {/* Step 1: Edit */}
                <TabsContent value="edit" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Éditeur HTML</CardTitle>
                            <CardDescription>
                                Modifiez le template HTML. Utilisez les variables dynamiques comme {`{{apprenant.nom}}`}, {`{{of.nom}}`}, etc.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Code HTML du document</Label>
                                <Textarea
                                    value={htmlContent}
                                    onChange={(e) => setHtmlContent(e.target.value)}
                                    className="font-mono text-sm min-h-[400px]"
                                    placeholder="Entrez votre code HTML ici..."
                                />
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                    <Sparkles className="h-4 w-4" />
                                    Variables disponibles
                                </h4>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <code className="bg-white px-2 py-1 rounded">{`{{of.nom}}`}</code>
                                    <code className="bg-white px-2 py-1 rounded">{`{{of.nda}}`}</code>
                                    <code className="bg-white px-2 py-1 rounded">{`{{apprenant.prenom}}`}</code>
                                    <code className="bg-white px-2 py-1 rounded">{`{{apprenant.nom}}`}</code>
                                    <code className="bg-white px-2 py-1 rounded">{`{{formation.nom}}`}</code>
                                    <code className="bg-white px-2 py-1 rounded">{`{{date.jour}}`}</code>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={() => setActiveStep('preview')}>
                                    Prévisualiser
                                    <Eye className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Step 2: Preview */}
                <TabsContent value="preview" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Prévisualisation</CardTitle>
                            <CardDescription>
                                Aperçu du document avec les champs dynamiques remplacés
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-lg p-6 bg-white shadow-sm">
                                <div
                                    dangerouslySetInnerHTML={{ __html: replaceDynamicFields(htmlContent) }}
                                />
                            </div>

                            <div className="flex justify-between mt-6">
                                <Button variant="outline" onClick={() => setActiveStep('edit')}>
                                    Retour à l'édition
                                </Button>
                                <Button onClick={() => setActiveStep('send')}>
                                    Passer à l'envoi
                                    <Send className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Step 3: Send */}
                <TabsContent value="send" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Sélection des apprenants
                            </CardTitle>
                            <CardDescription>
                                Choisissez les apprenants qui recevront l'analyse de besoin
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={selectAllLearners}
                                >
                                    {selectedLearners.length === learners.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                                </Button>
                                <Badge variant="secondary">
                                    {selectedLearners.length} / {learners.length} sélectionné(s)
                                </Badge>
                            </div>

                            {learnersLoading ? (
                                <div className="flex justify-center p-8">
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                </div>
                            ) : learners.length === 0 ? (
                                <div className="text-center p-8 text-muted-foreground">
                                    <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>Aucun apprenant trouvé</p>
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                    {learners.map((learner) => (
                                        <div
                                            key={learner.id}
                                            className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                            onClick={() => toggleLearner(learner.id)}
                                        >
                                            <Checkbox
                                                checked={selectedLearners.includes(learner.id)}
                                                onCheckedChange={() => toggleLearner(learner.id)}
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium">
                                                    {learner.firstName} {learner.lastName}
                                                </p>
                                                <p className="text-sm text-muted-foreground">{learner.email}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label>Message personnalisé (optionnel)</Label>
                                <Textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Ajoutez un message pour accompagner le document..."
                                    rows={3}
                                />
                            </div>

                            <div className="flex justify-between pt-4">
                                <Button variant="outline" onClick={() => setActiveStep('preview')}>
                                    Retour à la prévisualisation
                                </Button>
                                <Button
                                    onClick={handleSendDocument}
                                    disabled={selectedLearners.length === 0 || isUploading}
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Envoi en cours...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-4 w-4" />
                                            Envoyer ({selectedLearners.length})
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};
