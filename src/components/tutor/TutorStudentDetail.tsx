
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Download, Edit, User, Mail, Phone, Calendar, BookOpen, MessageSquare } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  progress: number;
  lastActivity: string;
  status: 'active' | 'inactive' | 'completed';
  parentContact: string;
  notes: string;
}

interface TutorStudentDetailProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (student: Student) => void;
}

export const TutorStudentDetail = ({ student, isOpen, onClose, onEdit }: TutorStudentDetailProps) => {
  if (!student) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, label: 'Actif', color: 'text-green-600' },
      inactive: { variant: 'outline' as const, label: 'Inactif', color: 'text-yellow-600' },
      completed: { variant: 'secondary' as const, label: 'Terminé', color: 'text-blue-600' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status, color: 'text-gray-600' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleDownload = () => {
    const reportData = `Rapport d'étudiant: ${student.name}\nCours: ${student.course}\nProgrès: ${student.progress}%\nStatut: ${student.status}\nDernière activité: ${student.lastActivity}\nNotes: ${student.notes}`;
    const element = document.createElement('a');
    element.href = `data:text/plain;charset=utf-8,${encodeURIComponent(reportData)}`;
    element.download = `rapport-${student.name.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profil étudiant - {student.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-gray-700">Nom complet</label>
                  <p className="text-gray-900">{student.name}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Statut</label>
                  <div className="mt-1">{getStatusBadge(student.status)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-gray-700 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </label>
                  <p className="text-gray-900">{student.email}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Téléphone
                  </label>
                  <p className="text-gray-900">{student.phone}</p>
                </div>
              </div>

              <div>
                <label className="font-medium text-gray-700">Contact parent</label>
                <p className="text-gray-900">{student.parentContact}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Formation actuelle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="font-medium text-gray-700">Cours</label>
                <p className="text-gray-900 font-medium">{student.course}</p>
              </div>

              <div>
                <label className="font-medium text-gray-700">Progression</label>
                <div className="flex items-center space-x-3 mt-2">
                  <Progress value={student.progress} className="flex-1" />
                  <span className="text-sm font-medium">{student.progress}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Dernière activité
                  </label>
                  <p className="text-gray-900">{student.lastActivity}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Temps passé</label>
                  <p className="text-gray-900">24h 30min</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notes de suivi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900">{student.notes}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">15</div>
                  <p className="text-sm text-gray-600">Sessions terminées</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">8.5/10</div>
                  <p className="text-sm text-gray-600">Note moyenne</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">3</div>
                  <p className="text-sm text-gray-600">Certificats obtenus</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={() => onEdit(student)} className="flex-1">
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contacter parent
            </Button>
            <Button onClick={handleDownload} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Télécharger rapport
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
