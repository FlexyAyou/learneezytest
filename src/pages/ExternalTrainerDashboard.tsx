import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Calendar, 
  Euro, 
  Star, 
  Users, 
  Clock,
  BookOpen,
  Settings,
  MessageSquare,
  Award,
  TrendingUp,
  Target,
  History,
  HelpCircle,
  Download,
  Brain,
  Video,
  TestTube
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import des composants spécialisés
import TrainerSpecialties from '@/components/external-trainer/TrainerSpecialties';
import TrainerAvailabilities from '@/components/external-trainer/TrainerAvailabilities';
import TrainerRates from '@/components/external-trainer/TrainerRates';
import TrainerBookings from '@/components/external-trainer/TrainerBookings';
import TrainerEarnings from '@/components/external-trainer/TrainerEarnings';
import TrainerHistory from '@/components/external-trainer/TrainerHistory';
import TrainerReviews from '@/components/external-trainer/TrainerReviews';
import TrainerProfile from '@/components/external-trainer/TrainerProfile';
import TrainerSupport from '@/components/external-trainer/TrainerSupport';
import TrainerDocuments from '@/components/external-trainer/TrainerDocuments';
import TrainerPositioningTests from '@/components/external-trainer/TrainerPositioningTests';
import AIChat from '@/components/common/AIChat';
import VideoConference from '@/components/common/VideoConference';
import AIChatButton from '@/components/common/AIChatButton';

