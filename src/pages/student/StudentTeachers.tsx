import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StudentTeacherOverview } from '@/components/student/teachers/StudentTeacherOverview';
import { StudentCurrentTeachers } from '@/components/student/teachers/StudentCurrentTeachers';
import { StudentSessionHistory } from '@/components/student/teachers/StudentSessionHistory';

const StudentTeachers = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mes Professeurs</h1>
        <p className="text-muted-foreground mt-2">
          Gérez vos cours particuliers et évaluez vos professeurs
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="current">Professeurs actuels</TabsTrigger>
          <TabsTrigger value="history">Historique des séances</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <StudentTeacherOverview />
        </TabsContent>

        <TabsContent value="current">
          <StudentCurrentTeachers />
        </TabsContent>

        <TabsContent value="history">
          <StudentSessionHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentTeachers;