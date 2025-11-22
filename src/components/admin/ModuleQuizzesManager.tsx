import React, { useState } from 'react';
import { Quiz, QuizCreate, QuizUpdate, Module } from '@/types/fastapi';
import { quizService } from '@/services/quiz-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Trash2, Pencil } from 'lucide-react';

interface ModuleQuizzesManagerProps {
  courseId: string;
  module: Module;
  onChanged: (updatedModule: Module) => void;
}

/**
 * Gestionnaire minimaliste pour multi-quizzes par module.
 * Étape 1: CRUD de base + IDs stables.
 * (Enhancements futurs: reorder, éditeur avancé questions, média, time_limit)
 */
export const ModuleQuizzesManager: React.FC<ModuleQuizzesManagerProps> = ({ courseId, module, onChanged }) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  const quizzes = module.quizzes || [];

  async function handleCreate() {
    if (!title.trim()) return;
    setLoading(true); setError(null);
    try {
      const payload: QuizCreate = { title: title.trim(), questions: [] };
      const created = await quizService.createQuiz(courseId, module.id!, payload);
      onChanged({ ...module, quizzes: [...quizzes, created] });
      setTitle('');
    } catch (e: any) {
      setError(e?.message || 'Erreur création quiz');
    } finally {
      setLoading(false);
    }
  }

  function startEdit(q: Quiz) {
    setEditingQuizId(q.id!);
    setEditTitle(q.title);
  }

  async function submitEdit() {
    if (!editingQuizId) return;
    setLoading(true); setError(null);
    try {
      const payload: QuizUpdate = { title: editTitle.trim() };
      const updated = await quizService.updateQuiz(courseId, module.id!, editingQuizId, payload);
      onChanged({ ...module, quizzes: quizzes.map(q => q.id === editingQuizId ? updated : q) });
      setEditingQuizId(null);
    } catch (e: any) {
      setError(e?.message || 'Erreur mise à jour quiz');
    } finally {
      setLoading(false);
    }
  }

  async function deleteQuiz(quizId: string) {
    if (!confirm('Supprimer ce quiz ?')) return;
    setLoading(true); setError(null);
    try {
      await quizService.deleteQuiz(courseId, module.id!, quizId);
      onChanged({ ...module, quizzes: quizzes.filter(q => q.id !== quizId) });
    } catch (e: any) {
      setError(e?.message || 'Erreur suppression quiz');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mt-4">
      <CardContent className="space-y-4 pt-6">
        <h3 className="text-lg font-semibold">Quizzes du module</h3>
        {error && <div className="text-sm text-red-600">{error}</div>}

        {/* Création */}
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium">Titre nouveau quiz</label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Quiz d'introduction" />
          </div>
          <Button disabled={loading || !title.trim()} onClick={handleCreate}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            <span className="ml-2">Ajouter</span>
          </Button>
        </div>

        {/* Liste quizzes */}
        <div className="space-y-2">
          {quizzes.length === 0 && <div className="text-sm text-muted-foreground">Aucun quiz pour l'instant.</div>}
          {quizzes.map(q => (
            <div key={q.id} className="border rounded p-3 flex items-center justify-between">
              {editingQuizId === q.id ? (
                <div className="flex-1 flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="text-xs font-medium">Titre</label>
                    <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                  </div>
                  <Button variant="secondary" onClick={() => setEditingQuizId(null)}>Annuler</Button>
                  <Button disabled={loading || !editTitle.trim()} onClick={submitEdit}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enregistrer'}
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <div className="font-medium">{q.title}</div>
                    <div className="text-xs text-muted-foreground">{q.questions.length} question(s)</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => startEdit(q)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => deleteQuiz(q.id!)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Placeholder éditeur questions futur */}
        <div className="text-xs text-muted-foreground">
          Édition avancée (questions, médias, points) sera ajoutée aux étapes suivantes.
        </div>
      </CardContent>
    </Card>
  );
};
