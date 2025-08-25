
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { 
  Download, 
  FileText, 
  Calendar,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  Package
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const TutorInvoicesSection = () => {
  const { toast } = useToast();
  const [invoices] = useState([
    {
      id: 'INV-2024-001',
      date: '2024-01-15',
      amount: '100,00 €',
      status: 'paid',
      description: 'Abonnement Premium - Janvier 2024',
      downloadUrl: '/invoices/INV-2024-001.pdf'
    },
    {
      id: 'INV-2023-012',
      date: '2023-12-15',
      amount: '100,00 €',
      status: 'paid',
      description: 'Abonnement Premium - Décembre 2023',
      downloadUrl: '/invoices/INV-2023-012.pdf'
    },
    {
      id: 'INV-2023-011',
      date: '2023-11-15',
      amount: '100,00 €',
      status: 'paid',
      description: 'Abonnement Premium - Novembre 2023',
      downloadUrl: '/invoices/INV-2023-011.pdf'
    },
    {
      id: 'INV-2023-010',
      date: '2023-10-15',
      amount: '100,00 €',
      status: 'pending',
      description: 'Abonnement Premium - Octobre 2023',
      downloadUrl: '/invoices/INV-2023-010.pdf'
    }
  ]);

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: "Téléchargement en cours",
      description: `Téléchargement de la facture ${invoiceId}...`,
    });
    // Simulate download
    setTimeout(() => {
      toast({
        title: "Téléchargement terminé",
        description: `Facture ${invoiceId} téléchargée avec succès.`,
      });
    }, 1500);
  };

  const handleBulkDownload = () => {
    toast({
      title: "Téléchargement groupé",
      description: "Préparation de l'archive des factures...",
    });
    setTimeout(() => {
      toast({
        title: "Archive créée",
        description: "Toutes vos factures ont été téléchargées dans une archive ZIP.",
      });
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="default" className="bg-green-100 text-green-800">Payée</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">En attente</Badge>;
      case 'failed':
        return <Badge variant="destructive">Échec</Badge>;
      default:
        return <Badge variant="outline">Inconnue</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Factures et paiements</h3>
          <p className="text-sm text-gray-600">Gérez et téléchargez vos factures</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
          <Button onClick={handleBulkDownload} size="sm">
            <Package className="h-4 w-4 mr-2" />
            Tout télécharger
          </Button>
        </div>
      </div>

      {/* Invoice Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total payé cette année</p>
                <p className="text-2xl font-bold text-green-600">1 200,00 €</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Factures en attente</p>
                <p className="text-2xl font-bold text-orange-600">1</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Prochaine facturation</p>
                <p className="text-lg font-semibold">15 février 2024</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Historique des factures
          </CardTitle>
          <CardDescription>
            Consultez et téléchargez vos factures
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Facture</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {getStatusIcon(invoice.status)}
                      <span className="ml-2">{invoice.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={invoice.description}>
                      {invoice.description}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{invoice.amount}</TableCell>
                  <TableCell>
                    {getStatusBadge(invoice.status)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadInvoice(invoice.id)}
                      disabled={invoice.status !== 'paid'}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Méthode de paiement</CardTitle>
          <CardDescription>Votre mode de paiement actuel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-xs text-white font-bold">VISA</span>
              </div>
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-600">Expire 12/25</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Modifier
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
