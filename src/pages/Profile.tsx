
import React from 'react';
import { User, Mail, Phone, MapPin, Calendar, Award, BookOpen, Clock, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth, useUserEnrollments } from '@/hooks/useApi';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';

const Profile = () => {
  const { user, isLoading: authLoading } = useAuth();
  const userId = user?.id ? String(user.id) : '';
  const { data: enrollments, isLoading: enrollmentsLoading } = useUserEnrollments(userId);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto">
          <ErrorMessage
            title="Non connecté"
            message="Vous devez être connecté pour voir votre profil"
          />
        </div>
      </div>
    );
  }

  const userEnrollments = enrollments || [];
  const completedCourses = userEnrollments.filter(e => e.progress === 100).length;
  const totalStudyTime = userEnrollments.reduce((total, enrollment) => {
    return total + (enrollment.course?.duration || 0) * (enrollment.progress / 100);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-600">Gérez vos informations personnelles et vos préférences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-12 w-12 text-pink-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-gray-600 mb-4 capitalize">{user.role}</p>
                <Button className="w-full bg-pink-600 hover:bg-pink-700">
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier le profil
                </Button>
              </div>
            </Card>

            <Card className="p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-3" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-3" />
                  <span>Membre depuis {new Date().toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Stats and Progress */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 text-center">
                <BookOpen className="h-8 w-8 text-pink-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{userEnrollments.length}</div>
                <div className="text-gray-600">Cours suivis</div>
              </Card>
              <Card className="p-6 text-center">
                <Award className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{completedCourses}</div>
                <div className="text-gray-600">Certificats</div>
              </Card>
              <Card className="p-6 text-center">
                <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{Math.round(totalStudyTime / 60)}h</div>
                <div className="text-gray-600">Temps d'étude</div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cours en cours</h3>
              {enrollmentsLoading ? (
                <LoadingSpinner />
              ) : userEnrollments.length > 0 ? (
                <div className="space-y-4">
                  {userEnrollments.filter(e => e.progress < 100).map((enrollment) => (
                    <div key={enrollment.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{enrollment.course?.title}</h4>
                          <p className="text-sm text-gray-600">
                            par {enrollment.course?.instructor?.firstName} {enrollment.course?.instructor?.lastName}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-pink-600">{enrollment.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-pink-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${enrollment.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun cours en cours</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
