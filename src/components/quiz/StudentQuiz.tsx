import React, { useEffect, useState } from 'react';
import normalizeQuestions, { NormalizedQuestion } from '@/utils/normalizeQuestions';

type Props = { quizId?: string | number; quiz?: any; onComplete?: (score: number, passed: boolean) => void };

const StudentQuiz: React.FC<Props> = ({ quizId, quiz, onComplete }) => {
  const [questions, setQuestions] = useState<NormalizedQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  useEffect(() => {
    let mounted = true;
    console.log('StudentQuiz init', { quizId, quiz });
    (async () => {
      setLoading(true);
      try {
        if (quiz && quiz.questions) {
          const norm = normalizeQuestions(quiz.questions);
          console.log('StudentQuiz - normalized (from prop)', norm);
          if (mounted) setQuestions(norm);
          return;
        }
        if (!quizId) {
          setQuestions([]);
          return;
        }
        const res = await fetch(`/api/quizzes/${quizId}`);
        if (!res.ok) throw new Error('fetch failed');
        const data = await res.json();
        const norm = normalizeQuestions(data?.questions ?? data?.items ?? []);
        console.log('StudentQuiz - fetched quiz, normalized', { fetched: data, normalized: norm });
        if (mounted) setQuestions(norm);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [quizId, quiz]);

  useEffect(() => {
    console.log('StudentQuiz - answers updated', answers);
  }, [answers]);

  const setQAnswer = (qId: string, value: any) => setAnswers(prev => ({ ...prev, [qId]: value }));

  const toggleOption = (q: NormalizedQuestion, optId: string, single = false) => {
    const cur = answers[q.id] ?? [];
    if (single) {
      setQAnswer(q.id, [optId]);
      return;
    }
    const set = Array.isArray(cur) ? [...cur] : [];
    const idx = set.indexOf(optId);
    if (idx >= 0) set.splice(idx, 1);
    else set.push(optId);
    setQAnswer(q.id, set);
  };

  const onClozeInput = (qId: string, holeIdx: number, val: string) => {
    const cur = Array.isArray(answers[qId]) ? [...answers[qId]] : [];
    cur[holeIdx] = val;
    setQAnswer(qId, cur);
  };

  const onClozeDropOption = (qId: string, holeIdx: number, optionId: string) => {
    const cur = Array.isArray(answers[qId]) ? [...answers[qId]] : [];
    cur[holeIdx] = optionId;
    setQAnswer(qId, cur);
  };

  const computeScore = () => {
    let score = 0;
    for (const q of questions) {
      const given = answers[q.id];
      if (q.type === 'cloze' && q.cloze) {
        const ok = q.cloze.holes.every((h, i) => {
          const g = (Array.isArray(given) ? given[i] : given) ?? '';
          if (h.options && h.options.length) {
            return String(g) === String(h.answer ?? '');
          }
          return String(g ?? '') === String(h.answer ?? '');
        });
        if (ok) score++;
      } else {
        const givenIds = Array.isArray(given) ? given : (given ? [String(given)] : []);
        if (q.correctOrder && q.correctOrder.length) {
          if (JSON.stringify(givenIds) === JSON.stringify(q.correctOrder)) score++;
        } else {
          const correct = q.correctAnswers || [];
          const s1 = [...givenIds].sort();
          const s2 = [...correct].sort();
          if (JSON.stringify(s1) === JSON.stringify(s2)) score++;
        }
      }
    }
    return { score, total: questions.length };
  };

  if (loading) return <div>Chargement...</div>;
  if (!questions.length) return <div>Aucune question</div>;

  return (
    <div className="space-y-6">
      {questions.map((q, qi) => (
        <div key={q.id} className="p-4 border rounded">
          <div className="font-medium mb-2">Q{qi + 1} — {q.stem}</div>

          {q.options && q.options.length > 0 && (
            <div className="space-y-2">
              {q.options.map(opt => {
                const selected = (answers[q.id] ?? []).includes(opt.id);
                const single = (q.correctAnswers?.length ?? 0) <= 1;
                return (
                  <div key={opt.id} className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleOption(q, opt.id, single)}
                      className={`px-3 py-1 border ${selected ? 'bg-sky-100' : ''}`}
                    >
                      {opt.text ?? opt.id}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {q.cloze && (
            <div className="mt-3">
              <ClozeRenderer
                q={q}
                value={answers[q.id] ?? []}
                onInput={(holeIdx, v) => onClozeInput(q.id, holeIdx, v)}
                onDropOption={(holeIdx, optionId) => onClozeDropOption(q.id, holeIdx, optionId)}
              />
            </div>
          )}
        </div>
      ))}

      <div className="flex items-center gap-4">
        <button
          onClick={() => {
              console.log('StudentQuiz - submitting answers', answers);
              const res = computeScore();
              console.log('StudentQuiz - computeScore result', res);
              const passed = res.total ? res.score / res.total >= 0.5 : false;
              try {
                onComplete?.(res.score, passed);
              } catch (e) {
                console.error('onComplete handler error', e);
              }
              alert(`Score: ${res.score} / ${res.total}`);
            }}
          className="px-4 py-2 bg-sky-600 text-white rounded"
        >
          Valider
        </button>
      </div>
    </div>
  );
};

export default StudentQuiz;

/* ClozeRenderer: simple renderer with inputs + drag/drop for hole options */
const ClozeRenderer: React.FC<{
  q: NormalizedQuestion;
  value: any[];
  onInput: (holeIdx: number, v: string) => void;
  onDropOption: (holeIdx: number, optionId: string) => void;
}> = ({ q, value, onInput, onDropOption }) => {
  if (!q.cloze) return null;
  const { textParts, holes } = q.cloze;

  const dragStart = (e: React.DragEvent, optionId: string) => {
    e.dataTransfer.setData('text/option-id', optionId);
  };

  const allow = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (e: React.DragEvent, holeIdx: number) => {
    e.preventDefault();
    const optId = e.dataTransfer.getData('text/option-id');
    if (optId) onDropOption(holeIdx, optId);
  };

  let pool: { id: string; text?: string }[] = [];
  if (holes.some(h => h.options && h.options.length)) {
    const map = new Map<string, string>();
    holes.forEach(h => h.options?.forEach(o => map.set(o.id, o.text ?? o.id)));
    pool = Array.from(map.entries()).map(([id, text]) => ({ id, text }));
  } else if (q.options && q.options.length) {
    pool = q.options.map(o => ({ id: o.id, text: o.text }));
  }

  return (
    <div>
      <div className="mb-2">
        {textParts.map((part, idx) => (
          <span key={`part-${idx}`}>
            <span>{part}</span>
            {idx < holes.length && (
              <span
                onDragOver={allow}
                onDrop={(e) => handleDrop(e, idx)}
                className="inline-block ml-2 mr-2 px-2 py-1 border rounded min-w-[120px] align-middle"
              >
                {value?.[idx] ? (
                  <span>{String(value[idx])}</span>
                ) : (
                  <input
                    placeholder="Réponse..."
                    defaultValue={value?.[idx] ?? ''}
                    onBlur={(e) => onInput(idx, e.target.value)}
                    className="border px-1"
                  />
                )}
              </span>
            )}
          </span>
        ))}
      </div>

      {pool.length > 0 && (
        <div className="mt-2 flex gap-2 flex-wrap">
          {pool.map(opt => (
            <div
              key={opt.id}
              draggable
              onDragStart={(e) => dragStart(e, opt.id)}
              className="px-3 py-1 border bg-gray-50 cursor-grab"
            >
              {opt.text}
            </div>
          ))}
          <div className="text-xs text-muted-foreground ml-2">Glisser une option dans un trou</div>
        </div>
      )}
    </div>
  );
};
