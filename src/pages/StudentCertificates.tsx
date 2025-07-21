
import React from 'react';
import { Award, Download, Share2, Calendar, Check, Home, Book, BarChart3, MessageSquare, User, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardSidebar } from '@/components/DashboardSidebar';

const StudentCertificates = () => {
  const sidebarItems = [
    { title: "Tableau de bord", href: "/dashboard/etudiant", icon: Home },
    { title: "Mes cours", href: "/dashboard/etudiant/courses", icon: Book },
    { title: "Progression", href: "/dashboard/etudiant/progress", icon: BarChart3 },
    { title: "Certificats", href: "/dashboard/etudiant/certificates", icon: Award, isActive: true },
    { title: "Messages", href: "/dashboard/etudiant/messages", icon: MessageSquare, badge: "3" },
    { title: "Profil", href: "/profil", icon: User },
    { title: "Paramètres", href: "/dashboard/etudiant/settings", icon: Settings },
  ];

  const userInfo = {
    name: "Jean-Paul Martin",
    email: "jean-paul@email.com"
  };

  const certificates = [
    {
      id: 1,
      title: "JavaScript ES6+ Avancé",
      instructor: "Sophie Laurent",
      completedDate: "15 Décembre 2024",
      score: 95,
      credentialId: "JS-ADV-2024-001234",
      status: "Émis",
      skills: ["JavaScript", "ES6+", "Async/Await", "Modules"]
    },
    {
      id: 2,
      title: "Fondamentaux du Design UX",
      instructor: "Marie Dubois",
      completedDate: "8 Novembre 2024",
      score: 88,
      credentialId: "UX-FUND-2024-005678",
      status: "Émis",
      skills: ["UX Design", "Wireframing", "Prototyping", "User Research"]
    },
    {
      id: 3,
      title: "HTML & CSS Responsive",
      instructor: "Pierre Martin",
      completedDate: "25 Octobre 2024",
      score: 92,
      credentialId: "HTML-CSS-2024-009876",
      status: "Émis",
      skills: ["HTML5", "CSS3", "Flexbox", "Grid", "Responsive Design"]
    }
  ];

  const upcomingCertificates = [
    {
      course: "React Avancé",
      progress: 75,
      estimatedCompletion: "20 Janvier 2025"
    },
    {
      course: "Node.js Backend",
      progress: 45,
      estimatedCompletion: "15 Février 2025"
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar
        title="Espace Étudiant"
        subtitle="Votre parcours d'apprentissage"
        items={sidebarItems}
        userInfo={userInfo}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Certificats</h1>
            <p className="text-gray-600">Vos accomplissements et certifications obtenues</p>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Certificats obtenus</CardTitle>
                <Award className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Cette année</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Score moyen</CardTitle>
                <Check className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">91.7%</div>
                <p className="text-xs text-muted-foreground">Excellent travail !</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En cours</CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">Certificats à venir</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Certificats obtenus */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Certificats obtenus</h2>
              
              {certificates.map((cert) => (
                <Card key={cert.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{cert.title}</CardTitle>
                        <CardDescription>par {cert.instructor}</CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {cert.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Date d'obtention :</span>
                        <span className="font-medium">{cert.completedDate}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Score :</span>
                        <span className="font-medium text-green-600">{cert.score}%</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">ID Credential :</span>
                        <span className="font-mono text-xs">{cert.credentialId}</span>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Compétences acquises :</p>
                        <div className="flex flex-wrap gap-1">
                          {cert.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-4">
                        <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="h-4 w-4 mr-2" />
                          Partager
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Certificats à venir */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Certificats en cours</h2>
              
              {upcomingCertificates.map((cert, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{cert.course}</CardTitle>
                    <CardDescription>Certification en cours</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progression</span>
                          <span>{cert.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-pink-600 h-2 rounded-full"
                            style={{ width: `${cert.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Fin estimée :</span>
                        <span className="font-medium">{cert.estimatedCompletion}</span>
                      </div>
                      
                      <Button size="sm" variant="outline" className="w-full">
                        Continuer le cours
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Guide d'obtention */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-900">Comment obtenir un certificat ?</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-blue-600" />
                      Terminer 100% du cours
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-blue-600" />
                      Obtenir au moins 70% aux évaluations
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-blue-600" />
                      Réussir l'examen final
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentCertificates;
