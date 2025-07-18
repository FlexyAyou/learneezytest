import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, Mail, Award, Ban, Eye, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

const ManageStudents = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');

  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Marie Dubois',
      email: 'marie.dubois@email.com',
      course: 'React pour Débutants',
      progress: 85,
      lastActivity: '2 heures',
      status: 'active',
      joinDate: '15 Mars 2024',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b78bd5e0?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Pierre Martin',
      email: 'pierre.martin@email.com',
      course: 'JavaScript Avancé',
      progress: 92,
      lastActivity: '1 jour',
      status: 'active',
      joinDate: '20 Mars 2024',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Sophie Laurent',
      email: 'sophie.laurent@email.com',
      course: 'React pour Débutants',
      progress: 45,
      lastActivity: '3 jours',
      status: 'inactive',
      joinDate: '10 Mars 2024',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: 4,
      name: 'Thomas Rousseau',
      email: 'thomas.rousseau@email.com',
      course: 'JavaScript Avancé',
      progress: 100,
      lastActivity: '5 heures',
      status: 'completed',
      joinDate: '8 Mars 2024',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face'
    }
  ]);

  const courses = ['React pour Débutants', 'JavaScript Avancé', 'Vue.js', 'Node.js'];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === 'all' || student.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  const handleSendMessage = (studentId: number, studentName: string) => {
    toast({
      title: "Message",
      description: `Ouverture de la messagerie avec ${studentName}`,
    });
    navigate('/dashboard/instructeur/messagerie', { state: { studentId, studentName } });
  };

  const handleViewProgress = (studentId: number, studentName: string) => {
    navigate(`/dashboard/instructeur/student-progress/${studentId}`);
  };

  const handleAwardCertificate = (studentId: number, studentName: string) => {
    toast({
      title: "Certificat",
      description: `Certificat délivré à ${studentName}`,
    });
  };

  const handleBlockStudent = (studentId: number, studentName: string) => {
    setStudents(students.map(student => 
      student.id === studentId 
        ? { ...student, status: student.status === 'blocked' ? 'active' : 'blocked' }
        : student
    ));
    
    const student = students.find(s => s.id === studentId);
    const newStatus = student?.status === 'blocked' ? 'débloqué' : 'bloqué';
    
    toast({
      title: `Étudiant ${newStatus}`,
      description: `${studentName} a été ${newStatus} avec succès`,
      variant: newStatus === 'bloqué' ? "destructive" : "default"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      case 'completed': return 'Terminé';
      case 'blocked': return 'Bloqué';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard/instructeur')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des étudiants</h1>
              <p className="text-gray-600">Suivez vos étudiants et leur progression</p>
            </div>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter la liste
          </Button>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-gray-900">127</div>
              <p className="text-sm text-gray-600">Total étudiants</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">89</div>
              <p className="text-sm text-gray-600">Étudiants actifs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">34</div>
              <p className="text-sm text-gray-600">Cours terminés</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-orange-600">78%</div>
              <p className="text-sm text-gray-600">Taux de réussite</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et recherche */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher un étudiant..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  <option value="all">Tous les cours</option>
                  {courses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtres avancés
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des étudiants */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des étudiants ({filteredStudents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Étudiant</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Cours</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Progression</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Statut</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Dernière activité</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-600">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-900">{student.course}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2 max-w-[100px]">
                            <div 
                              className="bg-pink-500 h-2 rounded-full" 
                              style={{ width: `${student.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{student.progress}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                          {getStatusText(student.status)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">il y a {student.lastActivity}</td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendMessage(student.id, student.name)}
                            title="Envoyer un message"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewProgress(student.id, student.name)}
                            title="Voir la progression"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {student.status === 'completed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAwardCertificate(student.id, student.name)}
                              title="Délivrer un certificat"
                            >
                              <Award className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleBlockStudent(student.id, student.name)}
                            title={student.status === 'blocked' ? "Débloquer l'étudiant" : "Bloquer l'étudiant"}
                            className={student.status === 'blocked' ? 'border-green-300 hover:bg-green-50' : 'border-red-300 hover:bg-red-50'}
                          >
                            <Ban className={`h-4 w-4 ${student.status === 'blocked' ? 'text-green-600' : 'text-red-600'}`} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManageStudents;
