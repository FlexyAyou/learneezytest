
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Coins, Plus, Settings, Send, DollarSign, Users, TrendingUp, History, Euro, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

const AdminTokens = () => {
  const [tokenValue, setTokenValue] = useState(0.50);
  const [selectedUser, setSelectedUser] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');
  const [reason, setReason] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  // Données simulées
  const tokenStats = {
    totalDistributed: 125000,
    totalValue: 62500,
    activeUsers: 847,
    monthlyGrowth: 15.3
  };

  const recentTransactions = [
    {
      id: 1,
      user: 'Formation Plus',
      type: 'distribution',
      amount: 500,
      reason: 'Paiement espèces formation',
      date: '2024-08-10 14:30',
      status: 'completed'
    },
    {
      id: 2,
      user: 'TechFormation Pro',
      type: 'purchase',
      amount: 200,
      reason: 'Formation IA',
      date: '2024-08-10 12:15',
      status: 'completed'
    },
    {
      id: 3,
      user: 'Alice Martin',
      type: 'gift',
      amount: 50,
      reason: 'Bonus satisfaction client',
      date: '2024-08-10 09:45',
      status: 'completed'
    }
  ];

  const users = [
    { id: '1', name: 'Formation Plus', type: 'organisme', tokens: 1500 },
    { id: '2', name: 'TechFormation Pro', type: 'organisme', tokens: 800 },
    { id: '3', name: 'Alice Martin', type: 'student', tokens: 120 },
    { id: '4', name: 'Jean Dupont', type: 'trainer', tokens: 300 }
  ];

  const handleDistributeTokens = () => {
    if (!selectedUser || !tokenAmount || !reason) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Logique de distribution des tokens
    toast.success(`${tokenAmount} tokens distribués avec succès`);
    setSelectedUser('');
    setTokenAmount('');
    setReason('');
    setPaymentMethod('');
  };

  const handleUpdateTokenValue = () => {
    // Logique de mise à jour de la valeur des tokens
    toast.success(`Valeur du token mise à jour : ${tokenValue}€`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des tokens</h1>
          <p className="text-gray-600">Administration des tokens et crédits de la plateforme</p>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tokens distribués</p>
                <p className="text-2xl font-bold">{tokenStats.totalDistributed.toLocaleString()}</p>
              </div>
              <Coins className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valeur totale</p>
                <p className="text-2xl font-bold">{tokenStats.totalValue.toLocaleString()}€</p>
              </div>
              <Euro className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisateurs actifs</p>
                <p className="text-2xl font-bold">{tokenStats.activeUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Croissance mensuelle</p>
                <p className="text-2xl font-bold">+{tokenStats.monthlyGrowth}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="distribute" className="space-y-4">
        <TabsList>
          <TabsTrigger value="distribute">Distribution de tokens</TabsTrigger>
          <TabsTrigger value="pricing">Tarification</TabsTrigger>
          <TabsTrigger value="transactions">Historique</TabsTrigger>
          <TabsTrigger value="users">Soldes utilisateurs</TabsTrigger>
        </TabsList>

        {/* Distribution de tokens */}
        <TabsContent value="distribute">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Distribuer des tokens
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="user">Utilisateur / Organisation *</Label>
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un utilisateur" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({user.type}) - {user.tokens} tokens
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Nombre de tokens *</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Ex: 100"
                    value={tokenAmount}
                    onChange={(e) => setTokenAmount(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Motif *</Label>
                  <Textarea
                    id="reason"
                    placeholder="Ex: Paiement en espèces pour formation..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment">Mode de paiement (optionnel)</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Espèces</SelectItem>
                      <SelectItem value="check">Chèque</SelectItem>
                      <SelectItem value="transfer">Virement</SelectItem>
                      <SelectItem value="gift">Cadeau/Bonus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {tokenAmount && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Récapitulatif :</strong> {tokenAmount} tokens = {(parseFloat(tokenAmount) * tokenValue).toFixed(2)}€
                  </p>
                </div>
              )}

              <Button onClick={handleDistributeTokens} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Distribuer les tokens
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tarification */}
        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuration de la tarification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tokenValue">Valeur d'un token (€)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="tokenValue"
                      type="number"
                      step="0.01"
                      value={tokenValue}
                      onChange={(e) => setTokenValue(parseFloat(e.target.value))}
                      className="w-32"
                    />
                    <span className="text-sm text-gray-600">€ par token</span>
                  </div>
                </div>

                <Button onClick={handleUpdateTokenValue}>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Mettre à jour la tarification
                </Button>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Coûts des activités</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Achat de cours premium</span>
                    <Badge variant="outline">10-50 tokens</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Génération de certificat</span>
                    <Badge variant="outline">5 tokens</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Création de convention</span>
                    <Badge variant="outline">3 tokens</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Support premium</span>
                    <Badge variant="outline">2 tokens</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Historique des transactions */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Historique des transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <Input placeholder="Rechercher une transaction..." />
                </div>
                <Button variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </Button>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrer
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Motif</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.user}</TableCell>
                      <TableCell>
                        <Badge variant={
                          transaction.type === 'distribution' ? 'default' :
                          transaction.type === 'purchase' ? 'destructive' : 'secondary'
                        }>
                          {transaction.type === 'distribution' ? 'Distribution' :
                           transaction.type === 'purchase' ? 'Achat' : 'Cadeau'}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.amount} tokens</TableCell>
                      <TableCell>{transaction.reason}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-green-600">
                          Complété
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Soldes utilisateurs */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Soldes des utilisateurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Solde tokens</TableHead>
                    <TableHead>Valeur (€)</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {user.type === 'organisme' ? 'Organisation' :
                           user.type === 'student' ? 'Étudiant' : 'Formateur'}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.tokens} tokens</TableCell>
                      <TableCell>{(user.tokens * tokenValue).toFixed(2)}€</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Voir détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTokens;
