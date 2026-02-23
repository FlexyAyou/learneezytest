
import React from 'react';
import { Euro, TrendingUp, CreditCard, AlertCircle, Download, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { usePayments, usePaymentStats } from '@/hooks/useApi';
import { fastAPIClient } from '@/services/fastapi-client';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const AdminPayments = () => {
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = React.useState("");
  const { data: stats, isLoading: statsLoading } = usePaymentStats();
  const { data: paymentsData, isLoading: paymentsLoading } = usePayments({ search: searchTerm });

  const handleExportPayments = () => {
    toast({
      title: "Export des paiements",
      description: "Le rapport des paiements a été généré avec succès",
    });
  };

  const handleDownloadInvoice = async (paymentId: number | string) => {
    try {
      await fastAPIClient.downloadPaymentInvoice(paymentId);
      toast({
        title: "Téléchargement lancé",
        description: "Votre facture est en cours de téléchargement.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de télécharger la facture.",
        variant: "destructive",
      });
    }
  };

  const recentPayments = paymentsData?.items || [];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
            <Euro className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {statsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
              <>
                <div className="text-2xl font-bold">€{stats?.total_revenue?.toLocaleString() || '0'}</div>
                <p className="text-xs text-muted-foreground">{stats?.revenue_change || "+0%"} vs mois dernier</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paiements ce mois</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            {statsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
              <>
                <div className="text-2xl font-bold">{stats?.monthly_count || '0'}</div>
                <p className="text-xs text-muted-foreground">+{stats?.weekly_count || '0'} cette semaine</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de réussite</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {statsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
              <>
                <div className="text-2xl font-bold">{stats?.success_rate || '0'}%</div>
                <p className="text-xs text-muted-foreground">{stats?.success_change || "+0%"} vs mois dernier</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paiements échoués</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            {statsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
              <>
                <div className="text-2xl font-bold">{stats?.failed_count || '0'}</div>
                <p className="text-xs text-muted-foreground">{stats?.failed_change || "-0%"} vs mois dernier</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Payments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex-1">
            <CardTitle>Paiements récents</CardTitle>
            <CardDescription>Historique des dernières transactions</CardDescription>
            <div className="mt-4 relative max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un utilisateur ou un cours..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleExportPayments} className="bg-pink-600 hover:bg-pink-700 ml-4">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Cours</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentsLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="mt-2 text-muted-foreground">Chargement des transactions...</p>
                  </TableCell>
                </TableRow>
              ) : recentPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    Aucun paiement trouvé
                  </TableCell>
                </TableRow>
              ) : (
                recentPayments.map((payment: any) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.user || payment.user_name}</TableCell>
                    <TableCell>{payment.course || payment.course_title}</TableCell>
                    <TableCell>{payment.amount ? `€${payment.amount}` : payment.amount_formatted}</TableCell>
                    <TableCell>{new Date(payment.date || payment.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${payment.status === 'Payé' || payment.status === 'succeeded'
                          ? 'bg-green-100 text-green-800'
                          : payment.status === 'En attente' || payment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                        {payment.status === 'succeeded' ? 'Payé' : payment.status === 'pending' ? 'En attente' : 'Échoué'}
                      </span>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        title="Détails"
                        onClick={() => toast({ title: "Infos", description: "Détails de la transaction Stripe." })}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        title="Facture"
                        onClick={() => handleDownloadInvoice(payment.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPayments;
