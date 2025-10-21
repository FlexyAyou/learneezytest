
import React from 'react';
import { StatsCard } from '@/components/common/StatsCard';
import { Users, Building, BookOpen, Shield, DollarSign, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { useOrganizations, useCourses, useSuperadminUsers } from '@/hooks/useApi';

export const SuperAdminStats = () => {
  // Récupération des données depuis l'API
  const { data: organizations, isLoading: loadingOrgs } = useOrganizations();
  const { data: coursesData, isLoading: loadingCourses } = useCourses(1, 100);
  const { data: users, isLoading: loadingUsers } = useSuperadminUsers();

  // Calcul des statistiques dynamiques - avec fallback si erreur API
  const totalOrgs = organizations?.length || 0;
  const totalCourses = Array.isArray(coursesData) ? coursesData.length : 0;
  const totalUsers = users?.length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Organismes de formation"
        value={loadingOrgs ? "..." : totalOrgs.toString()}
        change="Données en direct"
        icon={Building}
        trend="neutral"
      />
      <StatsCard
        title="Utilisateurs actifs"
        value={loadingUsers ? "..." : totalUsers.toLocaleString('fr-FR')}
        change="Données en direct"
        icon={Users}
        trend="neutral"
      />
      <StatsCard
        title="Cours totaux"
        value={loadingCourses ? "..." : totalCourses.toLocaleString('fr-FR')}
        change="Données en direct"
        icon={BookOpen}
        trend="neutral"
      />
      <StatsCard
        title="Revenus plateforme"
        value="€0"
        change="API en cours"
        icon={DollarSign}
        trend="neutral"
      />
      <StatsCard
        title="Licences actives"
        value="0"
        change="API en cours"
        icon={Shield}
        trend="neutral"
      />
      <StatsCard
        title="Incidents ouverts"
        value="0"
        change="API en cours"
        icon={AlertTriangle}
        trend="neutral"
      />
      <StatsCard
        title="Taux de satisfaction"
        value="0%"
        change="API en cours"
        icon={CheckCircle}
        trend="neutral"
      />
      <StatsCard
        title="Performance système"
        value="0%"
        change="API en cours"
        icon={TrendingUp}
        trend="neutral"
      />
    </div>
  );
};
