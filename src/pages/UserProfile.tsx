
import React, { useState } from 'react';
import { Camera, Edit, Award, Book, Clock, Star, Calendar, MapPin, Mail, Phone, Globe, Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const userProfile = {
    id: 1,
    name: "Jean-Paul Martin",
    email: "jean-paul@email.com",
    phone: "+33 1 23 45 67 89",
    location: "Paris, France",
    website: "www.jeanpaul-dev.com",
    bio: "Développeur passionné par les nouvelles technologies et l'apprentissage continu. J'aime partager mes connaissances et découvrir de nouveaux domaines.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    joinedDate: "Janvier 2023",
    level: "Intermédiaire",
    totalHours: 145,
    completedCourses: 8,
    certificates: 5,
    achievements: [
      { id: 1, title: "Premier cours terminé", icon: "🎯", date: "Mars 2023" },
      { id: 2, title: "Marathonien de l'apprentissage", icon: "🏃‍♂️", date: "Juin 2023" },
      { id: 3, title: "Expert React", icon: "⚛️", date: "Septembre 2023" },
      { id: 4, title: "Mentor actif", icon: "👨‍🏫", date: "Novembre 2023" }
    ],
    skills: [
      { name: "React.js", level: 85 },
      { name: "JavaScript", level: 90 },
      { name: "CSS/SCSS", level: 80 },
      { name: "Node.js", level: 70 },
      { name: "Python", level: 60 },
      { name: "UX/UI Design", level: 55 }
    ],
    currentCourses: [
      {
        id: 1,
        title: "Maîtrise complète de React.js",
        progress: 75,
        instructor: "Marie Dubois",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop"
      },
      {
        id: 2,
        title: "SVP",
        progress: 40,
        instructor: "Pierre Martin",
        image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=300&h=200&fit=crop"
      }
    ],
    completedCoursesList: [
      {
        id: 3,
        title: "JavaScript Moderne ES6+",
        completedDate: "Décembre 2023",
        certificate: true,
        rating: 5
      },
      {
        id: 4,
        title: "Introduction au Web Design",
        completedDate: "Novembre 2023",
        certificate: true,
        rating: 4
      },
      {
        id: 5,
        title: "Git et GitHub pour débutants",
        completedDate: "Octobre 2023",
        certificate: false,
        rating: 5
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header du profil */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                  <AvatarFallback className="text-2xl">
                    {userProfile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 bg-pink-600 hover:bg-pink-700"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{userProfile.name}</h1>
                    <Badge className="mb-2 bg-pink-100 text-pink-700">{userProfile.level}</Badge>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                    className="mt-2 sm:mt-0"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier le profil
                  </Button>
                </div>
                
                <p className="text-gray-600 mb-4 max-w-2xl">{userProfile.bio}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {userProfile.email}
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {userProfile.phone}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {userProfile.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Membre depuis {userProfile.joinedDate}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-pink-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{userProfile.totalHours}h</div>
              <p className="text-sm text-gray-600">Temps d'étude</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Book className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{userProfile.completedCourses}</div>
              <p className="text-sm text-gray-600">Cours terminés</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{userProfile.certificates}</div>
              <p className="text-sm text-gray-600">Certificats</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{userProfile.achievements.length}</div>
              <p className="text-sm text-gray-600">Réussites</p>
            </CardContent>
          </Card>
        </div>

        {/* Onglets de contenu */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Aperçu</TabsTrigger>
            <TabsTrigger value="courses">Cours</TabsTrigger>
            <TabsTrigger value="skills">Compétences</TabsTrigger>
            <TabsTrigger value="achievements">Réussites</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cours en cours */}
              <Card>
                <CardHeader>
                  <CardTitle>Cours en cours</CardTitle>
                  <CardDescription>Continuez votre apprentissage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userProfile.currentCourses.map((course) => (
                    <div key={course.id} className="flex items-center space-x-4">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{course.title}</h4>
                        <p className="text-sm text-gray-600">par {course.instructor}</p>
                        <div className="mt-2">
                          <Progress value={course.progress} className="h-2" />
                          <p className="text-xs text-gray-500 mt-1">{course.progress}% terminé</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Activité récente */}
              <Card>
                <CardHeader>
                  <CardTitle>Activité récente</CardTitle>
                  <CardDescription>Vos dernières actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Leçon terminée : "Hooks personnalisés"</p>
                      <p className="text-xs text-gray-500">Il y a 2 heures</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Nouveau cours démarré : "SVP"</p>
                      <p className="text-xs text-gray-500">Hier</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Certificat obtenu : "Anglais"</p>
                      <p className="text-xs text-gray-500">Il y a 3 jours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cours terminés</CardTitle>
                <CardDescription>Votre historique d'apprentissage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userProfile.completedCoursesList.map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{course.title}</h4>
                        <p className="text-sm text-gray-600">Terminé le {course.completedDate}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex">
                          {[1,2,3,4,5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= course.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        {course.certificate && (
                          <Badge className="bg-green-100 text-green-700">Certificat</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Compétences développées</CardTitle>
                <CardDescription>Votre niveau dans différents domaines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userProfile.skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-sm text-gray-600">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Réussites et badges</CardTitle>
                <CardDescription>Vos accomplissements sur la plateforme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userProfile.achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div>
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">Obtenu en {achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
