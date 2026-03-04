import React, { useState, useMemo } from 'react';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';
import { useEmargements } from '@/hooks/useDocuments';
import { EmargementLearnerResponse } from '@/types/document-types';
import { OFEmargementsSidebar } from '@/components/admin/emargements/OFEmargementsSidebar';
import { OFEmargementOverview } from '@/components/admin/emargements/OFEmargementOverview';
import { OFEmargementPhaseView } from '@/components/admin/emargements/OFEmargementPhaseView';
import { Loader2 } from 'lucide-react';

const OFEmargementPage: React.FC = () => {
  const { user } = useFastAPIAuth();
  const ofId = user?.of_id;
  const { data: emargementsData, isLoading } = useEmargements(ofId);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedLearner, setSelectedLearner] = useState<EmargementLearnerResponse | null>(null);

  const learners = emargementsData?.learners ?? [];

  const totalStats = useMemo(() => ({
    totalLearners: emargementsData?.total_learners ?? learners.length,
    totalDocuments: emargementsData?.total_documents ?? learners.reduce((s, l) => s + l.total_documents, 0),
    totalSigned: emargementsData?.total_signed ?? learners.reduce((s, l) => s + l.signed_documents, 0),
    totalPending: (emargementsData?.total_documents ?? 0) - (emargementsData?.total_signed ?? 0),
  }), [emargementsData, learners]);

  // Compute phase progress for sidebar
  const phaseProgress = useMemo(() => {
    const typePhaseMap: Record<string, string> = {
      analyse_besoin: 'phase-inscription',
      test_positionnement: 'phase-inscription',
      convention: 'phase-inscription',
      programme: 'phase-formation',
      reglement_interieur: 'phase-formation',
      cgv: 'phase-formation',
      convocation: 'phase-formation',
      emargement: 'phase-formation',
      test_niveau: 'phase-formation',
      satisfaction_chaud: 'phase-post-formation',
      attestation: 'phase-post-formation',
      certificat: 'phase-post-formation',
      test_sortie: 'phase-post-formation',
      satisfaction_froid: 'phase-suivi',
      questionnaire_financeur: 'phase-suivi',
      attestation_honneur: 'phase-suivi',
    };

    const progress: Record<string, { total: number; signed: number; pending: number }> = {
      'phase-inscription': { total: 0, signed: 0, pending: 0 },
      'phase-formation': { total: 0, signed: 0, pending: 0 },
      'phase-post-formation': { total: 0, signed: 0, pending: 0 },
      'phase-suivi': { total: 0, signed: 0, pending: 0 },
    };

    learners.forEach(learner => {
      learner.documents.forEach(doc => {
        const phase = typePhaseMap[doc.document_type] || 'phase-inscription';
        if (progress[phase]) {
          progress[phase].total++;
          if (doc.status === 'signed' || doc.status === 'completed') {
            progress[phase].signed++;
          } else {
            progress[phase].pending++;
          }
        }
      });
    });

    return progress;
  }, [learners]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Chargement des émargements...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <div className="w-72 bg-background border-r shrink-0">
        <OFEmargementsSidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setSelectedLearner(null);
          }}
          phaseProgress={phaseProgress}
          totalStats={totalStats}
        />
      </div>

      {/* Main content */}
      <div className="flex-1">
        <div className="bg-background rounded-xl shadow-sm border m-6">
          {activeTab === 'overview' ? (
            <OFEmargementOverview
              learners={learners}
              isLoading={isLoading}
              onSelectLearner={(learner) => {
                setSelectedLearner(learner);
              }}
            />
          ) : (
            <OFEmargementPhaseView
              activeTab={activeTab}
              learners={learners}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OFEmargementPage;
