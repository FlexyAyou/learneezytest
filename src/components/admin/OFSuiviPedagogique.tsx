
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Eye } from 'lucide-react';

export const OFSuiviPedagogique = () => {
  const evaluations = [
    { id: '1', apprenant: 'Marie Dupont', formation: 'React Avancé', type: 'Quiz final', score: 85, maxScore: 100, date: '2024-01-14' },
    { id: '2', apprenant: 'Jean Martin', formation: 'JavaScript', type: 'TP pratique', score: 92, maxScore: 100, date: '2024-01-13' },
    { id: '3', apprenant: 'Sophie Bernard', formation: 'Angular', type: 'Evaluation continue', score: 76, maxScore: 100, date: '2024-01-12' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Suivi pédagogique</h1>
          <p className="text-gray-600">Suivi des évaluations et de la progression</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Évaluations et résultats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Apprenant</TableHead>
                <TableHead>Formation</TableHead>
                <TableHead>Type d'évaluation</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evaluations.map((evaluation) => (
                <TableRow key={evaluation.id}>
                  <TableCell className="font-medium">{evaluation.apprenant}</TableCell>
                  <TableCell>{evaluation.formation}</TableCell>
                  <TableCell>{evaluation.type}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{evaluation.score}/{evaluation.maxScore}</span>
                      <Badge variant={evaluation.score >= 80 ? 'default' : evaluation.score >= 60 ? 'secondary' : 'destructive'}>
                        {Math.round((evaluation.score / evaluation.maxScore) * 100)}%
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{evaluation.date}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
