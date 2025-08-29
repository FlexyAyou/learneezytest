
import { useState, useEffect, useMemo } from 'react';
import { AchievementBadge, StudentBadges } from '@/types';
import { achievementBadgeTemplates, mockStudentBadges } from '@/data/mockBadgesData';

interface StudentStats {
  coursesCompleted: number;
  averageGrade: number;
  perfectScores: number;
  studyTimeHours: number;
  loginStreak: number;
  categoriesCompleted: number;
  helpProvided: number;
}

export const useStudentAchievements = (userId: string) => {
  const [badges, setBadges] = useState<StudentBadges | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock des statistiques de l'apprenant
  const mockStudentStats: StudentStats = {
    coursesCompleted: 5,
    averageGrade: 17.5,
    perfectScores: 2,
    studyTimeHours: 64,
    loginStreak: 25,
    categoriesCompleted: 3,
    helpProvided: 1
  };

  const calculateBadgeProgress = (badge: Omit<AchievementBadge, 'id' | 'earnedAt' | 'progress'>, stats: StudentStats) => {
    let current = 0;
    const required = badge.condition.value;

    switch (badge.condition.type) {
      case 'courses_completed':
        current = stats.coursesCompleted;
        break;
      case 'average_grade':
        current = stats.averageGrade;
        break;
      case 'perfect_scores':
        current = stats.perfectScores;
        break;
      case 'study_time':
        current = stats.studyTimeHours;
        break;
      case 'login_streak':
        current = stats.loginStreak;
        break;
      case 'categories_completed':
        current = stats.categoriesCompleted;
        break;
      case 'help_provided':
        current = stats.helpProvided;
        break;
    }

    const isEarned = current >= required;
    const percentage = Math.min((current / required) * 100, 100);

    return { current, required, percentage, isEarned };
  };

  const calculatedBadges = useMemo(() => {
    const achievementBadges: AchievementBadge[] = achievementBadgeTemplates.map((template, index) => {
      const progress = calculateBadgeProgress(template, mockStudentStats);
      
      return {
        id: `achievement-${index}`,
        ...template,
        ...(progress.isEarned 
          ? { earnedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() }
          : { progress: { current: progress.current, required: progress.required, percentage: progress.percentage } }
        )
      };
    });

    const earnedBadges = achievementBadges.filter(badge => badge.earnedAt);
    const rarityBreakdown = earnedBadges.reduce((acc, badge) => {
      acc[badge.rarity]++;
      return acc;
    }, { common: 0, rare: 0, epic: 0, legendary: 0 });

    return {
      userId,
      achievementBadges,
      fundingBadges: mockStudentBadges.fundingBadges,
      stats: {
        totalBadges: earnedBadges.length + mockStudentBadges.fundingBadges.length,
        raretyBreakdown: rarityBreakdown
      }
    };
  }, [userId]);

  useEffect(() => {
    // Simulation d'un appel API
    const fetchBadges = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setBadges(calculatedBadges);
      setLoading(false);
    };

    fetchBadges();
  }, [calculatedBadges]);

  return { badges, loading, refetch: () => setBadges(calculatedBadges) };
};
