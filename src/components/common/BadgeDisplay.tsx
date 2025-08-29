
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AchievementBadge, FundingBadge } from '@/types';
import { Star, Trophy, Award, Shield } from 'lucide-react';

interface BadgeDisplayProps {
  badge: AchievementBadge | FundingBadge;
  type: 'achievement' | 'funding';
  showProgress?: boolean;
}

export const BadgeDisplay = ({ badge, type, showProgress = true }: BadgeDisplayProps) => {
  const isAchievementBadge = type === 'achievement';
  const achievementBadge = badge as AchievementBadge;
  const fundingBadge = badge as FundingBadge;

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return <Award className="h-3 w-3" />;
      case 'rare': return <Star className="h-3 w-3" />;
      case 'epic': return <Trophy className="h-3 w-3" />;
      case 'legendary': return <Shield className="h-3 w-3" />;
      default: return <Award className="h-3 w-3" />;
    }
  };

  const getBadgeContent = () => {
    if (isAchievementBadge) {
      const isEarned = !!achievementBadge.earnedAt;
      const hasProgress = !!achievementBadge.progress;

      return (
        <div className={`p-4 rounded-lg border transition-all duration-200 ${
          isEarned 
            ? `${achievementBadge.color} hover:shadow-md` 
            : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
        }`}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{achievementBadge.icon}</span>
              <div>
                <h4 className={`font-semibold text-sm ${isEarned ? '' : 'text-gray-400'}`}>
                  {achievementBadge.name}
                </h4>
                {isEarned && (
                  <div className="flex items-center gap-1 mt-1">
                    {getRarityIcon(achievementBadge.rarity)}
                    <span className="text-xs opacity-75 capitalize">{achievementBadge.rarity}</span>
                  </div>
                )}
              </div>
            </div>
            {isEarned && (
              <Badge variant="outline" className="text-xs bg-white/50">
                Obtenu
              </Badge>
            )}
          </div>

          <p className={`text-xs mb-3 ${isEarned ? 'opacity-80' : 'text-gray-400'}`}>
            {achievementBadge.description}
          </p>

          {hasProgress && showProgress && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Progression</span>
                <span>{achievementBadge.progress?.current}/{achievementBadge.progress?.required}</span>
              </div>
              <Progress 
                value={achievementBadge.progress?.percentage || 0} 
                className="h-2"
              />
            </div>
          )}

          {isEarned && (
            <div className="text-xs opacity-60 mt-2">
              Obtenu le {new Date(achievementBadge.earnedAt!).toLocaleDateString()}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className={`p-4 rounded-lg border ${fundingBadge.color} hover:shadow-md transition-all duration-200`}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <div>
                <h4 className="font-semibold text-sm">{fundingBadge.name}</h4>
                <Badge variant="outline" className="text-xs mt-1 bg-white/50">
                  {fundingBadge.type}
                </Badge>
              </div>
            </div>
            {fundingBadge.isActive && (
              <Badge variant="default" className="text-xs bg-green-500">
                Actif
              </Badge>
            )}
          </div>

          <p className="text-xs mb-3 opacity-80">
            {fundingBadge.description}
          </p>

          <div className="space-y-1">
            <p className="text-xs font-medium opacity-80">Documents requis :</p>
            <ul className="text-xs space-y-1 opacity-70">
              {fundingBadge.documentsRequired.map((doc, index) => (
                <li key={index}>• {doc}</li>
              ))}
            </ul>
          </div>

          <div className="text-xs opacity-60 mt-3 pt-2 border-t border-white/20">
            Ajouté le {new Date(fundingBadge.addedAt).toLocaleDateString()} par {fundingBadge.addedBy}
          </div>
        </div>
      );
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">
            {getBadgeContent()}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs text-sm">
            {isAchievementBadge ? achievementBadge.description : fundingBadge.description}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
