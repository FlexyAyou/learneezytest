
import React from 'react';
import Header from '@/components/Header';
import { UserManagement as UserManagementComponent } from '@/components/admin/UserManagement';

const UserManagement = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des utilisateurs</h1>
            <p className="text-gray-600">Gérez tous les utilisateurs de la plateforme</p>
          </div>
        </div>

        <UserManagementComponent />
      </div>
    </div>
  );
};

export default UserManagement;
