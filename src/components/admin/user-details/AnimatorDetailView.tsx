
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, Users, Calendar, MessageSquare, Star, TrendingUp } from 'lucide-react';
import { useUserDetail } from '@/hooks/useApi';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface AnimatorDetailViewProps {
  user: any;
}

export const AnimatorDetailView = ({ user }: AnimatorDetailViewProps) => {
  const { data: userDetail, isLoading: userLoading } = useUserDetail(user.id);

  if (userLoading) {
    return <LoadingSpinner size="lg" className="py-8" />;
  }

  const realData = {
    firstName: userDetail?.first_name || user.first_name,
    lastName: userDetail?.last_name || user.last_name,
    email: userDetail?.email || user.email,
    isActive: userDetail?.is_active ?? user.is_active,
    createdAt: userDetail?.created_at || user.created_at,
    lastLogin: userDetail?.last_login || user.last_login,
    ofId: userDetail?.of_id || user.of_id,
  };

  // Mock data spécifique aux animateurs
  const animatorData = {
    sessions: [
      { id: 1, title: 'Session React - Hooks avancés', date: '2024-01-20', duration: 120, participants: 18, rating: 4.7 },
      { id: 2, title: 'Workshop JavaScript ES6', date: '2024-01-18', duration: 90, participants: 22, rating: 4.9 },
      { id: 3, title: 'Live Coding Node.js', date: '2024-01-15', duration: 150, participants: 15, rating: 4.5 }
    ],
    upcomingSessions: [
      { date: '2024-01-25', time: '14:00-16:00', title: 'Session Vue.js', maxParticipants: 25, registered: 20 },
      { date: '2024-01-27', time: '10:00-12:30', title: 'Workshop TypeScript', maxParticipants: 20, registered: 18 },
      { date: '2024-01-30', time: '16:00-18:00', title: 'Live Q&A React', maxParticipants: 30, registered: 25 }
    ],
    feedback: [
      { participant: 'Alice M.', session: 'React Hooks', rating: 5, comment: 'Excellent animateur, très interactif!' },
      { participant: 'Bob L.', session: 'JavaScript ES6', rating: 4, comment: 'Bonne pédagogie, exemples clairs' },
      { participant: 'Charlie D.', session: 'Node.js', rating: 5, comment: 'Animation dynamique et captivante' }
    ],
    tools: [
      { name: 'Zoom', usage: 'Visioconférence', status: 'active' },
      { name: 'Miro', usage: 'Collaboration visuelle', status: 'active' },
      { name: 'Slido', usage: 'Sondages interactifs', status: 'active' },
      { name: 'Kahoot', usage: 'Quiz gamifiés', status: 'inactive' }
    ],
    stats: {
      totalSessions: 45,
      totalParticipants: 756,
      averageRating: 4.7,
      averageDuration: 115
    }
  };

  const getToolStatusBadge = (status: string) => {
    const configs = {
      active: { variant: 'default' as const, label: 'Actif' },
      inactive: { variant: 'secondary' as const, label: 'Inactif' }
    };
    return configs[status as keyof typeof configs] || configs.inactive;
  };

  return (
    <div className="space-y-6">
      {/* Statistiques de l'animateur */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {animatorData.stats.totalSessions}
            </div>
            <div className="text-sm text-gray-600">Sessions animées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {animatorData.stats.totalParticipants}
            </div>
            <div className="text-sm text-gray-600">Participants formés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-1 flex items-center justify-center gap-1">
              <Star className="h-6 w-6" />
              {animatorData.stats.averageRating}
            </div>
            <div className="text-sm text-gray-600">Note moyenne</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {animatorData.stats.averageDuration}min
            </div>
            <div className="text-sm text-gray-600">Durée moyenne</div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions récentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Sessions récentes animées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {animatorData.sessions.map((session) => (
              <div key={session.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{session.title}</h4>
                    <p className="text-sm text-gray-600">
                      {session.date} • {session.duration} minutes
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{session.participants} participants</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span className="text-sm font-medium">{session.rating}/5</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sessions à venir */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Prochaines sessions programmées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {animatorData.upcomingSessions.map((session, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">{session.title}</p>
                  <p className="text-sm text-gray-600">{session.date} • {session.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {session.registered}/{session.maxParticipants} inscrits
                  </p>
                  <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(session.registered / session.maxParticipants) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Outils utilisés */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Outils d'animation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {animatorData.tools.map((tool, index) => {
              const config = getToolStatusBadge(tool.status);
              return (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{tool.name}</h4>
                    <Badge variant={config.variant}>{config.label}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{tool.usage}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Feedback des participants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Feedback des participants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {animatorData.feedback.map((review, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium">{review.participant}</p>
                    <p className="text-sm text-gray-600">{review.session}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{review.rating}/5</span>
                  </div>
                </div>
                <p className="text-sm italic">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
