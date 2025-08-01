
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Eye, Building, MapPin, Phone, Mail, FileText, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminOrganisations = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for organisations
  const organisations = [
    {
      id: '1',
      name: 'Centre de Formation Digital',
      address: '123 Rue de la Formation, 75001 Paris',
      phone: '01 23 45 67 89',
      email: 'contact@cfdigital.fr',
      siret: '12345678901234',
      numeroDeclaration: '11-75-12345-75',
      qualiopiCertified: true,
      usersCount: 145,
      createdAt: '2023-01-15'
    },
    {
      id: '2',
      name: 'Institut TechnoPlus',
      address: '456 Avenue des Sciences, 69002 Lyon',
      phone: '04 78 90 12 34',
      email: 'info@technoplus.fr',
      siret: '98765432109876',
      numeroDeclaration: '84-69-98765-69',
      qualiopiCertified: false,
      usersCount: 89,
      createdAt: '2023-03-22'
    },
    {
      id: '3',
      name: 'Formation Pro Marseille',
      address: '789 Boulevard Maritime, 13001 Marseille',
      phone: '04 91 23 45 67',
      email: 'contact@formpro-marseille.fr',
      siret: '11223344556677',
      numeroDeclaration: '93-13-11223-13',
      qualiopiCertified: true,
      usersCount: 67,
      createdAt: '2023-06-10'
    }
  ];

  const filteredOrganisations = organisations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.siret.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Organismes de Formation</h1>
          <p className="text-gray-600">Gérer les organismes de formation partenaires</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un organisme
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total organismes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organisations.length}</div>
            <p className="text-xs text-muted-foreground">+2 ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Certifiés Qualiopi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {organisations.filter(o => o.qualiopiCertified).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((organisations.filter(o => o.qualiopiCertified).length / organisations.length) * 100)}% du total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs totaux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {organisations.reduce((sum, org) => sum + org.usersCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Tous organismes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Moyenne par organisme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(organisations.reduce((sum, org) => sum + org.usersCount, 0) / organisations.length)}
            </div>
            <p className="text-xs text-muted-foreground">Utilisateurs</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Liste des organismes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom, email ou SIRET..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organisme</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>SIRET</TableHead>
                <TableHead>N° Déclaration</TableHead>
                <TableHead>Qualiopi</TableHead>
                <TableHead>Utilisateurs</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrganisations.map((org) => (
                <TableRow key={org.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{org.name}</div>
                      <div className="text-sm text-gray-600 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {org.address}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {org.phone}
                      </div>
                      <div className="text-sm flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {org.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{org.siret}</TableCell>
                  <TableCell className="font-mono text-sm">{org.numeroDeclaration}</TableCell>
                  <TableCell>
                    {org.qualiopiCertified ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Certifié
                      </Badge>
                    ) : (
                      <Badge variant="outline">Non certifié</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="font-medium">{org.usersCount}</div>
                      <div className="text-xs text-gray-500">utilisateurs</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" title="Voir les détails">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" title="Modifier">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" title="Documents">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
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

export default AdminOrganisations;
