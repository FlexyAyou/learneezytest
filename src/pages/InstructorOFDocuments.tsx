
import React, { useState } from 'react';
import { FileText, Upload, Download, Eye, Edit, Trash2, Plus, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { DashboardSidebar } from '@/components/DashboardSidebar';

const InstructorOFDocuments = () => {
  const navigate = useNavigate();
  const [documents] = useState([
    {
      id: '1',
      name: 'Programme de formation React',
      type: 'Programme',
      status: 'Validé',
      lastModified: '2024-01-20',
      size: '2.3 MB',
      category: 'Formation'
    },
    {
      id: '2',
      name: 'Feuille de présence - Session 1',
      type: 'Feuille de présence',
      status: 'En cours',
      lastModified: '2024-01-19',
      size: '1.1 MB',
      category: 'Suivi'
    },
    {
      id: '3',
      name: 'Évaluation à chaud - JavaScript',
      type: 'Évaluation',
      status: 'Brouillon',
      lastModified: '2024-01-18',
      size: '856 KB',
      category: 'Évaluation'
    }
  ]);

  const sidebarItems = [
    { title: "Tableau de bord", href: "/dashboard/instructeur", icon: FileText },
    { title: "Documents OF", href: "/dashboard/instructeur/of-documents", icon: FileText, isActive: true }
  ];

  const userInfo = {
    name: "Dr. Marie Dubois",
    email: "marie.dubois@Learneezy.com"
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Validé':
        return <Badge className="bg-green-500">Validé</Badge>;
      case 'En cours':
        return <Badge variant="secondary">En cours</Badge>;
      case 'Brouillon':
        return <Badge variant="outline">Brouillon</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="fixed left-0 top-0 h-full z-30">
        <DashboardSidebar
          title="Espace Instructeur"
          subtitle="Documents OF"
          items={sidebarItems}
          userInfo={userInfo}
        />
      </div>
      
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Documents OF</h1>
                <p className="text-gray-600">Gérez vos documents d'organisme de formation</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Importer
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau document
                </Button>
              </div>
            </div>

            {/* Filtres */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Input
                  placeholder="Rechercher un document..."
                  className="max-w-md"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Tous
                </Button>
                <Button variant="outline" size="sm">Formation</Button>
                <Button variant="outline" size="sm">Suivi</Button>
                <Button variant="outline" size="sm">Évaluation</Button>
              </div>
            </div>

            {/* Liste des documents */}
            <div className="grid grid-cols-1 gap-4">
              {documents.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                            <span>{doc.type}</span>
                            <span>•</span>
                            <span>{doc.size}</span>
                            <span>•</span>
                            <span>Modifié le {doc.lastModified}</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            {getStatusBadge(doc.status)}
                            <Badge variant="outline">{doc.category}</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InstructorOFDocuments;
