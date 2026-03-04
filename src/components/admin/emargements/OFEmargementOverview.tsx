import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, ChevronRight, CheckCircle2, Clock, Filter, 
  Users, Loader2, AlertTriangle
} from 'lucide-react';
import { EmargementLearnerResponse } from '@/types/document-types';

interface OFEmargementOverviewProps {
  learners: EmargementLearnerResponse[];
  isLoading: boolean;
  onSelectLearner: (learner: EmargementLearnerResponse) => void;
}

export const OFEmargementOverview: React.FC<OFEmargementOverviewProps> = ({ learners, isLoading, onSelectLearner }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredLearners = useMemo(() => {
    let result = learners;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(l =>
        l.learner_name.toLowerCase().includes(term) ||
        l.learner_email.toLowerCase().includes(term)
      );
    }
    if (filterStatus === 'complete') {
      result = result.filter(l => l.signed_documents === l.total_documents && l.total_documents > 0);
    } else if (filterStatus === 'pending') {
      result = result.filter(l => l.signed_documents < l.total_documents);
    }
    return result;
  }, [learners, searchTerm, filterStatus]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Vue d'ensemble</h2>
            <p className="text-muted-foreground">Liste de tous les apprenants et l'état de leurs documents</p>
          </div>
        </div>
      </div>

      {/* Audit alert */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800">Preuve d'émargements</h3>
            <p className="text-sm text-amber-700 mt-1">
              Les documents signés constituent une preuve légale pour les autorités compétentes. 
              Assurez-vous que tous les documents requis sont signés avant la fin de chaque formation.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Rechercher un apprenant par nom ou email..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="pl-10" 
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les apprenants</SelectItem>
            <SelectItem value="complete">Tous docs signés</SelectItem>
            <SelectItem value="pending">Docs en attente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Learners Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des apprenants</CardTitle>
          <CardDescription>Cliquez sur un apprenant pour voir ses documents par phase</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-3 text-muted-foreground">Chargement des émargements...</span>
            </div>
          ) : filteredLearners.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Aucun apprenant trouvé</p>
              <p className="text-sm mt-1">
                {searchTerm ? 'Essayez de modifier votre recherche' : 'Envoyez des documents à vos apprenants pour les voir ici'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Apprenant</TableHead>
                  <TableHead className="text-center">Documents signés</TableHead>
                  <TableHead className="text-center">En attente</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLearners.map((learner) => {
                  const pending = learner.total_documents - learner.signed_documents;
                  const initials = learner.learner_name
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <TableRow 
                      key={learner.learner_id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => onSelectLearner(learner)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">{initials}</span>
                          </div>
                          <div>
                            <div className="font-medium">{learner.learner_name}</div>
                            <div className="text-sm text-muted-foreground">{learner.learner_email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          {learner.signed_documents}/{learner.total_documents}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {pending > 0 ? (
                          <Badge variant="outline" className="border-amber-400 text-amber-600">
                            <Clock className="h-3 w-3 mr-1" />
                            {pending}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-green-400 text-green-600">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Complet
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
