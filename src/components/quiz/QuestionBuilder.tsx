import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Save, Upload, ChevronDown, ChevronUp, Video, FileText, Image as ImageIcon, Trash2, Link as LinkIcon } from 'lucide-react';
import { QuestionTypeSelector } from './QuestionTypeSelector';
import type { Question, QuestionType, DifficultyLevel } from '@/types/quiz';
import { uploadDirect } from '@/utils/upload';
import { useToast } from '@/hooks/use-toast';
import VideoPlayer from '@/components/common/VideoPlayer';
import PDFViewer from '@/components/common/PDFViewer';
import { usePresignedUrl } from '@/hooks/usePresignedUrl';
import { Progress } from '@/components/ui/progress';
import MediaPreview from './MediaPreview';

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
  const { toast } = useToast();
  const [questionType, setQuestionType] = useState<QuestionType>(question?.type || 'single-choice');
  const [questionText, setQuestionText] = useState(question?.question || '');
  const [points, setPoints] = useState(question?.points || 1);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(question?.difficulty || 'medium');
  const [explanation, setExplanation] = useState(question?.explanation || '');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Media states
  const [showMediaSection, setShowMediaSection] = useState(!!question?.media);
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'pdf' | null>(question?.media?.type || null);
  const [mediaKey, setMediaKey] = useState<string | undefined>(question?.media?.key);
  const [mediaUrl, setMediaUrl] = useState<string | undefined>(question?.media?.url);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [useMediaUrl, setUseMediaUrl] = useState(false);

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

  const handleMediaUpload = async (file: File) => {
    setIsUploadingMedia(true);
    try {
      let uploadKind: 'image' | 'video' | 'pdf';
      if (file.type.startsWith('video/')) {
        uploadKind = 'video';
        setMediaType('video');
      } else if (file.type === 'application/pdf') {
        uploadKind = 'pdf';
        setMediaType('pdf');
      } else {
        uploadKind = 'image';
        setMediaType('image');
      }

      const result = await uploadDirect(file, uploadKind, {
        onProgress: (uploaded, total) => {
          setUploadProgress((uploaded / total) * 100);
        }
      });

      setMediaKey(result.key);
      setMediaFile(file);
      toast({
        title: "✅ Média uploadé",
        description: file.name
      });
    } catch (error: any) {
      toast({
        title: "❌ Erreur d'upload",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsUploadingMedia(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveMedia = () => {
    setMediaKey(undefined);
    setMediaUrl(undefined);
    setMediaFile(null);
    setMediaType(null);
  };

  const handleSave = () => {
    let newQuestion: Question;
    const baseQuestion = {
      id: question?.id || `q-${Date.now()}`,
      question: questionText,
      points,
      difficulty,
      explanation: explanation || undefined,
      media: (mediaKey || mediaUrl) ? {
        type: mediaType!,
        key: mediaKey,
        url: mediaUrl
      } : undefined,
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
              {/* Médias par option (optionnels) */}
              <div className="mt-4">
                <Label>Médias des options (optionnel)</Label>
                {options.map((_, index) => (
                  <div key={`opt-media-${index}`} className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground w-16">Option {index + 1}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'video/*,.pdf,image/*';
                        input.onchange = async (ev: any) => {
                          const file = ev.target?.files?.[0];
                          if (!file) return;
                          try {
                            let kind: 'image' | 'video' | 'pdf';
                            if (file.type.startsWith('video/')) kind = 'video';
                            else if (file.type === 'application/pdf') kind = 'pdf';
                            else kind = 'image';
                            const res = await uploadDirect(file, kind);
                            setOptionsMedia(prev => {
                              const arr = [...prev];
                              arr[index] = { type: kind, key: res.key };
                              return arr;
                            });
                            toast({ title: '✅ Média option ajouté', description: file.name });
                          } catch (e: any) {
                            toast({ title: 'Erreur upload', description: e?.message || 'Échec upload', variant: 'destructive' });
                          }
                        };
                        input.click();
                      }}
                      title="Uploader un média"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const url = window.prompt('URL du média (image/pdf/vidéo)');
                        if (!url) return;
                        let type: 'image' | 'video' | 'pdf' = 'image';
                        const u = url.toLowerCase();
                        if (u.endsWith('.mp4') || u.includes('youtube') || u.includes('vimeo')) type = 'video';
                        else if (u.endsWith('.pdf')) type = 'pdf';
                        setOptionsMedia(prev => {
                          const arr = [...prev];
                          arr[index] = { type, url };
                          return arr;
                        });
                      }}
                      title="Lier par URL"
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                    {optionsMedia[index] && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setOptionsMedia(prev => prev.map((m, i) => i === index ? null : m))}
                        title="Supprimer le média"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                    {optionsMedia[index] && (
                      <div className="ml-2">
                        <MediaPreview
                          mediaType={optionsMedia[index]!.type}
                          mediaKey={optionsMedia[index]!.key}
                          mediaUrl={optionsMedia[index]!.url}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setOptions([...options, '']);
                }}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une option
              </Button>
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

        {/* Media Section */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-base">Média de la question (optionnel)</Label>
            <Switch
              checked={showMediaSection}
              onCheckedChange={(checked) => {
                setShowMediaSection(checked);
                if (!checked) {
                  handleRemoveMedia();
                }
              }}
            />
          </div>

          {showMediaSection && (
            <div className="space-y-4">
              {/* Media type selection */}
              {!mediaKey && !mediaUrl && (
                <div className="flex gap-2 mb-4">
                  <Button
                    type="button"
                    variant={!useMediaUrl ? "default" : "outline"}
                    size="sm"
                    className={!useMediaUrl ? "bg-pink-500 hover:bg-pink-600 text-white" : ""}
                    onClick={() => setUseMediaUrl(false)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload fichier
                  </Button>
                  <Button
                    type="button"
                    variant={useMediaUrl ? "default" : "outline"}
                    size="sm"
                    className={useMediaUrl ? "bg-purple-500 hover:bg-purple-600 text-white" : ""}
                    onClick={() => setUseMediaUrl(true)}
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Lien URL
                  </Button>
                </div>
              )}

              {/* Upload section */}
              {!useMediaUrl && !mediaKey && !mediaUrl && (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-accent/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-12 w-12 text-muted-foreground mb-3" />
                    <p className="mb-2 text-lg font-semibold text-foreground">Vidéo, PDF ou Image</p>
                    <p className="text-xs text-muted-foreground mb-2">Glissez-déposez ou cliquez pour parcourir</p>
                    <div className="mt-2 px-4 py-2 border border-input rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground inline-block">
                      Choisir un fichier
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">Limites : Vidéo (500MB) + PDF (50MB) + Image (10MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="video/*,.pdf,image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleMediaUpload(file);
                    }}
                    disabled={isUploadingMedia}
                  />
                </label>
              )}

              {/* URL input section */}
              {useMediaUrl && !mediaKey && !mediaUrl && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={mediaType === 'video' ? 'default' : 'outline'}
                      onClick={() => setMediaType('video')}
                    >
                      <Video className="h-4 w-4 mr-1" />
                      Vidéo
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={mediaType === 'pdf' ? 'default' : 'outline'}
                      onClick={() => setMediaType('pdf')}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={mediaType === 'image' ? 'default' : 'outline'}
                      onClick={() => setMediaType('image')}
                    >
                      <ImageIcon className="h-4 w-4 mr-1" />
                      Image
                    </Button>
                  </div>
                  <Input
                    placeholder="https://exemple.com/media..."
                    value={mediaUrl || ''}
                    onChange={(e) => setMediaUrl(e.target.value)}
                  />
                </div>
              )}

              {/* Upload progress */}
              {isUploadingMedia && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Upload en cours...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              {/* Media preview */}
              {(mediaKey || mediaUrl) && mediaType && (
                <div className="space-y-3">
                  <MediaPreview
                    mediaType={mediaType}
                    mediaKey={mediaKey}
                    mediaUrl={mediaUrl}
                    fileName={mediaFile?.name}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveMedia}
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer le média
                  </Button>
                </div>
              )}
            </div>
          )}
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
