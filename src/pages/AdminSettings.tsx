import React, { useState, useEffect } from 'react';
import { Building2, Mail, Phone, MapPin, FileText, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';
import { useToast } from '@/hooks/use-toast';
import { fastAPIClient } from '@/services/fastapi-client';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { OrganizationResponse } from '@/types/fastapi';

const AdminSettings = () => {
    const { user, isLoading: authLoading } = useFastAPIAuth();
    const { toast } = useToast();

    const [organization, setOrganization] = useState<OrganizationResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form fields
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [legalRepresentative, setLegalRepresentative] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [address, setAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [phone, setPhone] = useState('');
    const [siret, setSiret] = useState('');
    const [numeroDeclaration, setNumeroDeclaration] = useState('');

    // Initial values for change detection
    const [initialValues, setInitialValues] = useState({
        name: '',
        description: '',
        legalRepresentative: '',
        contactEmail: '',
        address: '',
        postalCode: '',
        city: '',
        phone: '',
        siret: '',
        numeroDeclaration: '',
    });

    // Load organization data
    useEffect(() => {
        const loadOrganization = async () => {
            if (!user?.of_id) {
                setIsLoading(false);
                return;
            }

            try {
                const org = await fastAPIClient.getOrganization(user.of_id);
                setOrganization(org);

                const values = {
                    name: org.name || '',
                    description: org.description || '',
                    legalRepresentative: org.legal_representative || '',
                    contactEmail: org.contact_email || '',
                    address: org.address || '',
                    postalCode: org.postal_code || '',
                    city: org.city || '',
                    phone: org.phone || '',
                    siret: org.siret || '',
                    numeroDeclaration: org.numero_declaration || '',
                };

                setName(values.name);
                setDescription(values.description);
                setLegalRepresentative(values.legalRepresentative);
                setContactEmail(values.contactEmail);
                setAddress(values.address);
                setPostalCode(values.postalCode);
                setCity(values.city);
                setPhone(values.phone);
                setSiret(values.siret);
                setNumeroDeclaration(values.numeroDeclaration);
                setInitialValues(values);
            } catch (error: any) {
                console.error('Error loading organization:', error);
                toast({
                    title: 'Erreur',
                    description: 'Impossible de charger les informations de l\'organisation',
                    variant: 'destructive',
                });
            } finally {
                setIsLoading(false);
            }
        };

        loadOrganization();
    }, [user?.of_id, toast]);

    // Detect changes
    const hasChanges =
        name !== initialValues.name ||
        description !== initialValues.description ||
        legalRepresentative !== initialValues.legalRepresentative ||
        contactEmail !== initialValues.contactEmail ||
        address !== initialValues.address ||
        postalCode !== initialValues.postalCode ||
        city !== initialValues.city ||
        phone !== initialValues.phone ||
        siret !== initialValues.siret ||
        numeroDeclaration !== initialValues.numeroDeclaration;

    const handleSave = async () => {
        if (!user?.of_id) return;

        setIsSaving(true);
        try {
            const updatedOrg = await fastAPIClient.updateOrganization(user.of_id, {
                name,
                description,
                legal_representative: legalRepresentative,
                contact_email: contactEmail,
                address,
                city,
                phone,
                siret,
                numero_declaration: numeroDeclaration,
            } as any);

            setOrganization(updatedOrg);

            // Update initial values
            const values = {
                name: updatedOrg.name || '',
                description: updatedOrg.description || '',
                legalRepresentative: updatedOrg.legal_representative || '',
                contactEmail: updatedOrg.contact_email || '',
                address: updatedOrg.address || '',
                postalCode: updatedOrg.postal_code || '',
                city: updatedOrg.city || '',
                phone: updatedOrg.phone || '',
                siret: updatedOrg.siret || '',
                numeroDeclaration: updatedOrg.numero_declaration || '',
            };
            setInitialValues(values);

            toast({
                title: 'Succès',
                description: 'Les informations de l\'organisation ont été mises à jour',
            });
        } catch (error: any) {
            console.error('Error updating organization:', error);
            toast({
                title: 'Erreur',
                description: error.response?.data?.detail || 'Impossible de mettre à jour l\'organisation',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (authLoading || isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!user?.of_id) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Accès refusé</CardTitle>
                        <CardDescription>Vous n'êtes pas administrateur d'une organisation</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres de l'organisation</h1>
                    <p className="text-gray-600">Gérez les informations de votre organisme de formation</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl">
                    {/* Informations générales */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Building2 className="h-5 w-5 mr-2 text-pink-600" />
                                Informations générales
                            </CardTitle>
                            <CardDescription>Informations principales de votre organisme</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nom de l'organisme *</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Ex: Centre de Formation Digital"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="legalRepresentative">Représentant légal *</Label>
                                    <Input
                                        id="legalRepresentative"
                                        value={legalRepresentative}
                                        onChange={(e) => setLegalRepresentative(e.target.value)}
                                        placeholder="Ex: Jean Dupont"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Décrivez votre activité..."
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Coordonnées */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <MapPin className="h-5 w-5 mr-2 text-pink-600" />
                                Coordonnées
                            </CardTitle>
                            <CardDescription>Adresse et contact</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="address">Adresse *</Label>
                                <Input
                                    id="address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Ex: 123 Rue de la Formation"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="postalCode">Code postal</Label>
                                    <Input
                                        id="postalCode"
                                        value={postalCode}
                                        onChange={(e) => setPostalCode(e.target.value)}
                                        placeholder="Ex: 75001"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city">Ville</Label>
                                    <Input
                                        id="city"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder="Ex: Paris"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Téléphone *</Label>
                                <Input
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Ex: 01 23 45 67 89"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contactEmail">Email de contact *</Label>
                                <Input
                                    id="contactEmail"
                                    type="email"
                                    value={contactEmail}
                                    onChange={(e) => setContactEmail(e.target.value)}
                                    placeholder="contact@organisme.fr"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Informations légales */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <FileText className="h-5 w-5 mr-2 text-pink-600" />
                                Informations légales
                            </CardTitle>
                            <CardDescription>SIRET et numéro de déclaration</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="siret">SIRET *</Label>
                                <Input
                                    id="siret"
                                    value={siret}
                                    onChange={(e) => setSiret(e.target.value)}
                                    placeholder="14 chiffres"
                                    maxLength={14}
                                />
                                <p className="text-xs text-gray-500">Format: 12345678901234</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="numeroDeclaration">Numéro de déclaration d'activité (NDA) *</Label>
                                <Input
                                    id="numeroDeclaration"
                                    value={numeroDeclaration}
                                    onChange={(e) => setNumeroDeclaration(e.target.value)}
                                    placeholder="Ex: 11-75-12345-75"
                                />
                                <p className="text-xs text-gray-500">Numéro d'enregistrement auprès de la DREETS</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card className="lg:col-span-2">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-600">
                                    {hasChanges ? 'Vous avez des modifications non sauvegardées' : 'Aucune modification'}
                                </p>
                                <Button
                                    onClick={handleSave}
                                    disabled={!hasChanges || isSaving}
                                    className="bg-pink-600 hover:bg-pink-700"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {isSaving ? 'Enregistrement...' : 'Sauvegarder les modifications'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default AdminSettings;
