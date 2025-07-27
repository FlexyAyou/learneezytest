import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { PenTool, Download, Filter, Calendar, Users, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { supabase } from '@/integrations/supabase/client';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Emargement {
  id: string;
  user_id: string;
  course_id: string;
  session_date: string;
  session_start_time: string;
  session_end_time: string;
  is_present: boolean;
  signature_data?: string;
  signature_timestamp?: string;
  ip_address?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface EmargementWithDetails extends Emargement {
  user?: {
    first_name: string;
    last_name: string;
    role: string;
  };
  course?: {
    title: string;
  };
}

export const AdminEmargements = () => {
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'present' | 'absent'>('all');

  // Données mockées
  const emargements: EmargementWithDetails[] = [
    {
      id: '1',
      user_id: '1',
      course_id: '1',
      session_date: '2024-01-20',
      session_start_time: '09:00',
      session_end_time: '12:00',
      is_present: true,
      signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANS...',
      signature_timestamp: '2024-01-20T09:05:00Z',
      ip_address: '192.168.1.100',
      notes: 'Présent à l\'heure',
      created_at: '2024-01-20T09:00:00Z',
      updated_at: '2024-01-20T09:05:00Z',
      user: { first_name: 'Marie', last_name: 'Dupont', role: 'student' },
      course: { title: 'Formation React Avancé' }
    },
    {
      id: '2',
      user_id: '2',
      course_id: '1',
      session_date: '2024-01-20',
      session_start_time: '09:00',
      session_end_time: '12:00',
      is_present: false,
      signature_timestamp: undefined,
      ip_address: undefined,
      notes: 'Absent justifié',
      created_at: '2024-01-20T09:00:00Z',
      updated_at: '2024-01-20T09:00:00Z',
      user: { first_name: 'Jean', last_name: 'Martin', role: 'student' },
      course: { title: 'Formation React Avancé' }
    },
    {
      id: '3',
      user_id: '3',
      course_id: '2',
      session_date: '2024-01-21',
      session_start_time: '14:00',
      session_end_time: '17:00',
      is_present: true,
      signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANS...',
      signature_timestamp: '2024-01-21T14:02:00Z',
      ip_address: '192.168.1.101',
      notes: '',
      created_at: '2024-01-21T14:00:00Z',
      updated_at: '2024-01-21T14:02:00Z',
      user: { first_name: 'Sophie', last_name: 'Bernard', role: 'instructor' },
      course: { title: 'Gestion de Projet Agile' }
    }
  ];

  const courses = [
    { id: '1', title: 'Formation React Avancé' },
    { id: '2', title: 'Gestion de Projet Agile' },
    { id: '3', title: 'Marketing Digital' }
  ];

  const isLoading = false;

  const exportEmargements = () => {
    // Simulation d'export - en réalité, cela génèrerait un fichier Excel/PDF
    const filteredEmargements = getFilteredEmargements();
    
    const csvContent = [
      ['Date', 'Heure début', 'Heure fin', 'Formation', 'Utilisateur', 'Statut', 'Signature', 'IP'],
      ...filteredEmargements.map(emg => [
        emg.session_date,
        emg.session_start_time,
        emg.session_end_time,
        emg.course?.title || 'N/A',
        `${emg.user?.first_name} ${emg.user?.last_name}`,
        emg.is_present ? 'Présent' : 'Absent',
        emg.signature_timestamp ? 'Signé' : 'Non signé',
        emg.ip_address || 'N/A'
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
      description: "Le fichier des émargements a été téléchargé"
    });
  };

  const getFilteredEmargements = () => {
    return emargements.filter(emg => {
      if (filterStatus === 'present') return emg.is_present;
      if (filterStatus === 'absent') return !emg.is_present;
      return true;
    });
  };

  const getStats = () => {
    const filtered = getFilteredEmargements();
    const present = filtered.filter(emg => emg.is_present).length;
    const absent = filtered.filter(emg => !emg.is_present).length;
    const signed = filtered.filter(emg => emg.signature_timestamp).length;

    return { total: filtered.length, present, absent, signed };
  };

  const stats = getStats();

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
        <Button 
          onClick={exportEmargements}
          className="flex items-center space-x-2"
        >
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
                <p className="text-sm text-muted-foreground">Total</p>
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
                <p className="text-sm text-muted-foreground">Présents</p>
                <p className="text-2xl font-bold text-green-600">{stats.present}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Absents</p>
                <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <PenTool className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Signés</p>
                <p className="text-2xl font-bold text-blue-600">{stats.signed}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Formation</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les formations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les formations</SelectItem>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div>
              <Label>Statut</Label>
              <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="present">Présents</SelectItem>
                  <SelectItem value="absent">Absents</SelectItem>
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
            <div className="text-center py-8">Chargement...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Horaires</TableHead>
                  <TableHead>Formation</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Présence</TableHead>
                  <TableHead>Signature</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredEmargements().map((emargement) => (
                  <TableRow key={emargement.id}>
                    <TableCell>
                      {new Date(emargement.session_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{emargement.session_start_time}</div>
                        <div className="text-muted-foreground">→ {emargement.session_end_time}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {emargement.course?.title || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {emargement.user?.first_name} {emargement.user?.last_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {emargement.user?.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={emargement.is_present ? "default" : "destructive"}>
                        {emargement.is_present ? 'Présent' : 'Absent'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {emargement.signature_timestamp ? (
                        <Badge variant="secondary">
                          <PenTool className="h-3 w-3 mr-1" />
                          Signé
                        </Badge>
                      ) : (
                        <Badge variant="outline">Non signé</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm font-mono">
                      {emargement.ip_address || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {getFilteredEmargements().length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
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

export default AdminEmargements;