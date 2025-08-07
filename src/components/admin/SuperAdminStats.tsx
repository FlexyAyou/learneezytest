
import React from 'react';
import { StatsCard } from '@/components/common/StatsCard';
import { Users, Building, BookOpen, Shield, DollarSign, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

export const SuperAdminStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Organismes de formation"
        value="47"
        change="+3 ce mois"
        icon={Building}
        trend="up"
      />
      <StatsCard
        title="Utilisateurs actifs"
        value="12,847"
        change="+324 cette semaine"
        icon={Users}
        trend="up"
      />
      <StatsCard
        title="Cours totaux"
        value="1,256"
        change="+42 ce mois"
        icon={BookOpen}
        trend="up"
      />
      <StatsCard
        title="Revenus plateforme"
        value="€847,320"
        change="+12% vs mois dernier"
        icon={DollarSign}
        trend="up"
      />
      <StatsCard
        title="Licences actives"
        value="2,156"
        change="98% utilisation"
        icon={Shield}
        trend="up"
      />
      <StatsCard
        title="Incidents ouverts"
        value="3"
        change="-2 depuis hier"
        icon={AlertTriangle}
        trend="down"
      />
      <StatsCard
        title="Taux de satisfaction"
        value="94%"
        change="+2% ce trimestre"
        icon={CheckCircle}
        trend="up"
      />
      <StatsCard
        title="Performance système"
        value="99.8%"
        change="Uptime ce mois"
        icon={TrendingUp}
        trend="up"
      />
    </div>
  );
};
