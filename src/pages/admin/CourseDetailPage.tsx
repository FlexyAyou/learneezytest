import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Edit, Trash2, Eye, EyeOff, Clock, BookOpen, PlayCircle, FileText, CheckCircle, XCircle, Video, Download, Users, Award, Save, Tags, ImageIcon, HelpCircle, ClipboardList } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sanitizeHTML } from '@/utils/sanitizeHTML';
import { fastAPIClient } from '@/services/fastapi-client';
import { CourseResponse, Content, AssignmentResponse } from '@/types/fastapi';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PDFViewer from '@/components/common/PDFViewer';
import { usePresignedUrl } from '@/hooks/usePresignedUrl';
import VideoPlayer from '@/components/common/VideoPlayer';
import MediaStatusBadge from '@/components/common/MediaStatusBadge';

// Component pour afficher les images
const ImageViewer: React.FC<{ imageKey?: string; imageUrl?: string; title: string }> = ({ imageKey, imageUrl, title }) => {
  const { url: presignedUrl, loading, error } = usePresignedUrl(imageKey, imageUrl);

  if (loading) {
    return (
      <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !presignedUrl) {
    return (
      <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Image non disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <img
        src={presignedUrl}
        alt={title}
        className="w-full h-auto rounded-lg"
      />
    </div>
  );
};

const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [course, setCourse] = useState<CourseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Content | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Édition désactivée sur la page de détail (lecture seule)

  // States pour les URLs de téléchargement
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [programAvailable, setProgramAvailable] = useState<boolean>(false);
  const [resources, setResources] = useState<Array<{ name: string; key?: string; size?: number; url?: string }>>([]);

  // States pour les dialogs de visualisation PDF
  const [viewingProgramPDF, setViewingProgramPDF] = useState(false);
  const [viewingResourcePDF, setViewingResourcePDF] = useState<{ name: string; index: number } | null>(null);

  // State pour la confirmation de suppression
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const loadCourse = async () => {
      if (!courseId) return;

      setLoading(true);
      setError(null);

      try {
        const courseData = await fastAPIClient.getCourse(courseId);
        setCourse(courseData);
        // Lecture seule: pas de valeurs éditables ici

        // Charger l'image de couverture avec une URL présignée (lecture)
        if (courseData.cover_key) {
          try {
            const { url } = await fastAPIClient.getPlayUrl(courseData.cover_key);
            console.debug('[CourseDetail] cover_key → play_url:', url);
            setCoverImageUrl(url);
          } catch (err) {
            console.error('Erreur chargement image de couverture:', err);
          }
        } else if (courseData.image_url) {
          // Compat: certains anciens cours ont une image_url de type /api/storage/public/<KEY>
          try {
            const match = courseData.image_url.match(/\/api\/storage\/public\/(.+)$/);
            if (match && match[1]) {
              const key = decodeURIComponent(match[1]);
              const { url } = await fastAPIClient.getPlayUrl(key);
              console.debug('[CourseDetail] image_url public → key → play_url:', { key, url });
              setCoverImageUrl(url);
            } else {
              // URL complète déjà accessible publiquement
              console.debug('[CourseDetail] image_url direct (pas de conversion):', courseData.image_url);
              setCoverImageUrl(courseData.image_url);
            }
          } catch (err) {
            console.error('Erreur fallback image_url → play_url:', err);
            setCoverImageUrl(courseData.image_url);
          }
        }

        // Vérifier la disponibilité du programme PDF
        const hasProgramPdf = !!courseData.program_pdf_key;
        setProgramAvailable(hasProgramPdf);

        // Charger les ressources pédagogiques
        try {
          const resourcesData = await fastAPIClient.listCourseResources(courseId);
          setResources(resourcesData || []);
        } catch (err) {
          console.error('Erreur chargement ressources:', err);
          setResources([]);
        }
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement du cours');
        toast({
          title: "Erreur",
          description: "Impossible de charger le cours",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId]);

  const confirmDelete = async () => {
    if (!courseId) return;

    try {
      await fastAPIClient.deleteCourse(courseId);
      toast({
        title: "✅ Cours supprimé",
        description: "Le cours a été supprimé avec succès.",
      });
      navigate('/dashboard/superadmin/courses');
    } catch (err: any) {
      toast({
        title: "❌ Erreur",
        description: "Impossible de supprimer le cours",
        variant: "destructive"
      });
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!courseId || !course) return;

    setStatusUpdating(true);
    try {
      const newStatus = course.status === 'published' ? 'draft' : 'published';
      const updatedCourse = await fastAPIClient.updateCourseStatus(courseId, newStatus);
      setCourse(updatedCourse);
      toast({
        title: newStatus === 'published' ? "✅ Cours publié" : "📝 Cours en brouillon",
        description: `Le cours est maintenant ${newStatus === 'published' ? 'visible par tous' : 'masqué du public'}.`,
      });
    } catch (err: any) {
      toast({
        title: "❌ Erreur",
        description: "Impossible de modifier le statut",
        variant: "destructive"
      });
    } finally {
      setStatusUpdating(false);
    }
  };

  // Plus d'édition du niveau, des tags ou de la catégorie depuis cette page

  // Helper pour détecter le type de contenu
  const getContentType = (lesson: Content): 'video' | 'pdf' | 'image' | 'none' => {
    // Vérifier d'abord pdf_key
    if (lesson.pdf_key) return 'pdf';

    // Puis video_key ou key
    if (lesson.video_key || lesson.key) {
      const key = lesson.video_key || lesson.key || '';
      if (key.endsWith('.pdf')) return 'pdf';
      if (/\.(jpg|jpeg|png|gif|webp)$/i.test(key)) return 'image';
      return 'video';
    }

    // Puis video_url
    if (lesson.video_url) {
      if (lesson.video_url.endsWith('.pdf')) return 'pdf';
      if (/\.(jpg|jpeg|png|gif|webp)$/i.test(lesson.video_url)) return 'image';
      return 'video';
    }

    // Enfin image_key
    if (lesson.image_key) return 'image';

    return 'none';
  };

  // Calculer les statistiques
  const totalLessons = course?.modules?.reduce((acc, mod) => acc + (mod.content?.length || 0), 0) || 0;
  const totalQuizzes = course?.modules?.reduce((acc, mod) => acc + (mod.quizzes?.length || 0), 0) || 0;
  const totalAssignments = course?.modules?.reduce((acc, mod) => {
    const anyMod: any = mod;
    const order = anyMod.order as Array<{ type: string; id: string }> | undefined;
    return acc + (order?.some(o => o.type === 'assignment') ? 1 : 0);
  }, 0) || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Chargement du cours...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/dashboard/superadmin/courses')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">{error || 'Cours introuvable'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/dashboard/superadmin/courses')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux cours
        </Button>
        <div className="flex space-x-2">
          <Button
            variant={course.status === 'published' ? 'outline' : 'default'}
            onClick={handleToggleStatus}
            disabled={statusUpdating}
            className={course.status === 'published'
              ? 'hover:bg-yellow-50 hover:text-yellow-700'
              : 'bg-green-600 hover:bg-green-700'}
          >
            {statusUpdating ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : course.status === 'published' ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Mettre en brouillon
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Publier le cours
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/superadmin/courses/${course.id}/edit`)}
            className="hover:bg-blue-50 hover:text-blue-700"
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowDeleteDialog(true)}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>

      {/* Course Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info Card */}
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-3">{course.title}</CardTitle>
                  <div className="flex items-center flex-wrap gap-2 mb-4">
                    {course.status === 'published' ? (
                      <Badge className="bg-green-500 hover:bg-green-600 text-white">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Publié
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                        <XCircle className="h-3 w-3 mr-1" />
                        Brouillon
                      </Badge>
                    )}
                    <Badge className={course.owner_type === 'learneezy'
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-purple-500 hover:bg-purple-600 text-white'}>
                      {course.owner_type === 'learneezy' ? '🏢 Learneezy' : '🎓 Organisme'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-gray-600" />
                  Description
                </h3>
                <div
                  className="content-html prose max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(course.description || '') }}
                />
              </div>

              {/* Objectifs - Juste après la description */}
              {course.objectives && Array.isArray(course.objectives) && course.objectives.length > 0 && (
                <div className="pt-4 border-t-2">
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <Award className="h-5 w-5 mr-2 text-gray-600" />
                    Objectifs pédagogiques
                  </h3>
                  <ul className="space-y-2">
                    {course.objectives.map((objective: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-600 mr-2 mt-1">✓</span>
                        <span className="text-gray-700">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Niveau - Lecture seule */}
              <div className="pt-4 border-t-2">
                <h3 className="font-semibold text-lg mb-2 flex items-center justify-between">
                  <span className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-gray-600" />
                    Niveau
                  </span>
                </h3>
                <Badge variant="outline" className="border-2 border-pink-300 text-pink-700">
                  {course.level || 'Non défini'}
                </Badge>
              </div>

              {/* Cycle et Tags - Lecture seule */}
              <div className="pt-4 border-t-2">
                <h3 className="font-semibold text-lg mb-2 flex items-center justify-between">
                  <span className="flex items-center">
                    <Tags className="h-5 w-5 mr-2 text-gray-600" />
                    Cycle & tags
                  </span>
                </h3>
                {course.learning_cycle && (
                  <p className="text-sm text-gray-600 mb-2">Cycle: <span className="font-medium">{String(course.learning_cycle).replace('_', ' ')}</span></p>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  {Array.isArray(course.levels) && course.levels.length > 0 ? (
                    course.levels.map((lvl, i) => (
                      <Badge key={i} variant="secondary" className="border-2 border-blue-200 text-blue-800">
                        {lvl}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">Aucun tag</span>
                  )}
                </div>
              </div>

              {/* Catégorie - Séparée dans son propre champ */}
              <div className="pt-4 border-t-2">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-gray-600" />
                  Catégorie
                </h3>
                {course.category ? (
                  <Badge variant="outline" className="border-2 border-purple-300 text-purple-700 text-sm">
                    {course.category}
                  </Badge>
                ) : (
                  <span className="text-sm text-gray-500">Non définie</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t-2">
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Durée totale</p>
                  <p className="font-bold text-purple-700 flex items-center justify-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration || '-'}
                  </p>
                </div>
                <div className="text-center p-3 bg-pink-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Prix</p>
                  <p className="font-bold text-pink-700 text-lg">
                    {course.price ? `${course.price}€` : 'Gratuit'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
              <CardContent className="pt-6 text-center">
                <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-900">{course.modules?.length || 0}</div>
                <p className="text-xs text-blue-700 font-medium">Modules</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
              <CardContent className="pt-6 text-center">
                <PlayCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-900">{totalLessons}</div>
                <p className="text-xs text-green-700 font-medium">Leçons</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
              <CardContent className="pt-6 text-center">
                <HelpCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-900">{totalQuizzes}</div>
                <p className="text-xs text-purple-700 font-medium">Quiz</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200">
              <CardContent className="pt-6 text-center">
                <ClipboardList className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-900">{totalAssignments}</div>
                <p className="text-xs text-orange-700 font-medium">Devoir</p>
              </CardContent>
            </Card>
          </div>

          {/* Modules */}
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Contenu du cours
              </CardTitle>
              <CardDescription>
                {course.modules?.length || 0} module(s), {totalLessons} leçon(s), {totalQuizzes} quiz
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {!course.modules || course.modules.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">Aucun module disponible</p>
                  <p className="text-sm">Ajoutez du contenu à ce cours pour commencer</p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {course.modules.map((module, index) => (
                    <AccordionItem key={index} value={`module-${index}`} className="border-2 rounded-lg mb-3 overflow-hidden">
                      <AccordionTrigger
                        className="px-4 hover:bg-gray-50"
                        onClick={async () => {
                          if (!courseId) return;
                          try {
                            const anyMod: any = module;
                            const order = anyMod.order as Array<{ type: string; id: string }> | undefined;
                            const hasAssignment = order?.some(o => o.type === 'assignment');

                            if (hasAssignment && !(anyMod.__assignment_loaded)) {
                              const moduleId = anyMod.id as string;
                              const assignment = await fastAPIClient.getAssignment(courseId, moduleId);

                              setCourse(prev => {
                                if (!prev) return prev;
                                const cloned = { ...prev } as any;
                                const mods = [...(cloned.modules || [])];
                                const target = { ...(mods[index] as any) };
                                target.assignment = assignment;
                                target.__assignment_loaded = true;
                                mods[index] = target;
                                cloned.modules = mods;
                                return cloned;
                              });
                            }
                          } catch (e) {
                            console.warn('Impossible de charger le devoir pour ce module', e);
                          }
                        }}
                      >
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center">
                            <span className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                              {index + 1}
                            </span>
                            <span className="font-semibold text-lg">{module.title}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="border-blue-300">
                              {module.content?.length || 0} leçons
                            </Badge>
                            <Badge variant="outline" className="border-purple-300">
                              <Clock className="h-3 w-3 mr-1" />
                              {module.duration}
                            </Badge>
                            {(module as any).assignment && (
                              <Badge variant="outline" className="border-orange-300 text-orange-700 flex items-center gap-1">
                                <ClipboardList className="h-3 w-3" />
                                Devoir
                              </Badge>
                            )}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="bg-gray-50">
                        <div className="space-y-4 p-4">
                          {module.description && (
                            <div className="bg-white p-4 rounded-lg border-l-4 border-pink-500 shadow-sm">
                              <div
                                className="content-html prose max-w-none text-gray-700 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: sanitizeHTML(module.description) }}
                              />
                            </div>
                          )}

                          {/* Assignment (devoir) */}
                          {(module as any).assignment && (
                            <div className="space-y-3 mt-6">
                              <h4 className="font-semibold flex items-center text-gray-900">
                                <ClipboardList className="h-5 w-5 mr-2 text-orange-600" />
                                Devoir du module
                              </h4>
                              <div className="bg-white rounded-lg border-2 border-orange-200 p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-semibold text-lg">{(module as any).assignment.title}</p>
                                    {(module as any).assignment.description && (
                                      <p className="text-sm text-gray-600 mt-1">{(module as any).assignment.description}</p>
                                    )}
                                  </div>
                                  {(module as any).assignment.settings && (
                                    <div className="text-right text-xs text-gray-600 space-y-1">
                                      {typeof (module as any).assignment.settings.passing_score === 'number' && (
                                        <div>Score minimum : {(module as any).assignment.settings.passing_score}%</div>
                                      )}
                                      {typeof (module as any).assignment.settings.max_attempts === 'number' && (
                                        <div>Essais max : {(module as any).assignment.settings.max_attempts}</div>
                                      )}
                                      {typeof (module as any).assignment.settings.time_limit === 'number' && (module as any).assignment.settings.time_limit > 0 && (
                                        <div>Limite de temps : {(module as any).assignment.settings.time_limit} min</div>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {(module as any).assignment.instructions && (
                                  <div className="bg-orange-50 border-l-4 border-orange-400 p-3 rounded">
                                    <p className="text-xs font-semibold text-orange-800 mb-1">Consignes</p>
                                    <p className="text-sm text-orange-900">{(module as any).assignment.instructions}</p>
                                  </div>
                                )}

                                {(module as any).assignment.questions && (module as any).assignment.questions.length > 0 && (
                                  <div className="space-y-3 mt-2">
                                    {(module as any).assignment.questions.map((q: any, qIndex: number) => (
                                      <div key={qIndex} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                        <p className="font-medium text-sm mb-1">
                                          <span className="bg-gray-200 text-gray-700 rounded px-2 py-0.5 text-xs mr-2">
                                            Q{qIndex + 1}
                                          </span>
                                          {q.question}
                                          {q.points && (
                                            <span className="ml-2 text-xs text-gray-500">({q.points} pt{q.points > 1 ? 's' : ''})</span>
                                          )}
                                        </p>
                                        {q.type && (
                                          <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">
                                            Type : {q.type}
                                          </p>
                                        )}
                                        {Array.isArray(q.options) && q.options.length > 0 && (
                                          <ul className="mt-1 ml-4 list-disc text-xs text-gray-700 space-y-0.5">
                                            {q.options.map((opt: string, optIndex: number) => (
                                              <li key={optIndex}>{opt}</li>
                                            ))}
                                          </ul>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Lessons */}
                          {module.content && module.content.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="font-semibold flex items-center text-gray-900">
                                <PlayCircle className="h-5 w-5 mr-2 text-green-600" />
                                Leçons ({module.content.length})
                              </h4>
                              {module.content.map((lesson, lessonIndex) => (
                                <div key={lessonIndex} className="space-y-3 bg-white rounded-lg border-2 hover:border-pink-300 transition-all">
                                  <div
                                    className="flex items-center justify-between p-4 cursor-pointer"
                                    onClick={() => setSelectedLesson(selectedLesson?.title === lesson.title ? null : lesson)}
                                  >
                                    <div className="flex items-center space-x-3">
                                      <span className="bg-green-100 text-green-700 rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold">
                                        {lessonIndex + 1}
                                      </span>
                                      <div>
                                        <p className="font-medium">{lesson.title}</p>
                                        {(lesson.video_key || lesson.key || lesson.video_url) && (() => {
                                          const contentType = getContentType(lesson);
                                          if (contentType === 'video') {
                                            return (
                                              <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="secondary" className="text-xs">
                                                  <Video className="h-3 w-3 mr-1" />
                                                  Vidéo disponible
                                                </Badge>
                                                {(lesson.video_key || lesson.key) && (
                                                  <MediaStatusBadge assetKey={lesson.video_key || lesson.key} />
                                                )}
                                              </div>
                                            );
                                          }
                                          if (contentType === 'pdf') {
                                            return (
                                              <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
                                                  <FileText className="h-3 w-3 mr-1" />
                                                  Fichier PDF disponible
                                                </Badge>
                                                {(lesson.video_key || lesson.key) && (
                                                  <MediaStatusBadge assetKey={lesson.video_key || lesson.key} />
                                                )}
                                              </div>
                                            );
                                          }
                                          if (contentType === 'image') {
                                            return (
                                              <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                                                  <ImageIcon className="h-3 w-3 mr-1" />
                                                  Image disponible
                                                </Badge>
                                                {(lesson.video_key || lesson.key) && (
                                                  <MediaStatusBadge assetKey={lesson.video_key || lesson.key} />
                                                )}
                                              </div>
                                            );
                                          }
                                          return null;
                                        })()}
                                      </div>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {lesson.duration}
                                    </Badge>
                                  </div>

                            // Construire l'ordre unifié si disponible
                            let orderedContent: Array<{
                              type: 'lesson' | 'quiz' | 'assignment';
                              data: any;
                              index: number;
                            }> = [];

                            if (module.order && Array.isArray(module.order) && module.order.length > 0) {
                              // Utiliser l'ordre défini par le backend (IDs ou objets {type, id})
                              module.order.forEach((orderItem: any) => {
                                const itemId = typeof orderItem === 'string' ? orderItem : orderItem.id;
                                const itemType = typeof orderItem === 'object' ? orderItem.type : null;

                                if (itemType === 'lesson' || !itemType) {
                                  const lessonIdx = lessons.findIndex((l) => l.id === itemId);
                                  if (lessonIdx !== -1) {
                                    orderedContent.push({
                                      type: 'lesson',
                                      data: lessons[lessonIdx],
                                      index: lessonIdx,
                                    });
                                  }
                                }

                                if (itemType === 'quiz' || !itemType) {
                                  const quizIdx = quizzes.findIndex((q) => q.id === itemId);
                                  if (quizIdx !== -1) {
                                    orderedContent.push({
                                      type: 'quiz',
                                      data: quizzes[quizIdx],
                                      index: quizIdx,
                                    });
                                  }
                                }

                                if (itemType === 'assignment') {
                                  const assignmentIdx = assignments.findIndex((a) => a.id === itemId);
                                  if (assignmentIdx !== -1) {
                                    orderedContent.push({
                                      type: 'assignment',
                                      data: assignments[assignmentIdx],
                                      index: assignmentIdx,
                                    });
                                  }
                                }
                              });

                              // Ajouter en fin de liste les contenus qui n'apparaissent pas encore dans order
                              const lessonIdsInOrder = new Set(
                                orderedContent
                                  .filter((item) => item.type === 'lesson')
                                  .map((item) => item.data.id)
                              );
                              const quizIdsInOrder = new Set(
                                orderedContent
                                  .filter((item) => item.type === 'quiz')
                                  .map((item) => item.data.id)
                              );
                              const assignmentIdsInOrder = new Set(
                                orderedContent
                                  .filter((item) => item.type === 'assignment')
                                  .map((item) => item.data.id)
                              );

                              lessons.forEach((lesson, idx) => {
                                if (lesson.id && !lessonIdsInOrder.has(lesson.id)) {
                                  orderedContent.push({ type: 'lesson', data: lesson, index: idx });
                                }
                              });

                              quizzes.forEach((quiz, idx) => {
                                if (quiz.id && !quizIdsInOrder.has(quiz.id)) {
                                  orderedContent.push({ type: 'quiz', data: quiz, index: idx });
                                }
                              });

                              assignments.forEach((assignment, idx) => {
                                if (assignment.id && !assignmentIdsInOrder.has(assignment.id)) {
                                  orderedContent.push({ type: 'assignment', data: assignment, index: idx });
                                }
                              });
                            } else {
                              // Ordre par défaut: leçons → quizzes → assignments
                              orderedContent = [
                                ...lessons.map((lesson, idx) => ({
                                  type: 'lesson' as const,
                                  data: lesson,
                                  index: idx,
                                })),
                                ...quizzes.map((quiz, idx) => ({
                                  type: 'quiz' as const,
                                  data: quiz,
                                  index: idx,
                                })),
                                ...assignments.map((assignment, idx) => ({
                                  type: 'assignment' as const,
                                  data: assignment,
                                  index: idx,
                                })),
                              ];
                            }

                            if (orderedContent.length === 0) {
                              return (
                                <div className="text-center py-8 text-gray-500">
                                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
                                  <p>Aucun contenu dans ce module</p>
                                </div>
                              );
                            }

                            return (
                              <div className="space-y-3">
                                {orderedContent.map((item, idx) => {
                                  if (item.type === 'lesson') {
                                    const lesson = item.data;
                                    return (
                                      <div key={`lesson-${idx}`} className="space-y-3 bg-white rounded-lg border-2 hover:border-pink-300 transition-all">
                                        <div
                                          className="flex items-center justify-between p-4 cursor-pointer"
                                          onClick={() => setSelectedLesson(selectedLesson?.title === lesson.title ? null : lesson)}
                                        >
                                          <div className="flex items-center space-x-3">
                                            <span className="bg-green-100 text-green-700 rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold">
                                              L{item.index + 1}
                                            </span>
                                            <div>
                                              <p className="font-medium">{lesson.title}</p>
                                              {(lesson.video_key || lesson.key || lesson.video_url) && (() => {
                                                const contentType = getContentType(lesson);
                                                if (contentType === 'video') {
                                                  return (
                                                    <div className="flex items-center gap-2 mt-1">
                                                      <Badge variant="secondary" className="text-xs">
                                                        <Video className="h-3 w-3 mr-1" />
                                                        Vidéo disponible
                                                      </Badge>
                                                      {(lesson.video_key || lesson.key) && (
                                                        <MediaStatusBadge assetKey={lesson.video_key || lesson.key} />
                                                      )}
                                                    </div>
                                                  );
                                                }
                                                if (contentType === 'pdf') {
                                                  return (
                                                    <div className="flex items-center gap-2 mt-1">
                                                      <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
                                                        <FileText className="h-3 w-3 mr-1" />
                                                        Fichier PDF disponible
                                                      </Badge>
                                                      {(lesson.video_key || lesson.key) && (
                                                        <MediaStatusBadge assetKey={lesson.video_key || lesson.key} />
                                                      )}
                                                    </div>
                                                  );
                                                }
                                                if (contentType === 'image') {
                                                  return (
                                                    <div className="flex items-center gap-2 mt-1">
                                                      <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                                                        <ImageIcon className="h-3 w-3 mr-1" />
                                                        Image disponible
                                                      </Badge>
                                                      {(lesson.video_key || lesson.key) && (
                                                        <MediaStatusBadge assetKey={lesson.video_key || lesson.key} />
                                                      )}
                                                    </div>
                                                  );
                                                }
                                                return null;
                                              })()}
                                            </div>
                                          </div>
                                          <Badge variant="outline" className="text-xs">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {lesson.duration}
                                          </Badge>
                                        </div>

                                        {selectedLesson?.title === lesson.title && (
                                          <div className="px-4 pb-4 space-y-4 border-t-2 pt-4">
                                            {lesson.description && (
                                              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                                                <h5 className="font-semibold text-sm mb-2 flex items-center text-blue-900">
                                                  <FileText className="h-4 w-4 mr-2" />
                                                  Description
                                                </h5>
                                                <div
                                                  className="content-html prose max-w-none text-sm text-gray-700 leading-relaxed"
                                                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(lesson.description) }}
                                                />
                                              </div>
                                            )}

                                            {(lesson.video_key || lesson.key || lesson.video_url) && (() => {
                                              const contentType = getContentType(lesson);

                                              if (contentType === 'pdf') {
                                                return (
                                                  <div>
                                                    <h5 className="font-semibold text-sm mb-3 flex items-center text-gray-900">
                                                      <FileText className="h-4 w-4 mr-2 text-red-600" />
                                                      Document PDF
                                                    </h5>
                                                    <PDFViewer
                                                      pdfKey={lesson.pdf_key || lesson.video_key || lesson.key}
                                                      pdfUrl={lesson.video_url}
                                                      title={lesson.title}
                                                      height="500px"
                                                    />
                                                  </div>
                                                );
                                              }

                                              if (contentType === 'image') {
                                                return (
                                                  <ImageViewer
                                                    imageKey={lesson.image_key || lesson.video_key || lesson.key}
                                                    imageUrl={lesson.video_url}
                                                    title={lesson.title}
                                                  />
                                                );
                                              }

                                              return (
                                                <div>
                                                  <h5 className="font-semibold text-sm mb-3 flex items-center text-gray-900">
                                                    <Video className="h-4 w-4 mr-2 text-pink-600" />
                                                    Vidéo de la leçon
                                                  </h5>
                                                  <VideoPlayer
                                                    videoKey={lesson.video_key || lesson.key}
                                                    videoUrl={lesson.video_url}
                                                    title={lesson.title}
                                                  />
                                                </div>
                                              );
                                            })()}

                                            {lesson.transcription && (
                                              <div className="bg-gray-100 p-4 rounded-lg border-l-4 border-gray-400">
                                                <h5 className="font-semibold text-sm mb-2 flex items-center text-gray-900">
                                                  <FileText className="h-4 w-4 mr-2" />
                                                  Transcription
                                                </h5>
                                                <p className="text-sm text-gray-700 leading-relaxed max-h-60 overflow-y-auto">
                                                  {lesson.transcription}
                                                </p>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  }

                                  if (item.type === 'quiz') {
                                    const quiz = item.data;
                                    return (
                                      <div key={`quiz-${idx}`} className="bg-white rounded-lg border-2 border-orange-200 overflow-hidden">
                                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50">
                                          <div className="flex items-center space-x-3">
                                            <span className="bg-orange-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold">
                                              Q{item.index + 1}
                                            </span>
                                            <span className="font-semibold">{quiz.title}</span>
                                          </div>
                                          <Badge variant="outline" className="border-orange-400">
                                            {quiz.questions?.length || 0} questions
                                          </Badge>
                                        </div>

                                        {quiz.questions && quiz.questions.length > 0 && (
                                          <div className="p-4 space-y-4">
                                            {quiz.questions.map((question: any, qIndex: number) => (
                                              <div key={qIndex} className="space-y-3 p-4 bg-gray-50 rounded-lg">
                                                <p className="font-semibold text-gray-900">
                                                  <span className="bg-gray-200 text-gray-700 rounded px-2 py-1 text-sm mr-2">
                                                    Q{qIndex + 1}
                                                  </span>
                                                  {question.question}
                                                </p>
                                                <div className="space-y-2 pl-4">
                                                  {question.options?.map((option: string, optIndex: number) => {
                                                    const isCorrect = option === question.correct_answer;
                                                    return (
                                                      <div
                                                        key={optIndex}
                                                        className={`text-sm p-3 rounded-lg flex items-center space-x-3 transition-all ${
                                                          isCorrect
                                                            ? 'bg-green-100 text-green-900 border-2 border-green-400 font-semibold shadow-sm'
                                                            : 'bg-white text-gray-700 border border-gray-300'
                                                        }`}
                                                      >
                                                        {isCorrect ? (
                                                          <CheckCircle className="h-5 w-5 text-green-600" />
                                                        ) : (
                                                          <XCircle className="h-5 w-5 text-gray-400" />
                                                        )}
                                                        <span>{option}</span>
                                                        {isCorrect && (
                                                          <Badge className="ml-auto bg-green-600">Réponse correcte</Badge>
                                                        )}
                                                      </div>
                                                    );
                                                  })}
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  }

                                  if (item.type === 'assignment') {
                                    const assignment = item.data;
                                    return (
                                      <div key={`assignment-${idx}`} className="bg-white rounded-lg border-2 border-purple-200 overflow-hidden">
                                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50">
                                          <div className="flex items-center space-x-3">
                                            <span className="bg-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold">
                                              <ClipboardList className="h-4 w-4" />
                                            </span>
                                            <span className="font-semibold">{assignment.title}</span>
                                          </div>
                                          <Badge variant="outline" className="border-purple-400">Devoir</Badge>
                                        </div>
                                        <div className="p-4">
                                          <p className="text-sm text-gray-600">{assignment.description || 'Devoir de fin de module'}</p>
                                        </div>
                                      </div>
                                    );
                                  }

                                  return null;
                                })}
                              </div>
                            );
                          })()}

                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Image */}
          {(coverImageUrl || course.image_url) && (
            <Card className="border-2 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
                <CardTitle className="text-sm flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  Image de couverture
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <img
                  src={coverImageUrl || course.image_url || ''}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
              </CardContent>
            </Card>
          )}

          {/* Programme de formation */}
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="text-sm flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Programme de formation
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {programAvailable ? (
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-between h-auto py-3 hover:bg-blue-50"
                    onClick={() => setViewingProgramPDF(true)}
                  >
                    <div className="flex items-center gap-2 flex-1 text-left">
                      <Eye className="h-4 w-4 flex-shrink-0 text-blue-600" />
                      <span className="text-sm truncate font-medium">Visualiser</span>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-auto py-3 hover:bg-blue-50"
                    onClick={async () => {
                      if (!course?.program_pdf_key) {
                        toast({
                          title: "❌ Erreur",
                          description: "Clé de programme introuvable",
                          variant: "destructive",
                        });
                        return;
                      }

                      try {
                        const { download_url } = await fastAPIClient.getDownloadUrl(course.program_pdf_key);
                        const link = document.createElement('a');
                        link.href = download_url;
                        link.download = 'programme-formation.pdf';
                        link.click();

                        toast({
                          title: "✅ Téléchargement démarré",
                          description: "Téléchargement du programme de formation",
                        });
                      } catch (err) {
                        console.error('Erreur téléchargement programme:', err);
                        toast({
                          title: "❌ Erreur",
                          description: "Impossible de télécharger le programme",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    <div className="flex items-center gap-2 flex-1 text-left">
                      <Download className="h-4 w-4 flex-shrink-0 text-blue-600" />
                      <span className="text-sm truncate font-medium">Télécharger</span>
                    </div>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Aucun programme disponible</p>
                  {course.status === 'draft' && (
                    <p className="text-xs mt-1">Ajoutez-le depuis la page d'édition</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="text-sm">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-4">
              <Button
                className="w-full justify-start hover:bg-blue-50"
                variant="outline"
                onClick={() => navigate(`/dashboard/superadmin/courses/${course.id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier le cours
              </Button>
              <Button
                className={`w-full justify-start ${course.status === 'published'
                  ? 'hover:bg-yellow-50'
                  : 'hover:bg-green-50'
                  }`}
                variant="outline"
                onClick={handleToggleStatus}
                disabled={statusUpdating}
              >
                {statusUpdating ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : course.status === 'published' ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Mettre en brouillon
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Publier
                  </>
                )}
              </Button>
              <Button
                className="w-full justify-start hover:bg-red-50 hover:text-red-600"
                variant="outline"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </CardContent>
          </Card>

          {/* Ressources pédagogiques */}
          {resources.length > 0 && (
            <Card className="border-2">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="text-sm flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Ressources pédagogiques ({resources.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  {resources.map((resource, index) => (
                    <div key={index} className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-between h-auto py-3 hover:bg-purple-50"
                        onClick={() => setViewingResourcePDF({ name: resource.name, index })}
                      >
                        <div className="flex items-center gap-2 flex-1 text-left">
                          <Eye className="h-4 w-4 flex-shrink-0 text-purple-600" />
                          <span className="text-sm truncate font-medium">Visualiser {resource.name}</span>
                        </div>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-between h-auto py-3 hover:bg-purple-50"
                        onClick={async () => {
                          try {
                            await fastAPIClient.downloadCourseResource(courseId, index);
                            toast({
                              title: "✅ Téléchargement démarré",
                              description: `Téléchargement de ${resource.name}`,
                            });
                          } catch (err) {
                            console.error('Erreur téléchargement:', err);
                            toast({
                              title: "❌ Erreur",
                              description: "Impossible de télécharger cette ressource",
                              variant: "destructive",
                            });
                          }
                        }}
                      >
                        <div className="flex items-center gap-2 flex-1 text-left">
                          <Download className="h-4 w-4 flex-shrink-0 text-purple-600" />
                          <span className="text-sm truncate font-medium">Télécharger</span>
                        </div>
                        {resource.size && (
                          <span className="text-xs text-muted-foreground">
                            {(resource.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
              <CardTitle className="text-sm">Métadonnées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-gray-600 font-medium">ID du cours</span>
                  <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">{course.id}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-gray-600 font-medium">Statut</span>
                  {course.status === 'published' ? (
                    <Badge className="bg-green-500 text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Publié
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-500 text-white">
                      <XCircle className="h-3 w-3 mr-1" />
                      Brouillon
                    </Badge>
                  )}
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-gray-600 font-medium">Propriétaire</span>
                  <Badge className={course.owner_type === 'learneezy'
                    ? 'bg-blue-500 text-white'
                    : 'bg-purple-500 text-white'}>
                    {course.owner_type === 'learneezy' ? '🏢 Learneezy' : '🎓 Organisme'}
                  </Badge>
                </div>
                {course.owner_id && (
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-gray-600 font-medium">ID Propriétaire</span>
                    <span className="font-mono text-xs">{course.owner_id}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog pour visualiser le programme PDF */}
      <Dialog open={viewingProgramPDF} onOpenChange={setViewingProgramPDF}>
        <DialogContent className="max-w-5xl h-[90vh]">
          <DialogHeader>
            <DialogTitle>Programme de formation</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {viewingProgramPDF && course && (
              <PDFViewer
                pdfKey={course.program_pdf_key}
                title="Programme de formation"
                height="calc(90vh - 120px)"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog pour visualiser une ressource pédagogique PDF */}
      <Dialog open={!!viewingResourcePDF} onOpenChange={() => setViewingResourcePDF(null)}>
        <DialogContent className="max-w-5xl h-[90vh]">
          <DialogHeader>
            <DialogTitle>{viewingResourcePDF?.name || 'Ressource pédagogique'}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {viewingResourcePDF && courseId && (
              <PDFViewer
                pdfKey={resources[viewingResourcePDF.index]?.key}
                pdfUrl={resources[viewingResourcePDF.index]?.url}
                title={viewingResourcePDF.name}
                height="calc(90vh - 120px)"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer définitivement ce cours ? Cette action est irréversible et supprimera tous les modules, leçons et ressources associés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CourseDetailPage;