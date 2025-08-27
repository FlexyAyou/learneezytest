import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  BookOpen,
  Download,
  FileText,
  Package
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StudentOffers } from './StudentOffers';
import { Button } from '@/components/ui/button';

export const StudentSubscription = () => {
  const { toast } = useToast();
  const [subscription] = useState({
    plan: 'Étudiant Premium',
    status: 'active',
    coursesTotal: 50,
    coursesUsed: 12,
    renewalDate: '2024-02-15',
    price: '29€',
    period: 'mensuel'
  });

  const [invoices] = useState([
    {
      id: 'INV-2024-001',
      date: '2024-01-15',
      amount: '29,00 €',
      status: 'paid',
      description: 'Abonnement Étudiant Premium - Janvier 2024',
      downloadUrl: '/invoices/INV-2024-001.pdf'
    },
    {
      id: 'INV-2023-012',
      date: '2023-12-15',
      amount: '29,00 €',
      status: 'paid',
      description: 'Abonnement Étudiant Premium - Décembre 2023',
      downloadUrl: '/invoices/INV-2023-012.pdf'
    },
    {
      id: 'INV-2023-011',
      date: '2023-11-15',
      amount: '29,00 €',
      status: 'paid',
      description: 'Abonnement Étudiant Premium - Novembre 2023',
      downloadUrl: '/invoices/INV-2023-011.pdf'
    },
    {
      id: 'INV-2023-010',
      date: '2023-10-15',
      amount: '29,00 €',
      status: 'pending',
      description: 'Abonnement Étudiant Premium - Octobre 2023',
      downloadUrl: '/invoices/INV-2023-010.pdf'
    }
  ]);

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: "Téléchargement en cours",
      description: `Téléchargement de la facture ${invoiceId}...`,
    });
    setTimeout(() => {
      toast({
        title: "Téléchargement terminé",
        description: `Facture ${invoiceId} téléchargée avec succès.`,
      });
    }, 1500);
  };

  const handleDownloadAllInvoices = () => {
    toast({
      title: "Téléchargement groupé",
      description: "Préparation de l'archive de toutes vos factures...",
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

  const coursesUsagePercentage = (subscription.coursesUsed / subscription.coursesTotal) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Abonnements</h1>
        <p className="text-gray-600">Gérez votre abonnement et consultez votre utilisation</p>
      </div>

      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Abonnement actuel
              </CardTitle>
              <CardDescription>Plan {subscription.plan}</CardDescription>
            </div>
            <Badge variant={subscription.status === 'active' ? 'default' : 'destructive'}>
              {subscription.status === 'active' ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Actif
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Inactif
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{subscription.price}</div>
              <p className="text-sm text-gray-600">par mois</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{subscription.coursesTotal - subscription.coursesUsed}</div>
              <p className="text-sm text-gray-600">Tokens restants</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{subscription.renewalDate}</div>
              <p className="text-sm text-gray-600">renouvellement</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Tokens utilisés</span>
              <span className="text-sm text-gray-600">
                {subscription.coursesUsed}/{subscription.coursesTotal}
              </span>
            </div>
            <Progress value={coursesUsagePercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Student Offers Section */}
      <StudentOffers 
        currentPlan={subscription.plan} 
        currentCredits={subscription.coursesTotal - subscription.coursesUsed}
      />

      {/* Invoices Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Factures et paiements
              </CardTitle>
              <CardDescription>
                Téléchargez vos factures d'abonnement
              </CardDescription>
            </div>
            <Button onClick={handleDownloadAllInvoices} size="sm">
              <Package className="h-4 w-4 mr-2" />
              Télécharger toutes les factures
            </Button>
          </div>
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

      {/* Course History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Historique des cours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: '2024-01-20', course: 'React pour Débutants', status: 'Terminé', progress: 100 },
              { date: '2024-01-18', course: 'JavaScript Avancé', status: 'En cours', progress: 75 },
              { date: '2024-01-15', course: 'CSS Grid & Flexbox', status: 'En cours', progress: 45 },
              { date: '2024-01-12', course: 'Node.js Fondamentaux', status: 'Terminé', progress: 100 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${item.status === 'Terminé' ? 'bg-green-100' : 'bg-blue-100'}`}>
                    <BookOpen className={`h-4 w-4 ${item.status === 'Terminé' ? 'text-green-600' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <p className="font-medium">{item.course}</p>
                    <p className="text-sm text-gray-600">{item.date} • {item.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{item.progress}%</span>
                    <Badge variant={item.status === 'Terminé' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
