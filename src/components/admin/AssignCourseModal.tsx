import React, { useState, useMemo } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Search,
    BookOpen,
    Clock,
    CheckCircle,
    Plus,
    User,
    Loader2,
    AlertCircle,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fastAPIClient } from '@/services/fastapi-client';
import { CourseResponse } from '@/types/fastapi';
import { useAdminEnrollCourse } from '@/hooks/useApi';

interface AssignCourseModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** The learner to assign a course to */
    learner: {
        id: number;
        nom: string;
        prenom: string;
        email: string;
    } | null;
    /** IDs of courses already enrolled (to disable re-assignment) */
    enrolledCourseIds?: string[];
}

export const AssignCourseModal = ({
    open,
    onOpenChange,
    learner,
    enrolledCourseIds = [],
}: AssignCourseModalProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

    const adminEnroll = useAdminEnrollCourse();

    // Fetch published courses for the OF
    const { data: coursesData, isLoading: isLoadingCourses } = useQuery({
        queryKey: ['courses', 'published', 'assign'],
        queryFn: async () => {
            const response = await fastAPIClient.getCourses({
                status: 'published',
                page: 1,
                per_page: 100,
            });
            return response.items;
        },
        enabled: open,
    });

    const courses = coursesData || [];

    // Filter courses by search
    const filteredCourses = useMemo(() => {
        if (!searchQuery) return courses;
        const q = searchQuery.toLowerCase();
        return courses.filter(
            (c) =>
                c.title.toLowerCase().includes(q) ||
                c.description?.toLowerCase().includes(q)
        );
    }, [courses, searchQuery]);

    const handleAssign = async () => {
        if (!learner || !selectedCourseId) return;

        await adminEnroll.mutateAsync({
            courseId: selectedCourseId,
            userId: learner.id,
        });

        // Close modal on success
        setSelectedCourseId(null);
        setSearchQuery('');
        onOpenChange(false);
    };

    const handleClose = (newOpen: boolean) => {
        if (!newOpen) {
            setSelectedCourseId(null);
            setSearchQuery('');
        }
        onOpenChange(newOpen);
    };

    if (!learner) return null;

    const isAlreadyEnrolled = (courseId: string) =>
        enrolledCourseIds.includes(courseId);

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[85vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 bg-blue-100 rounded-xl">
                            <Plus className="h-5 w-5 text-blue-600" />
                        </div>
                        Assigner un cours
                    </DialogTitle>
                    <DialogDescription>
                        <span className="flex items-center gap-2 mt-1">
                            <User className="h-4 w-4" />
                            Apprenant : <strong>{learner.prenom} {learner.nom}</strong> ({learner.email})
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher un cours..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Course List */}
                    <ScrollArea className="h-[400px] pr-4">
                        {isLoadingCourses ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : filteredCourses.length === 0 ? (
                            <div className="text-center py-12">
                                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                                <p className="text-muted-foreground">
                                    {searchQuery
                                        ? 'Aucun cours ne correspond à votre recherche'
                                        : 'Aucun cours publié disponible'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredCourses.map((course) => {
                                    const enrolled = isAlreadyEnrolled(course.id);
                                    const isSelected = selectedCourseId === course.id;

                                    return (
                                        <Card
                                            key={course.id}
                                            className={`cursor-pointer transition-all duration-200 ${enrolled
                                                    ? 'opacity-50 cursor-not-allowed border-green-200 bg-green-50/50'
                                                    : isSelected
                                                        ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-200'
                                                        : 'hover:border-blue-300 hover:shadow-sm'
                                                }`}
                                            onClick={() => {
                                                if (!enrolled) {
                                                    setSelectedCourseId(isSelected ? null : course.id);
                                                }
                                            }}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex items-start gap-4">
                                                    {/* Thumbnail */}
                                                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                                                        {course.image_url ||
                                                            (course.thumbnails && course.thumbnails.length > 0) ? (
                                                            <img
                                                                src={course.image_url || course.thumbnails![0]}
                                                                alt={course.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                                                                <BookOpen className="h-6 w-6 text-blue-400" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <h4 className="font-semibold text-foreground line-clamp-1">
                                                                {course.title}
                                                            </h4>
                                                            {enrolled && (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="bg-green-100 text-green-700 flex-shrink-0"
                                                                >
                                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                                    Déjà assigné
                                                                </Badge>
                                                            )}
                                                            {isSelected && !enrolled && (
                                                                <Badge className="bg-blue-600 text-white flex-shrink-0">
                                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                                    Sélectionné
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                                                            {course.description}
                                                        </p>
                                                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {course.duration || 'Flexible'}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <BookOpen className="h-3 w-3" />
                                                                {course.modules?.length || 0} modules
                                                            </span>
                                                            {course.level && (
                                                                <Badge variant="outline" className="text-xs px-1.5 py-0">
                                                                    {course.level}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </ScrollArea>
                </div>

                <DialogFooter className="gap-2 sm:gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleClose(false)}
                        disabled={adminEnroll.isPending}
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={handleAssign}
                        disabled={!selectedCourseId || adminEnroll.isPending}
                        className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {adminEnroll.isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Assignation...
                            </>
                        ) : (
                            <>
                                <Plus className="h-4 w-4" />
                                Assigner le cours
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
