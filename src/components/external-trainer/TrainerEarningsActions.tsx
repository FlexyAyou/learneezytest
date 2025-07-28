
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Download, TrendingUp, Calendar, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Earning {
  id: string;
  date: string;
  course: string;
  student: string;
  amount: number;
  commission: number;
  net: number;
  status: 'paid' | 'pending' | 'processing';
}

export const TrainerEarningsActions = () => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [earnings, setEarnings] = useState<Earning[]>([
    {
      id: '1',
      date: '2024-01-15',
      course: 'React Avancé',
      student: 'Marie Dupont',
      amount: 80,
      commission: 8,
      net: 72,
      status: 'paid'
    },
    {
      id: '2',
      date: '2024-01-18',
      course: 'JavaScript ES6',
      student: 'Jean Martin',
      amount: 60,
      commission: 6,
      net: 54,
      status: 'processing'
    },
    {
      id: '3',
      date: '2024-01-20',
      course: 'TypeScript',
      student: 'Sophie Bernard',
      amount: 120,
      commission: 12,
      net: 108,
      status: 'pending'
    },
  ]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { variant: 'default' as const, label: 'Payé' },
      pending: { variant: 'outline' as const, label: 'En attente' },
      processing: { variant: 'secondary' as const, label: 'En traitement' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleDownloadStatement = () => {
    const statementData = earnings.map(e => 
      `${e.date}\t${e.course}\t${e.student}\t${e.amount}€\t${e.commission}€\t${e.net}€\t${e.status}`
    ).join('\n');
    
    const header = 'Date\tCours\tÉtudiant\tMontant\tCommission\tNet\tStatut\n';
    const csvContent = header + statementData;
    
    const element = document.createElement('a');
    element.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;
    element.download = `relevé-gains-${selectedPeriod}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Relevé téléchargé",
      description: "Votre relevé de gains a été téléchargé avec succès.",
    });
  };

  const handleDownloadInvoice = (earning: Earning) => {
    const invoiceData = `
Facture #${earning.id}
Date: ${earning.date}
Cours: ${earning.course}
Étudiant: ${earning.student}
Montant: ${earning.amount}€
Commission: ${earning.commission}€
Net à payer: ${earning.net}€
    `;
    
    const element = document.createElement('a');
    element.href = `data:text/plain;charset=utf-8,${encodeURIComponent(invoiceData)}`;
    element.download = `facture-${earning.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Facture téléchargée",
      description: "La facture a été téléchargée avec succès.",
    });
  };

  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);
  const totalCommission = earnings.reduce((sum, e) => sum + e.commission, 0);
  const totalNet = earnings.reduce((sum, e) => sum + e.net, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mes Gains</h2>
          <p className="text-gray-600">Suivez vos revenus et téléchargez vos relevés</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleDownloadStatement}>
            <Download className="h-4 w-4 mr-2" />
            Télécharger relevé
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{totalEarnings}€</p>
                <p className="text-muted-foreground text-sm">Total brut</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{totalNet}€</p>
                <p className="text-muted-foreground text-sm">Total net</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{earnings.length}</p>
                <p className="text-muted-foreground text-sm">Transactions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Historique des gains
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Cours</TableHead>
                <TableHead>Étudiant</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Net</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {earnings.map((earning) => (
                <TableRow key={earning.id}>
                  <TableCell>{earning.date}</TableCell>
                  <TableCell className="font-medium">{earning.course}</TableCell>
                  <TableCell>{earning.student}</TableCell>
                  <TableCell>{earning.amount}€</TableCell>
                  <TableCell>{earning.commission}€</TableCell>
                  <TableCell className="font-medium">{earning.net}€</TableCell>
                  <TableCell>{getStatusBadge(earning.status)}</TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDownloadInvoice(earning)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
