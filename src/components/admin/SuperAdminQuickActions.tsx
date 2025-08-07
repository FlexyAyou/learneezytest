
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Building, 
  Users, 
  Shield, 
  Settings, 
  BarChart3, 
  AlertTriangle, 
  Database, 
  Mail,
  FileText,
  CreditCard
} from 'lucide-react';

export const SuperAdminQuickActions = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Gérer les organisations',
      description: 'Voir et gérer tous les organismes',
      icon: Building,
      onClick: () => navigate('/dashboard/superadmin/organisations'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Gestion utilisateurs',
      description: 'Administrer tous les comptes',
      icon: Users,
      onClick: () => navigate('/dashboard/superadmin/users'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Sécurité & logs',
      description: 'Surveiller la sécurité',
      icon: Shield,
      onClick: () => navigate('/dashboard/superadmin/security'),
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      title: 'Statistiques globales',
      description: 'Analytics de la plateforme',
      icon: BarChart3,
      onClick: () => navigate('/dashboard/superadmin'),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Gestion licences',
      description: 'Attribution et quotas',
      icon: FileText,
      onClick: () => navigate('/dashboard/superadmin/licenses'),
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      title: 'Paiements & facturation',
      description: 'Revenus et transactions',
      icon: CreditCard,
      onClick: () => navigate('/dashboard/superadmin/payments'),
      color: 'bg-indigo-500 hover:bg-indigo-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {quickActions.map((action, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
          onClick={action.onClick}
        >
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${action.color} text-white transition-colors`}>
              <action.icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                {action.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{action.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