const ExternalTrainerDashboardHome = () => {
  const { toast } = useToast();
  
  const stats = [
    {
      title: "Revenus ce mois",
      value: "2,450€",
      icon: Euro,
      change: "+15% vs mois dernier"
    },
    {
      title: "Heures planifiées",
      value: "32h",
      icon: Clock,
      change: "Cette semaine"
    },
    {
      title: "Note moyenne",
      value: "4.8",
      icon: Star,
      change: "Basé sur 47 avis"
    },
    {
      title: "Étudiants actifs",
      value: "23",
      icon: Users,
      change: "+2 ce mois"
    }
  ];

  const availableSlots = [
    { id: 1, date: '2024-01-15', time: '10:00-12:00', price: 45, booked: false },
    { id: 2, date: '2024-01-15', time: '14:00-16:00', price: 45, booked: true },
    { id: 3, date: '2024-01-16', time: '09:00-11:00', price: 50, booked: false },
    { id: 4, date: '2024-01-16', time: '16:00-18:00', price: 45, booked: false },
  ];

  const upcomingBookings = [
    { id: 1, student: 'Alice Martin', subject: 'React Development', date: '2024-01-15', time: '14:00', price: 45, commission: 13.5 },
    { id: 2, student: 'Thomas Petit', subject: 'JavaScript', date: '2024-01-16', time: '10:00', price: 50, commission: 15 },
    { id: 3, student: 'Emma Dubois', subject: 'UI/UX Design', date: '2024-01-17', time: '15:00', price: 40, commission: 12 },
  ];

  const specialties = ['React', 'JavaScript', 'UI/UX Design', 'Node.js', 'Python'];

  const handleSetAvailability = () => {
    toast({
      title: "Disponibilité mise à jour",
      description: "Vos créneaux ont été publiés avec succès",
    });
  };

  const handlePriceUpdate = (slotId: number, newPrice: number) => {
    toast({
      title: "Prix mis à jour",
      description: `Nouveau prix: ${newPrice}€/heure`,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Formateur Independant</h1>
        <p className="text-gray-600">Gérez vos disponibilités et vos tarifs</p>
        <div className="mt-2 text-sm text-gray-500">
          Commission Learneezy: 30% • Vous recevez: 70%
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
                  <Icon className="h-8 w-8 text-primary" />
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
        {/* Availability Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Mes Créneaux
            </CardTitle>
            <CardDescription>Gérez votre disponibilité et vos tarifs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableSlots.map((slot) => (
              <div key={slot.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">{slot.date}</p>
                  <p className="text-xs text-gray-600">{slot.time}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Input 
                    type="number" 
                    value={slot.price} 
                    className="w-16 h-8 text-xs"
                    onChange={(e) => handlePriceUpdate(slot.id, Number(e.target.value))}
                  />
                  <span className="text-xs">€/h</span>
                  {slot.booked ? (
                    <Badge variant="default">Réservé</Badge>
                  ) : (
                    <Badge variant="outline">Libre</Badge>
                  )}
                </div>
              </div>
            ))}
            <Button className="w-full" onClick={handleSetAvailability}>
              Mettre à jour la disponibilité
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Réservations Confirmées
            </CardTitle>
            <CardDescription>Vos prochaines sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingBookings.map((booking) => (
              <div key={booking.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-sm">{booking.student}</p>
                    <p className="text-xs text-gray-600">{booking.subject}</p>
                  </div>
                  <Badge>Confirmé</Badge>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>{booking.date} à {booking.time}</p>
                  <div className="flex justify-between">
                    <span>Prix: {booking.price}€</span>
                    <span className="font-medium text-green-600">Vous: {booking.price * 0.7}€</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Specialties & Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Mes Spécialités</CardTitle>
            <CardDescription>Domaines d'expertise autorisés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary">{specialty}</Badge>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              Demander nouvelles spécialités
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>Vos statistiques de formation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm">Taux de satisfaction</span>
              <span className="font-medium">98%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Sessions complétées</span>
              <span className="font-medium">156</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Taux de réservation</span>
              <span className="font-medium">85%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Revenus totaux</span>
              <span className="font-medium text-green-600">12,450€</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ExternalTrainerDashboard = () => {
  const sidebarItems = [
    { title: 'Tableau de bord', href: '/formateur-independant', icon: TrendingUp, isActive: true },
    { title: 'Mes spécialités', href: '/formateur-independant/specialites', icon: Target },
    { title: 'Mes disponibilités', href: '/formateur-independant/disponibilites', icon: Calendar },
    { title: 'Mes tarifs', href: '/formateur-independant/tarifs', icon: Euro },
    { title: 'Mes réservations', href: '/formateur-independant/reservations', icon: BookOpen },
    { title: 'Historique séances', href: '/formateur-independant/historique', icon: History },
    { title: 'Mes avis', href: '/formateur-independant/evaluations', icon: Star },
    { title: 'Mes revenus', href: '/formateur-independant/revenus', icon: Award },
    { title: 'Tests de positionnement', href: '/formateur-independant/tests', icon: TestTube },
    { title: 'Visioconférence', href: '/formateur-independant/video', icon: Video },
    { title: 'Chat IA', href: '/formateur-independant/chat', icon: Brain },
    { title: 'Mes documents', href: '/formateur-independant/documents', icon: Download },
    { title: 'Support & Assistance', href: '/formateur-independant/support', icon: HelpCircle },
    { title: 'Profil formateur', href: '/formateur-independant/profil', icon: Settings },
  ];

  const userInfo = {
    name: "Jean Martin",
    email: "jean.martin@email.com"
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar
        title="Formateur Independant"
        subtitle="Formations à la demande"
        items={sidebarItems}
        userInfo={userInfo}
      />
      <main className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<ExternalTrainerDashboardHome />} />
          <Route path="/specialites" element={<TrainerSpecialties />} />
          <Route path="/disponibilites" element={<TrainerAvailabilities />} />
          <Route path="/tarifs" element={<TrainerRates />} />
          <Route path="/reservations" element={<TrainerBookings />} />
          <Route path="/historique" element={<TrainerHistory />} />
          <Route path="/evaluations" element={<TrainerReviews />} />
          <Route path="/revenus" element={<TrainerEarnings />} />
          <Route path="/tests" element={<TrainerPositioningTests />} />
          <Route path="/video" element={<VideoConference />} />
          <Route path="/chat" element={<AIChat />} />
          <Route path="/documents" element={<TrainerDocuments />} />
          <Route path="/support" element={<TrainerSupport />} />
          <Route path="/profil" element={<TrainerProfile />} />
        </Routes>
      </main>
    </div>
  );
};

export default ExternalTrainerDashboard;
