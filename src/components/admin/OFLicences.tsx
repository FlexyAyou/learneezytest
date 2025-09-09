
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Key, 
  Eye, 
  Edit, 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  AlertTriangle,
  TrendingUp,
  Users,
  Package,
  Download,
  RefreshCw
} from 'lucide-react';
import { OFLicenceDetail } from './OFLicenceDetail';
import { OFLicenceEdit } from './OFLicenceEdit';
import { toast } from 'sonner';

interface Licence {
  id: string;
  type: string;
  description: string;
  nombre: number;
  utilises: number;
  expires: string;
  status: string;
  cost: number;
  currency: string;
  provider: string;
  category: 'communication' | 'productivity' | 'development' | 'design' | 'analytics';
  lastUsed: string;
  assignedUsers: string[];
}

export const OFLicences = () => {
  const [selectedLicence, setSelectedLicence] = useState<Licence | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const [licences, setLicences] = useState<Licence[]>([
    { 
      id: '1', 
      type: 'Zoom Pro', 
      description: 'Visioconférence professionnelle avec enregistrement',
      nombre: 50, 
      utilises: 35, 
      expires: '2024-06-30', 
      status: 'active',
      cost: 149.90,
      currency: 'EUR',
      provider: 'Zoom Video Communications',
      category: 'communication',
      lastUsed: '2024-01-15',
      assignedUsers: ['user1', 'user2', 'user3']
    },
    { 
      id: '2', 
      type: 'Microsoft 365 Business', 
      description: 'Suite bureautique complète avec Teams et SharePoint',
      nombre: 100, 
      utilises: 78, 
      expires: '2024-12-31', 
      status: 'active',
      cost: 1200.00,
      currency: 'EUR',
      provider: 'Microsoft Corporation',
      category: 'productivity',
      lastUsed: '2024-01-16',
      assignedUsers: ['user1', 'user4', 'user5']
    },
    { 
      id: '3', 
      type: 'Adobe Creative Cloud', 
      description: 'Suite créative complète pour le design et le montage',
      nombre: 25, 
      utilises: 25, 
      expires: '2024-03-15', 
      status: 'expired',
      cost: 599.88,
      currency: 'EUR',
      provider: 'Adobe Inc.',
      category: 'design',
      lastUsed: '2024-01-10',
      assignedUsers: ['user6', 'user7']
    },
    { 
      id: '4', 
      type: 'JetBrains All Products', 
      description: 'Environnements de développement intégrés professionnels',
      nombre: 30, 
      utilises: 22, 
      expires: '2024-09-30', 
      status: 'active',
      cost: 879.00,
      currency: 'EUR',
      provider: 'JetBrains s.r.o.',
      category: 'development',
      lastUsed: '2024-01-14',
      assignedUsers: ['user8', 'user9']
    },
    { 
      id: '5', 
      type: 'Google Analytics 360', 
      description: 'Plateforme d\'analyse web avancée',
      nombre: 5, 
      utilises: 3, 
      expires: '2024-08-31', 
      status: 'active',
      cost: 1500.00,
      currency: 'EUR',
      provider: 'Google LLC',
      category: 'analytics',
      lastUsed: '2024-01-13',
      assignedUsers: ['user10']
    },
    { 
      id: '6', 
      type: 'Slack Business+', 
      description: 'Plateforme de collaboration et communication d\'équipe',
      nombre: 80, 
      utilises: 65, 
      expires: '2024-11-15', 
      status: 'active',
      cost: 960.00,
      currency: 'EUR',
      provider: 'Slack Technologies',
      category: 'communication',
      lastUsed: '2024-01-16',
      assignedUsers: ['user11', 'user12']
    },
  ]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, label: 'Actif', color: 'bg-green-500' },
      expired: { variant: 'destructive' as const, label: 'Expiré', color: 'bg-red-500' },
      expiring: { variant: 'outline' as const, label: 'Expire bientôt', color: 'bg-orange-500' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status, color: 'bg-gray-500' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      communication: { label: 'Communication', color: 'bg-blue-100 text-blue-800' },
      productivity: { label: 'Productivité', color: 'bg-green-100 text-green-800' },
      development: { label: 'Développement', color: 'bg-purple-100 text-purple-800' },
      design: { label: 'Design', color: 'bg-pink-100 text-pink-800' },
      analytics: { label: 'Analytics', color: 'bg-orange-100 text-orange-800' },
    };
    
    const config = categoryConfig[category as keyof typeof categoryConfig] || { label: category, color: 'bg-gray-100 text-gray-800' };
    return <Badge variant="secondary" className={config.color}>{config.label}</Badge>;
  };

  const getUsagePercentage = (utilises: number, total: number) => {
    return Math.round((utilises / total) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 75) return "text-orange-600";
    return "text-green-600";
  };

  const filteredLicences = licences.filter(licence => {
    const matchesSearch = licence.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          licence.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || licence.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || licence.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalLicences = licences.reduce((sum, licence) => sum + licence.nombre, 0);
  const totalUtilisees = licences.reduce((sum, licence) => sum + licence.utilises, 0);
  const totalCost = licences.reduce((sum, licence) => sum + licence.cost, 0);
  const expiringSoon = licences.filter(licence => {
    const expiryDate = new Date(licence.expires);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  }).length;

  const handleView = (licence: Licence) => {
    setSelectedLicence(licence);
    setShowDetail(true);
  };

  const handleEdit = (licence: Licence) => {
    setSelectedLicence(licence);
    setShowEdit(true);
  };

  const handleSave = (updatedLicence: Licence) => {
    setLicences(prev => prev.map(l => l.id === updatedLicence.id ? updatedLicence : l));
    toast.success('Licence mise à jour avec succès !');
  };

  const handleRenewLicense = (licenceId: string) => {
    toast.success('Demande de renouvellement envoyée !');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des licences</h1>
          <p className="text-gray-600">Suivi et gestion des licences logicielles et services</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle licence
          </Button>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total licences</p>
                <p className="text-2xl font-bold text-blue-600">{totalLicences}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisées</p>
                <p className="text-2xl font-bold text-green-600">{totalUtilisees}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Coût mensuel</p>
                <p className="text-2xl font-bold text-purple-600">{totalCost.toLocaleString()}€</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expirent bientôt</p>
                <p className="text-2xl font-bold text-orange-600">{expiringSoon}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtres et Recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher une licence..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="expired">Expiré</SelectItem>
                <SelectItem value="expiring">Expire bientôt</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="communication">Communication</SelectItem>
                <SelectItem value="productivity">Productivité</SelectItem>
                <SelectItem value="development">Développement</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="analytics">Analytics</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des licences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="h-5 w-5 mr-2" />
            Licences ({filteredLicences.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLicences.map((licence) => {
              const usagePercentage = getUsagePercentage(licence.utilises, licence.nombre);
              const remaining = licence.nombre - licence.utilises;
              
              return (
                <div key={licence.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{licence.type}</h3>
                        {getCategoryBadge(licence.category)}
                        {getStatusBadge(licence.status)}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{licence.description}</p>
                      <p className="text-xs text-gray-500">Fournisseur: {licence.provider}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-lg">{licence.cost}€</p>
                      <p className="text-xs text-gray-500">par mois</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Utilisation</span>
                        <span className={`text-sm font-medium ${getUsageColor(usagePercentage)}`}>
                          {usagePercentage}%
                        </span>
                      </div>
                      <Progress value={usagePercentage} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">
                        {licence.utilises} utilisées sur {licence.nombre} ({remaining} disponibles)
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Expiration</p>
                        <p className="text-xs text-gray-600">{licence.expires}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Utilisateurs assignés</p>
                        <p className="text-xs text-gray-600">{licence.assignedUsers.length} personnes</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">
                      Dernière utilisation: {licence.lastUsed}
                    </p>
                    
                    <div className="flex space-x-2">
                      {licence.status === 'expired' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRenewLicense(licence.id)}
                          className="text-orange-600 border-orange-300 hover:bg-orange-50"
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Renouveler
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => handleView(licence)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(licence)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Éditer
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <OFLicenceDetail
        licence={selectedLicence}
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        onEdit={handleEdit}
      />

      <OFLicenceEdit
        licence={selectedLicence}
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        onSave={handleSave}
      />
    </div>
  );
};
