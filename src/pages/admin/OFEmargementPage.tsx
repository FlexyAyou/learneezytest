import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';
import { useEmargements } from '@/hooks/useDocuments';
import { PenTool, Download, Filter, Users, CheckCircle, XCircle, Eye, Loader2 } from 'lucide-react';

interface EmargementRow {
  id: string;
  learner_name: string;
  learner_email: string;
  document_type: string;
  document_title: string;
  status: string;
  signed_at?: string;
  signature_data?: string;
  ip_address?: string;
}

const OFEmargementPage: React.FC = () => {
  const { toast } = useToast();
  const { user } = useFastAPIAuth();
  const ofId = user?.of_id;
  const { data: emargementsData, isLoading } = useEmargements(ofId);

  const [filterStatus, setFilterStatus] = useState<'all' | 'signed' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Flatten learners + documents into rows
  const rows: EmargementRow[] = useMemo(() => {
    const learners = emargementsData?.learners ?? [];
    return learners.flatMap(learner =>
      learner.documents.map(doc => ({
        id: `${learner.learner_id}-${doc.document_id}`,
        learner_name: learner.learner_name,
        learner_email: learner.learner_email,
        document_type: doc.document_type,
        document_title: doc.document_title || doc.document_type,
        status: doc.status,
        signed_at: doc.signed_at,
        signature_data: doc.signature_data,
        ip_address: doc.signature_metadata?.ip_address,
      }))
    );
  }, [emargementsData]);

  const filteredRows = useMemo(() => {
    let result = rows;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(r =>
        r.learner_name.toLowerCase().includes(term) ||
        r.learner_email.toLowerCase().includes(term) ||
        r.document_title.toLowerCase().includes(term)
      );
    }
    if (filterStatus === 'signed') {
      result = result.filter(r => r.status === 'signed' || r.status === 'completed');
    } else if (filterStatus === 'pending') {
      result = result.filter(r => r.status !== 'signed' && r.status !== 'completed');
    }
    return result;
  }, [rows, searchTerm, filterStatus]);

  const stats = useMemo(() => {
    const total = rows.length;
    const signed = rows.filter(r => r.status === 'signed' || r.status === 'completed').length;
    const pending = total - signed;
    const totalLearners = emargementsData?.total_learners ?? new Set(rows.map(r => r.learner_name)).size;
    return { total, signed, pending, totalLearners };
  }, [rows, emargementsData]);

  const exportEmargements = () => {
    const csvContent = [
      ['Apprenant', 'Email', 'Document', 'Type', 'Statut', 'Date signature', 'IP'],
      ...filteredRows.map(r => [
        r.learner_name,
        r.learner_email,
        r.document_title,
        r.document_type,
        r.status === 'signed' || r.status === 'completed' ? 'Signé' : 'En attente',
        r.signed_at || 'N/A',
        r.ip_address || 'N/A',
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emargements_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export réussi",
      description: "Le fichier des émargements a été téléchargé",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <PenTool className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Gestion des Émargements</h2>
            <p className="text-muted-foreground">Suivi des présences et signatures</p>
          </div>
        </div>
        <Button onClick={exportEmargements} className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Exporter</span>
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Apprenants</p>
                <p className="text-2xl font-bold">{stats.totalLearners}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <PenTool className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total documents</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Signés</p>
                <p className="text-2xl font-bold text-green-600">{stats.signed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-destructive" />
              <div>
                <p className="text-sm text-muted-foreground">En attente</p>
                <p className="text-2xl font-bold text-destructive">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtres</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Rechercher</Label>
              <Input
                placeholder="Nom, email ou document..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label>Statut</Label>
              <Select value={filterStatus} onValueChange={(v: any) => setFilterStatus(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="signed">Signés</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des émargements */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Émargements</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Chargement...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Apprenant</TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date signature</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{row.learner_name}</div>
                        <div className="text-sm text-muted-foreground">{row.learner_email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{row.document_title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{row.document_type}</Badge>
                    </TableCell>
                    <TableCell>
                      {row.status === 'signed' || row.status === 'completed' ? (
                        <Badge variant="secondary">
                          <PenTool className="h-3 w-3 mr-1" />
                          Signé
                        </Badge>
                      ) : (
                        <Badge variant="outline">En attente</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {row.signed_at
                        ? new Date(row.signed_at).toLocaleString('fr-FR')
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="text-sm font-mono">
                      {row.ip_address || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Aucun émargement trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OFEmargementPage;
