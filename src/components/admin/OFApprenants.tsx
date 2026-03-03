
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Eye, Edit, Plus, Loader2, AlertCircle } from 'lucide-react';
import { OFApprenantDetail } from './OFApprenantDetail';
import { OFAddApprenant } from './OFAddApprenant';
import { useOFUsers, useCreateOFUser } from '@/hooks/useApi';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const OFApprenants = () => {
  const [selectedApprenant, setSelectedApprenant] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { toast } = useToast();

  const { user } = useFastAPIAuth();
  const ofId = user?.of_id;

  const { data: apiUsers, isLoading, isError, error } = useOFUsers(ofId);
  const createOFUser = useCreateOFUser(ofId);

  // Filtrer uniquement les apprenants
  const apprenants = (apiUsers || []).filter(
    (u: any) => u.role === 'apprenant' || u.role === 'learner'
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, label: 'Actif' },
      completed: { variant: 'secondary' as const, label: 'Terminé' },
      pending: { variant: 'outline' as const, label: 'En attente' },
      inactive: { variant: 'destructive' as const, label: 'Inactif' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleViewApprenant = (apprenant: any) => {
    setSelectedApprenant(apprenant);
    setIsDetailOpen(true);
  };

  const handleAddApprenant = async (apprenantData: any) => {
    try {
      await createOFUser.mutateAsync({
        email: apprenantData.email,
        first_name: apprenantData.prenom,
        last_name: apprenantData.nom,
        role: 'apprenant',
        phone: apprenantData.telephone || undefined,
      });
      toast({
        title: "Apprenant créé",
        description: "L'apprenant a été créé avec succès. Un email avec ses identifiants lui a été envoyé.",
      });
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err?.response?.data?.detail || "Impossible de créer l'apprenant",
        variant: "destructive",
      });
    }
  };

  if (!ofId) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Impossible de déterminer l'organisme de formation.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Gestion des apprenants</h1>
          <p className="text-muted-foreground">Suivi et gestion des apprenants</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} disabled={createOFUser.isPending}>
          {createOFUser.isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          Ajouter un apprenant
        </Button>
      </div>

      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erreur lors du chargement : {(error as any)?.message || 'Erreur inconnue'}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Liste des apprenants ({apprenants.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Chargement...</span>
            </div>
          ) : apprenants.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun apprenant pour le moment.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apprenants.map((apprenant: any) => (
                  <TableRow key={apprenant.id}>
                    <TableCell className="font-medium">
                      {apprenant.first_name || apprenant.prenom} {apprenant.last_name || apprenant.nom}
                    </TableCell>
                    <TableCell>{apprenant.email}</TableCell>
                    <TableCell>{getStatusBadge(apprenant.status || 'pending')}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewApprenant(apprenant)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <OFApprenantDetail
        apprenant={selectedApprenant}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      <OFAddApprenant
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAddApprenant}
      />
    </div>
  );
};
