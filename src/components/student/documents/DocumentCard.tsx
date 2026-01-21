
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Download, 
  Eye, 
  FileSignature, 
  CheckCircle,
  Clock,
  FileText,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DocumentStatus {
  status: 'pending' | 'available' | 'signed' | 'completed' | 'received';
  requiresSignature?: boolean;
}

export interface DocumentCardProps {
  id: string;
  name: string;
  type: string;
  typeLabel: string;
  typeIcon: React.ElementType;
  typeColor: string;
  date: string;
  size: string;
  status: DocumentStatus['status'];
  requiresSignature?: boolean;
  onSign?: () => void;
  onDownload?: () => void;
  onPreview?: () => void;
}

const statusConfig = {
  pending: {
    variant: 'outline' as const,
    label: 'En attente',
    icon: Clock,
    className: 'text-gray-500 border-gray-200'
  },
  available: {
    variant: 'secondary' as const,
    label: 'À signer',
    icon: AlertCircle,
    className: 'text-amber-700 bg-amber-100 border-amber-200'
  },
  signed: {
    variant: 'default' as const,
    label: 'Signé',
    icon: CheckCircle,
    className: 'text-green-700 bg-green-100 border-green-200'
  },
  completed: {
    variant: 'default' as const,
    label: 'Complété',
    icon: CheckCircle,
    className: 'text-green-700 bg-green-100 border-green-200'
  },
  received: {
    variant: 'outline' as const,
    label: 'Reçu',
    icon: FileText,
    className: 'text-blue-700 bg-blue-50 border-blue-200'
  }
};

export const DocumentCard = ({
  id,
  name,
  type,
  typeLabel,
  typeIcon: TypeIcon,
  typeColor,
  date,
  size,
  status,
  requiresSignature,
  onSign,
  onDownload,
  onPreview
}: DocumentCardProps) => {
  const statusInfo = statusConfig[status];
  const StatusIcon = statusInfo.icon;
  const needsSignature = requiresSignature && status === 'available';

  return (
    <Card className={cn(
      "p-4 transition-all duration-200 hover:shadow-md border-l-4",
      needsSignature 
        ? "border-l-amber-400 bg-amber-50/30 hover:bg-amber-50/50" 
        : status === 'signed' || status === 'completed'
          ? "border-l-green-400"
          : "border-l-gray-300"
    )}>
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className={cn(
          "p-2.5 rounded-xl",
          needsSignature ? "bg-amber-100" : "bg-gray-100"
        )}>
          <TypeIcon className={cn("h-5 w-5", typeColor)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium text-gray-900 truncate">{name}</p>
            {needsSignature && (
              <Badge variant="outline" className="text-xs bg-amber-100 text-amber-700 border-amber-300">
                <FileSignature className="h-3 w-3 mr-1" />
                Signature requise
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            {typeLabel} • {size} • {date}
          </p>
        </div>

        {/* Status badge */}
        <Badge 
          variant={statusInfo.variant} 
          className={cn("gap-1 shrink-0", statusInfo.className)}
        >
          <StatusIcon className="h-3 w-3" />
          {statusInfo.label}
        </Badge>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {needsSignature && onSign && (
            <Button 
              size="sm" 
              onClick={onSign}
              className="bg-pink-600 hover:bg-pink-700 gap-1.5"
            >
              <FileSignature className="h-4 w-4" />
              Signer
            </Button>
          )}
          
          {onPreview && (
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={onPreview}
              className="h-8 w-8 text-gray-500 hover:text-gray-700"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          
          {onDownload && status !== 'pending' && (
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={onDownload}
              className="h-8 w-8 text-gray-500 hover:text-gray-700"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
