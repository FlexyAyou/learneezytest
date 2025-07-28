
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Eye, Edit, MessageSquare, Download, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TutorStudentDetail } from './TutorStudentDetail';
import { TutorStudentEdit } from './TutorStudentEdit';

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

export const TutorStudentTrackingActions = () => {
  const { toast } = useToast();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'Marie Dupont',
      email: 'marie.dupont@email.com',
      phone: '06 12 34 56 78',
      course: 'React Avancé',
      progress: 78,
      lastActivity: '2024-01-20',
      status: 'active',
      parentContact: 'parent.dupont@email.com',
      notes: 'Très motivée, besoin d\'aide sur les hooks'
    },
    {
      id: '2',
      name: 'Jean Martin',
      email: 'jean.martin@email.com',
      phone: '06 87 65 43 21',
      course: 'JavaScript ES6',
      progress: 45,
      lastActivity: '2024-01-18',
      status: 'inactive',
      parentContact: 'parent.martin@email.com',
      notes: 'Difficultés avec les promesses'
    },
    {
      id: '3',
      name: 'Sophie Bernard',
      email: 'sophie.bernard@email.com',
      phone: '06 11 22 33 44',
      course: 'TypeScript',
      progress: 100,
      lastActivity: '2024-01-22',
      status: 'completed',
      parentContact: 'parent.bernard@email.com',
      notes: 'Formation terminée avec succès'
    }
  ]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, label: 'Actif' },
      inactive: { variant: 'outline' as const, label: 'Inactif' },
      completed: { variant: 'secondary' as const, label: 'Terminé' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredStudents = students.filter(student => 
    filterStatus === 'all' || student.status === filterStatus
  );

  const handleView = (student: Student) => {
    setSelectedStudent(student);
    setShowDetail(true);
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setShowEdit(true);
  };

  const handleContactParent = (student: Student) => {
    toast({
      title: "Email envoyé",
      description: `Un email a été envoyé au parent de ${student.name}.`,
    });
  };

  const handleCallStudent = (student: Student) => {
    toast({
      title: "Appel initié",
      description: `Appel vers ${student.name} au ${student.phone}.`,
    });
  };

  const handleDownloadReport = () => {
    const reportData = filteredStudents.map(s => 
      `${s.name}\t${s.course}\t${s.progress}%\t${s.status}\t${s.lastActivity}`
    ).join('\n');
    
    const header = 'Nom\tCours\tProgrès\tStatut\tDernière activité\n';
    const csvContent = header + reportData;
    
    const element = document.createElement('a');
    element.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;
    element.download = 'rapport-etudiants.csv';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Rapport téléchargé",
      description: "Le rapport des étudiants a été téléchargé avec succès.",
    });
  };

  const handleSave = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => 
      s.id === updatedStudent.id ? updatedStudent : s
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Suivi des Étudiants</h2>
          <p className="text-gray-600">Accompagnez vos étudiants dans leur parcours</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="active">Actifs</SelectItem>
              <SelectItem value="inactive">Inactifs</SelectItem>
              <SelectItem value="completed">Terminés</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleDownloadReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Télécharger rapport
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{students.filter(s => s.status === 'active').length}</div>
              <p className="text-sm text-gray-600">Étudiants actifs</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{students.filter(s => s.status === 'completed').length}</div>
              <p className="text-sm text-gray-600">Formations terminées</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(students.reduce((sum, s) => sum + s.progress, 0) / students.length)}%
              </div>
              <p className="text-sm text-gray-600">Progression moyenne</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Liste des étudiants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Étudiant</TableHead>
                <TableHead>Cours</TableHead>
                <TableHead>Progression</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière activité</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-gray-600">{student.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{student.course}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{student.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(student.status)}</TableCell>
                  <TableCell>{student.lastActivity}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleView(student)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(student)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleContactParent(student)}>
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleCallStudent(student)}>
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <TutorStudentDetail
        student={selectedStudent}
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        onEdit={handleEdit}
      />

      <TutorStudentEdit
        student={selectedStudent}
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        onSave={handleSave}
      />
    </div>
  );
};
