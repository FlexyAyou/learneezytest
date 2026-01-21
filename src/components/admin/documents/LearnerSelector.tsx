import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Users, 
  User, 
  BookOpen, 
  CheckCircle2, 
  X,
  Filter,
  UserCheck
} from 'lucide-react';
import { Learner, Formation } from './types';

interface LearnerSelectorProps {
  learners: Learner[];
  formations: Formation[];
  selectedLearners: string[];
  onSelectionChange: (learnerIds: string[]) => void;
  mode?: 'single' | 'multiple';
}

export const LearnerSelector: React.FC<LearnerSelectorProps> = ({
  learners,
  formations,
  selectedLearners,
  onSelectionChange,
  mode = 'multiple'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFormation, setFilterFormation] = useState<string>('all');

  const filteredLearners = useMemo(() => {
    return learners.filter(learner => {
      const matchesSearch = 
        `${learner.firstName} ${learner.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        learner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (learner.company?.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFormation = filterFormation === 'all' || learner.formationId === filterFormation;
      
      return matchesSearch && matchesFormation;
    });
  }, [learners, searchTerm, filterFormation]);

  const handleSelect = (learnerId: string) => {
    if (mode === 'single') {
      onSelectionChange([learnerId]);
    } else {
      if (selectedLearners.includes(learnerId)) {
        onSelectionChange(selectedLearners.filter(id => id !== learnerId));
      } else {
        onSelectionChange([...selectedLearners, learnerId]);
      }
    }
  };

  const handleSelectAll = () => {
    if (selectedLearners.length === filteredLearners.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(filteredLearners.map(l => l.id));
    }
  };

  const handleRemoveSelection = (learnerId: string) => {
    onSelectionChange(selectedLearners.filter(id => id !== learnerId));
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const selectedLearnerDetails = learners.filter(l => selectedLearners.includes(l.id));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Sélection des apprenants
          </div>
          {selectedLearners.length > 0 && (
            <Badge variant="default" className="text-sm">
              {selectedLearners.length} sélectionné{selectedLearners.length > 1 ? 's' : ''}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher par nom, email, entreprise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterFormation} onValueChange={setFilterFormation}>
            <SelectTrigger className="w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Formation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les formations</SelectItem>
              {formations.map(formation => (
                <SelectItem key={formation.id} value={formation.id}>
                  {formation.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {mode === 'multiple' && (
            <Button variant="outline" onClick={handleSelectAll}>
              <UserCheck className="h-4 w-4 mr-2" />
              {selectedLearners.length === filteredLearners.length ? 'Désélectionner' : 'Tout sélectionner'}
            </Button>
          )}
        </div>

        {/* Selected learners chips */}
        {selectedLearners.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 bg-primary/5 rounded-lg">
            {selectedLearnerDetails.map(learner => (
              <Badge 
                key={learner.id} 
                variant="secondary" 
                className="flex items-center gap-2 py-1.5 px-3"
              >
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-xs">
                    {getInitials(learner.firstName, learner.lastName)}
                  </AvatarFallback>
                </Avatar>
                <span>{learner.firstName} {learner.lastName}</span>
                <button 
                  onClick={() => handleRemoveSelection(learner.id)}
                  className="ml-1 hover:text-destructive transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Learners list */}
        <ScrollArea className="h-[300px] border rounded-lg">
          <div className="p-2 space-y-1">
            {filteredLearners.map(learner => {
              const isSelected = selectedLearners.includes(learner.id);
              
              return (
                <div
                  key={learner.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'hover:bg-muted border border-transparent'
                  }`}
                  onClick={() => handleSelect(learner.id)}
                >
                  {mode === 'multiple' && (
                    <Checkbox 
                      checked={isSelected}
                      className="pointer-events-none"
                    />
                  )}
                  
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(learner.firstName, learner.lastName)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {learner.firstName} {learner.lastName}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {learner.email}
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {learner.formationName}
                    </Badge>
                    {learner.company && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {learner.company}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredLearners.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Aucun apprenant trouvé</p>
                <p className="text-sm">Modifiez vos critères de recherche</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{filteredLearners.length} apprenant{filteredLearners.length > 1 ? 's' : ''} trouvé{filteredLearners.length > 1 ? 's' : ''}</span>
          <span>{selectedLearners.length} sélectionné{selectedLearners.length > 1 ? 's' : ''}</span>
        </div>
      </CardContent>
    </Card>
  );
};
