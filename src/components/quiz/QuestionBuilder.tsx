import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { QuestionTypeSelector } from './QuestionTypeSelector';
import type { Question, QuestionType, DifficultyLevel } from '@/types/quiz';
import QuestionMediaField from './QuestionMediaField';
import OptionsMediaGrid from './OptionsMediaGrid';

interface QuestionBuilderProps {
  question?: Question;
  onSave: (question: Question) => void;
  onCancel: () => void;
  availableTypes?: QuestionType[];
}

export const QuestionBuilder: React.FC<QuestionBuilderProps> = ({
  question,
  onSave,
  onCancel,
  availableTypes
}) => {
  // Upload & notifications délégués aux composants enfants
  const [questionType, setQuestionType] = useState<QuestionType>(question?.type || 'single-choice');
  const [questionText, setQuestionText] = useState(question?.question || '');
  const [points, setPoints] = useState(question?.points || 1);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(question?.difficulty || 'medium');
  const [explanation, setExplanation] = useState(question?.explanation || '');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Media states
  const [questionMedia, setQuestionMedia] = useState(question?.media);

  // --- Normalisation défensive des options & médias par option ---
  const asStringArray = (val: any, fallbackCount = 4): string[] => {
    if (Array.isArray(val)) return val.map(v => (typeof v === 'string' ? v : String(v ?? '')));
    return new Array(fallbackCount).fill('').map(() => '');
  };
  const asMediaArray = (val: any, count: number): Array<{ type: 'image' | 'video' | 'pdf'; key?: string; url?: string; caption?: string } | null> => {
    if (!Array.isArray(val)) return new Array(count).fill(null);
    const arr = val.slice(0, count);
    // Compléter si trop court
    while (arr.length < count) arr.push(null);
    return arr.map(m => {
      if (!m) return null;
      const type = (m.type === 'video' || m.type === 'pdf' || m.type === 'image') ? m.type : 'image';
      return { type, key: m.key, url: m.url, caption: m.caption };
    });
  };
  const isChoice = question?.type === 'single-choice' || question?.type === 'multiple-choice';
  const initialOptions = isChoice ? asStringArray((question as any)?.options, 4) : ['', '', '', ''];
  const [options, setOptions] = useState<string[]>(initialOptions);
  const [optionsMedia, setOptionsMedia] = useState<Array<{ type: 'image' | 'video' | 'pdf'; key?: string; url?: string; caption?: string } | null>>(
    isChoice ? asMediaArray((question as any)?.optionsMedia, initialOptions.length) : new Array(initialOptions.length).fill(null)
  );

  // Sync longueur optionsMedia ←→ options
  useEffect(() => {
    setOptionsMedia(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      if (options.length === safePrev.length) return safePrev;
      if (options.length > safePrev.length) {
        return [...safePrev, ...new Array(options.length - safePrev.length).fill(null)];
      }
      return safePrev.slice(0, options.length);
    });
  }, [options.length]);
  const [correctAnswer, setCorrectAnswer] = useState<number>(
    question?.type === 'single-choice' && typeof (question as any)?.correctAnswer === 'number'
      ? (question as any).correctAnswer
      : 0
  );
  const [correctAnswers, setCorrectAnswers] = useState<number[]>(
    question?.type === 'multiple-choice' && Array.isArray((question as any)?.correctAnswers)
      ? (question as any).correctAnswers.filter((n: any) => Number.isInteger(n))
      : []
  );

  // True/False
  const [trueFalseAnswer, setTrueFalseAnswer] = useState<boolean>(
    question?.type === 'true-false' ? question.correctAnswer : true
  );

  // Short Answer
  const [shortAnswers, setShortAnswers] = useState<string[]>(
    question?.type === 'short-answer' && Array.isArray((question as any)?.correctAnswers)
      ? (question as any).correctAnswers.map((s: any) => typeof s === 'string' ? s : String(s ?? ''))
      : ['']
  );
  const [caseSensitive, setCaseSensitive] = useState(
    question?.type === 'short-answer' ? question.caseSensitive || false : false
  );

  // Long Answer
  const [minWords, setMinWords] = useState(
    question?.type === 'long-answer' ? question.minWords || 0 : 0
  );
  const [maxWords, setMaxWords] = useState(
    question?.type === 'long-answer' ? question.maxWords || 0 : 0
  );
  const [rubric, setRubric] = useState<string[]>(
    question?.type === 'long-answer' ? question.rubric || [] : []
  );

  // Fill Blank
  const [blankText, setBlankText] = useState(
    question?.type === 'fill-blank' ? question.text : ''
  );
  const [blankAnswers, setBlankAnswers] = useState<string[]>(
    question?.type === 'fill-blank' && Array.isArray((question as any)?.correctAnswers)
      ? (question as any).correctAnswers.map((s: any) => typeof s === 'string' ? s : String(s ?? ''))
      : ['']
  );

  // Matching
  const [leftItems, setLeftItems] = useState<string[]>(
    question?.type === 'matching' && Array.isArray((question as any)?.leftItems)
      ? (question as any).leftItems.map((s: any) => typeof s === 'string' ? s : String(s ?? ''))
      : ['', '']
  );
  const [rightItems, setRightItems] = useState<string[]>(
    question?.type === 'matching' && Array.isArray((question as any)?.rightItems)
      ? (question as any).rightItems.map((s: any) => typeof s === 'string' ? s : String(s ?? ''))
      : ['', '']
  );
  const [matches, setMatches] = useState<{ left: number; right: number }[]>(
    question?.type === 'matching' && Array.isArray((question as any)?.correctMatches)
      ? (question as any).correctMatches.filter((m: any) => m && Number.isInteger(m.left) && Number.isInteger(m.right))
      : []
  );

  // Ordering
  const [orderItems, setOrderItems] = useState<string[]>(
    question?.type === 'ordering' && Array.isArray((question as any)?.items)
      ? (question as any).items.map((s: any) => typeof s === 'string' ? s : String(s ?? ''))
      : ['', '']
  );

  const isUploadingMedia = false; // délégué au composant QuestionMediaField

  const handleSave = () => {
    let newQuestion: Question;
    const baseQuestion = {
      id: question?.id || `q-${Date.now()}`,
      question: questionText,
      points,
      difficulty,
      explanation: explanation || undefined,
      media: questionMedia,
    };

    switch (questionType) {
      case 'single-choice':
        newQuestion = {
          ...baseQuestion,
          type: 'single-choice',
          options: options.filter(o => o.trim()),
          correctAnswer,
          optionsMedia,
        };
        break;
      case 'multiple-choice':
        newQuestion = {
          ...baseQuestion,
          type: 'multiple-choice',
          options: options.filter(o => o.trim()),
          correctAnswers,
          optionsMedia,
        };
        break;
      case 'true-false':
        newQuestion = {
          ...baseQuestion,
          type: 'true-false',
          correctAnswer: trueFalseAnswer,
        };
        break;
      case 'short-answer':
        newQuestion = {
          ...baseQuestion,
          type: 'short-answer',
          correctAnswers: shortAnswers.filter(a => a.trim()),
          caseSensitive,
        };
        break;
      case 'long-answer':
        newQuestion = {
          ...baseQuestion,
          type: 'long-answer',
          minWords: minWords || undefined,
          maxWords: maxWords || undefined,
          rubric: rubric.filter(r => r.trim()),
        };
        break;
      case 'fill-blank':
        newQuestion = {
          ...baseQuestion,
          type: 'fill-blank',
          text: blankText,
          correctAnswers: blankAnswers.filter(a => a.trim()),
        };
        break;
      case 'matching':
        newQuestion = {
          ...baseQuestion,
          type: 'matching',
          leftItems: leftItems.filter(i => i.trim()),
          rightItems: rightItems.filter(i => i.trim()),
          correctMatches: matches,
        };
        break;
      case 'ordering':
        const filteredItems = orderItems.filter(i => i.trim());
        newQuestion = {
          ...baseQuestion,
          type: 'ordering',
          items: filteredItems,
          correctOrder: filteredItems.map((_, idx) => idx),
        };
        break;
      default:
        return;
    }

    onSave(newQuestion);
  };

  const renderQuestionFields = () => {
    switch (questionType) {
      case 'single-choice':
      case 'multiple-choice':
        return (
          <div className="space-y-4">
            <div>
              <Label>Options de réponse</Label>
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2 mt-2">
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...options];
                      newOptions[index] = e.target.value;
                      setOptions(newOptions);
                    }}
                    placeholder={`Option ${index + 1}`}
                  />
                  {questionType === 'single-choice' ? (
                    <Switch
                      checked={correctAnswer === index}
                      onCheckedChange={() => setCorrectAnswer(index)}
                    />
                  ) : (
                    <Switch
                      checked={correctAnswers.includes(index)}
                      onCheckedChange={(checked) => {
                        setCorrectAnswers(
                          checked
                            ? [...correctAnswers, index]
                            : correctAnswers.filter((i) => i !== index)
                        );
                      }}
                    />
                  )}
                  {options.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setOptions(options.filter((_, i) => i !== index))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setOptions([...options, '']);
                }}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" /> Ajouter une option
              </Button>
              <OptionsMediaGrid options={options} value={optionsMedia} onChange={setOptionsMedia} />
            </div>
          </div>
        );

      case 'true-false':
        return (
          <div>
            <Label>Bonne réponse</Label>
            <div className="flex gap-4 mt-2">
              <Button
                variant={trueFalseAnswer === true ? 'default' : 'outline'}
                onClick={() => setTrueFalseAnswer(true)}
              >
                Vrai
              </Button>
              <Button
                variant={trueFalseAnswer === false ? 'default' : 'outline'}
                onClick={() => setTrueFalseAnswer(false)}
              >
                Faux
              </Button>
            </div>
          </div>
        );

      case 'short-answer':
        return (
          <div className="space-y-4">
            <div>
              <Label>Réponses acceptées</Label>
              {shortAnswers.map((answer, index) => (
                <div key={index} className="flex items-center gap-2 mt-2">
                  <Input
                    value={answer}
                    onChange={(e) => {
                      const newAnswers = [...shortAnswers];
                      newAnswers[index] = e.target.value;
                      setShortAnswers(newAnswers);
                    }}
                    placeholder={`Réponse ${index + 1}`}
                  />
                  {shortAnswers.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShortAnswers(shortAnswers.filter((_, i) => i !== index))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShortAnswers([...shortAnswers, ''])}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une variante
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={caseSensitive} onCheckedChange={setCaseSensitive} />
              <Label>Sensible à la casse</Label>
            </div>
          </div>
        );

      case 'long-answer':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nombre de mots minimum</Label>
                <Input
                  type="number"
                  value={minWords}
                  onChange={(e) => setMinWords(Number(e.target.value))}
                  min={0}
                />
              </div>
              <div>
                <Label>Nombre de mots maximum</Label>
                <Input
                  type="number"
                  value={maxWords}
                  onChange={(e) => setMaxWords(Number(e.target.value))}
                  min={0}
                />
              </div>
            </div>
            <div>
              <Label>Critères d'évaluation (grille)</Label>
              {rubric.map((criterion, index) => (
                <div key={index} className="flex items-center gap-2 mt-2">
                  <Input
                    value={criterion}
                    onChange={(e) => {
                      const newRubric = [...rubric];
                      newRubric[index] = e.target.value;
                      setRubric(newRubric);
                    }}
                    placeholder={`Critère ${index + 1}`}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setRubric(rubric.filter((_, i) => i !== index))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRubric([...rubric, ''])}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un critère
              </Button>
            </div>
          </div>
        );

      case 'fill-blank':
        return (
          <div className="space-y-4">
            <div>
              <Label>Texte (utilisez [blank] pour les trous)</Label>
              <Textarea
                value={blankText}
                onChange={(e) => setBlankText(e.target.value)}
                placeholder="Paris est la [blank] de la France."
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Nombre de trous détectés : {(blankText.match(/\[blank\]/g) || []).length}
              </p>
            </div>
            <div>
              <Label>Réponses pour chaque trou</Label>
              {Array.from({ length: (blankText.match(/\[blank\]/g) || []).length }).map((_, index) => (
                <Input
                  key={index}
                  value={blankAnswers[index] || ''}
                  onChange={(e) => {
                    const newAnswers = [...blankAnswers];
                    newAnswers[index] = e.target.value;
                    setBlankAnswers(newAnswers);
                  }}
                  placeholder={`Réponse pour le trou ${index + 1}`}
                  className="mt-2"
                />
              ))}
            </div>
          </div>
        );

      case 'matching':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Éléments de gauche</Label>
                {leftItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 mt-2">
                    <Input
                      value={item}
                      onChange={(e) => {
                        const newItems = [...leftItems];
                        newItems[index] = e.target.value;
                        setLeftItems(newItems);
                      }}
                      placeholder={`Élément ${index + 1}`}
                    />
                    {leftItems.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setLeftItems(leftItems.filter((_, i) => i !== index))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLeftItems([...leftItems, ''])}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </div>
              <div>
                <Label>Éléments de droite</Label>
                {rightItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 mt-2">
                    <Input
                      value={item}
                      onChange={(e) => {
                        const newItems = [...rightItems];
                        newItems[index] = e.target.value;
                        setRightItems(newItems);
                      }}
                      placeholder={`Élément ${index + 1}`}
                    />
                    {rightItems.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setRightItems(rightItems.filter((_, i) => i !== index))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRightItems([...rightItems, ''])}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </div>
            </div>
            <div>
              <Label>Associations correctes</Label>
              {/* Simplified - in production, use proper matching UI */}
              <p className="text-xs text-muted-foreground">
                Les associations seront définies automatiquement lors de l'enregistrement
              </p>
            </div>
          </div>
        );

      case 'ordering':
        return (
          <div>
            <Label>Éléments à ordonner</Label>
            {orderItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2 mt-2">
                <span className="text-sm text-muted-foreground w-8">{index + 1}.</span>
                <Input
                  value={item}
                  onChange={(e) => {
                    const newItems = [...orderItems];
                    newItems[index] = e.target.value;
                    setOrderItems(newItems);
                  }}
                  placeholder={`Élément ${index + 1}`}
                />
                {orderItems.length > 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setOrderItems(orderItems.filter((_, i) => i !== index))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOrderItems([...orderItems, ''])}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un élément
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              L'ordre correct sera l'ordre actuel de la liste
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{question ? 'Modifier la question' : 'Nouvelle question'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base mb-3 block">Type de question</Label>
          <QuestionTypeSelector
            selectedType={questionType}
            onSelectType={setQuestionType}
            availableTypes={availableTypes}
          />
        </div>

        <div>
          <Label>Question *</Label>
          <Textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Saisissez votre question..."
            rows={3}
            className="mt-2"
          />
        </div>

        <div className="border-t pt-4">
          <QuestionMediaField media={questionMedia} onChange={setQuestionMedia} />
        </div>

        {renderQuestionFields()}

        <div className="border-t pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="mb-3"
          >
            {showAdvanced ? <ChevronUp className="h-4 w-4 mr-2" /> : <ChevronDown className="h-4 w-4 mr-2" />}
            Options avancées
          </Button>

          {showAdvanced && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Points</Label>
                  <Input
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    min={1}
                  />
                </div>
                <div>
                  <Label>Difficulté</Label>
                  <Select value={difficulty} onValueChange={(v) => setDifficulty(v as DifficultyLevel)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Facile</SelectItem>
                      <SelectItem value="medium">Moyen</SelectItem>
                      <SelectItem value="hard">Difficile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Explication (optionnel)</Label>
                <Textarea
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Explication affichée après la réponse..."
                  rows={2}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={!questionText.trim() || isUploadingMedia}>
            <Save className="h-4 w-4 mr-2" />
            Enregistrer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
