
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  BookOpen, 
  Users, 
  Video, 
  MessageSquare, 
  BarChart3, 
  Plus,
  Settings,
  Calendar,
  Award,
  FileText,
  ClipboardList,
  TrendingUp,
  HelpCircle,
  Download,
  Brain,
  TestTube
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import des composants spécialisés
import InternalTrainerContent from '@/components/internal-trainer/InternalTrainerContent';
import InternalTrainerSessions from '@/components/internal-trainer/InternalTrainerSessions';
import InternalTrainerStudents from '@/components/internal-trainer/InternalTrainerStudents';
import InternalTrainerMessaging from '@/components/internal-trainer/InternalTrainerMessaging';
import { DocumentDownload } from '@/components/common/DocumentDownload';
import { AIChat } from '@/components/common/AIChat';
import { VideoConference } from '@/components/common/VideoConference';
import { PositioningTest } from '@/components/common/PositioningTest';

const InternalTrainerDashboardHome = () => {
  const { toast } = useToast();
  const [canCreateContent, setCanCreateContent] = useState(true);

  const stats = [
    { title: 'Cours créés', value: '12', icon: BookOpen, color: 'text-blue-600' },
    { title: 'Étudiants actifs', value: '324', icon: Users, color: 'text-green-600' },
    { title: 'Sessions animées', value: '28', icon: Video, color: 'text-purple-600' },
    { title: 'Note moyenne', value: '4.8', icon: Award, color: 'text-orange-600' },
  ];

  const activeCourses = [
    { id: 1, title: 'React pour Débutants', students: 45, progress: 78, sessions: 3 },
    { id: 2, title: 'JavaScript Avancé', students: 32, progress: 92, sessions: 2 },
    { id: 3, title: 'Node.js Backend', students: 28, progress: 56, sessions: 4 },
  ];

  const upcomingSessions = [
    { id: 1, course: 'React pour Débutants', date: '2024-01-15', time: '14:00', type: 'Présentiel', students: 15 },
    { id: 2, course: 'JavaScript Avancé', date: '2024-01-16', time: '10:00', type: 'À distance', students: 20 },
    { id: 3, course: 'Node.js Backend', date: '2024-01-17', time: '16:00', type: 'Hybride', students: 12 },
  ];

  const handleCreateCourse = () => {
    if (!canCreateContent) {
      toast({
        title: "Accès restreint",
        description: "Votre rôle ne permet pas la création de contenu. Contactez l'administrateur.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Nouveau cours",
      description: "Redirection vers l'outil de création de cours...",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Formateur</h1>
          <p className="text-gray-600">Créez du contenu et animez vos formations</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="content-creation" 
              checked={canCreateContent}
              onCheckedChange={setCanCreateContent}
            />
            <Label htmlFor="content-creation" className="text-sm">
              Création de contenu
            </Label>
          </div>
          <Button onClick={handleCreateCourse} disabled={!canCreateContent}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Cours
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                  <div className="ml-4">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-gray-600 text-sm">{stat.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Cours Actifs
            </CardTitle>
            <CardDescription>Vos formations en cours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeCourses.map((course) => (
              <div key={course.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{course.title}</h4>
                  <Badge>{course.students} étudiants</Badge>
                </div>
                <Progress value={course.progress} className="h-2 mb-2" />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{course.progress}% complété</span>
                  <span>{course.sessions} sessions restantes</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Sessions Programmées
            </CardTitle>
            <CardDescription>Vos prochaines animations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">{session.course}</h4>
                  <p className="text-xs text-gray-600">{session.date} à {session.time}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs">{session.type}</Badge>
                    <span className="text-xs text-gray-500">{session.students} participants</span>
                  </div>
                </div>
                <Button size="sm">Animer</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Content Creation Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Outils de Création</CardTitle>
          <CardDescription>
            {canCreateContent ? 
              "Créez et gérez votre contenu pédagogique" : 
              "Création de contenu désactivée - Animation uniquement"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              disabled={!canCreateContent}
              variant={canCreateContent ? "default" : "secondary"}
            >
              <BookOpen className="h-6 w-6" />
              <span>Nouveau Module</span>
            </Button>
            <Button 
              className="h-20 flex flex-col items-center justify-center space-y-2" 
              variant="outline"
              disabled={!canCreateContent}
            >
              <FileText className="h-6 w-6" />
              <span>Créer Quiz</span>
            </Button>
            <Button 
              className="h-20 flex flex-col items-center justify-center space-y-2" 
              variant="outline"
              disabled={!canCreateContent}
            >
              <Award className="h-6 w-6" />
              <span>Devoir</span>
            </Button>
            <Button 
              className="h-20 flex flex-col items-center justify-center space-y-2" 
              variant="outline"
            >
              <Video className="h-6 w-6" />
              <span>Session Live</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const InternalTrainerDashboard = () => {
  const sidebarItems = [
    { title: 'Tableau de bord', href: '/formateur-interne', icon: BarChart3, isActive: true },
    { title: 'Contenus pédagogiques', href: '/formateur-interne/contenus', icon: FileText },
    { title: 'Animation sessions', href: '/formateur-interne/sessions', icon: Video },
    { title: 'Suivi apprenants', href: '/formateur-interne/etudiants', icon: TrendingUp },
    { title: 'Tests de positionnement', href: '/formateur-interne/tests', icon: TestTube },
    { title: 'Visioconférence', href: '/formateur-interne/video', icon: Video },
    { title: 'Chat IA', href: '/formateur-interne/chat', icon: Brain },
    { title: 'Mes documents', href: '/formateur-interne/documents', icon: Download },
    { title: 'Messagerie', href: '/formateur-interne/messages', icon: MessageSquare },
  ];

  const userInfo = {
    name: "Marie Dubois",
    email: "marie.dubois@learneezy.com"
  };

  const mockDocuments = [
    { id: '1', name: 'Support React.pdf', type: 'PDF', date: '2024-01-20', size: '2.3 MB' },
    { id: '2', name: 'Exercices JS.pdf', type: 'PDF', date: '2024-01-18', size: '1.8 MB' }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar
        title="Formateur Interne"
        subtitle="Création et Animation"
        items={sidebarItems}
        userInfo={userInfo}
      />
      <main className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<InternalTrainerDashboardHome />} />
          <Route path="/contenus" element={<InternalTrainerContent />} />
          <Route path="/sessions" element={<InternalTrainerSessions />} />
          <Route path="/etudiants" element={<InternalTrainerStudents />} />
          <Route path="/tests" element={<PositioningTest userRole="instructor" />} />
          <Route path="/video" element={<VideoConference />} />
          <Route path="/chat" element={<AIChat />} />
          <Route path="/documents" element={<DocumentDownload documents={mockDocuments} userRole="instructor" />} />
          <Route path="/messages" element={<InternalTrainerMessaging />} />
        </Routes>
      </main>
    </div>
  );
};

export default InternalTrainerDashboard;
