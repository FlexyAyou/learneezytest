import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Video, FileText, Image as ImageIcon, HelpCircle, Edit2, Trash2, Link as LinkIcon, ClipboardList } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SortableContentItemProps {
  id: string;
  type: 'lesson' | 'quiz' | 'assignment';
  title: string;
  subtitle?: string;
  fileType?: 'video' | 'pdf' | 'image' | null;
  useMediaUrl?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  children?: React.ReactNode;
}

export const SortableContentItem: React.FC<SortableContentItemProps> = ({
  id,
  type,
  title,
  subtitle,
  fileType,
  useMediaUrl,
  onEdit,
  onDelete,
  children
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getIcon = () => {
    if (type === 'quiz') {
      return <HelpCircle className="h-5 w-5 text-purple-600" />;
    }
    if (type === 'assignment') {
      return <ClipboardList className="h-5 w-5 text-orange-600" />;
    }
    if (useMediaUrl) {
      return <LinkIcon className="h-5 w-5 text-purple-600" />;
    }
    switch (fileType) {
      case 'video':
        return <Video className="h-5 w-5 text-pink-600" />;
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-600" />;
      case 'image':
        return <ImageIcon className="h-5 w-5 text-green-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getBackgroundClass = () => {
    if (type === 'quiz') {
      return 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200';
    }
    if (type === 'assignment') {
      return 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200';
    }
    return 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200';
  };

  const getTypeLabel = () => {
    if (type === 'quiz') return 'Quiz';
    if (type === 'assignment') return 'Devoir';
    return 'Leçon';
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={`${getBackgroundClass()} hover:shadow-md transition-shadow`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              {/* Drag Handle */}
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing hover:bg-white/50 rounded p-1 transition-colors"
              >
                <GripVertical className="h-5 w-5 text-gray-400" />
              </div>

              {/* Icon */}
              {getIcon()}

              {/* Title and Subtitle */}
              <div className="flex-1">
                <CardTitle className="text-base font-medium">{title}</CardTitle>
                {subtitle && (
                  <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
                )}
              </div>

              {/* Type Badge */}
              <Badge variant="secondary" className="ml-2">
                {getTypeLabel()}
              </Badge>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-1 ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                type="button"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                type="button"
                className="hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
          {children && <div className="mt-4">{children}</div>}
        </CardHeader>
      </Card>
    </div>
  );
};
