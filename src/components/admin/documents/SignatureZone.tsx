import React, { useState, useCallback, useRef } from 'react';
import { SignatureField, FIELD_CONFIG } from '@/types/document-fields';
import { X, Move } from 'lucide-react';

interface SignatureZoneProps {
  field: SignatureField;
  containerWidth: number;
  containerHeight: number;
  onUpdate: (id: string, updates: Partial<SignatureField>) => void;
  onDelete: (id: string) => void;
  isActive?: boolean;
  onClick?: () => void;
}

export const SignatureZone: React.FC<SignatureZoneProps> = ({
  field,
  containerWidth,
  containerHeight,
  onUpdate,
  onDelete,
  isActive,
  onClick,
}) => {
  const config = FIELD_CONFIG[field.type];
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, fieldX: 0, fieldY: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, fieldX: field.x, fieldY: field.y };

    const handleMove = (ev: MouseEvent) => {
      const dx = ((ev.clientX - dragStart.current.x) / containerWidth) * 100;
      const dy = ((ev.clientY - dragStart.current.y) / containerHeight) * 100;
      const newX = Math.max(0, Math.min(100 - field.width, dragStart.current.fieldX + dx));
      const newY = Math.max(0, Math.min(100 - field.height, dragStart.current.fieldY + dy));
      onUpdate(field.id, { x: newX, y: newY });
    };

    const handleUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  }, [field, containerWidth, containerHeight, onUpdate]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizeStart.current = { x: e.clientX, y: e.clientY, w: field.width, h: field.height };

    const handleMove = (ev: MouseEvent) => {
      const dx = ((ev.clientX - resizeStart.current.x) / containerWidth) * 100;
      const dy = ((ev.clientY - resizeStart.current.y) / containerHeight) * 100;
      const newW = Math.max(3, Math.min(100 - field.x, resizeStart.current.w + dx));
      const newH = Math.max(3, Math.min(100 - field.y, resizeStart.current.h + dy));
      onUpdate(field.id, { width: newW, height: newH });
    };

    const handleUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  }, [field, containerWidth, containerHeight, onUpdate]);

  return (
    <div
      className={`absolute group cursor-move select-none ${isActive ? 'ring-2 ring-primary' : ''}`}
      style={{
        left: `${field.x}%`,
        top: `${field.y}%`,
        width: `${field.width}%`,
        height: `${field.height}%`,
        backgroundColor: config.color + '15',
        border: `2px ${isDragging || isResizing ? 'solid' : 'dashed'} ${config.color}`,
        borderRadius: '4px',
        zIndex: isDragging || isResizing ? 50 : 10,
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
    >
      {/* Label */}
      <div
        className="absolute -top-5 left-0 text-[10px] font-medium px-1 rounded-t whitespace-nowrap"
        style={{ backgroundColor: config.color, color: 'white' }}
      >
        {config.icon} {config.label}
      </div>

      {/* Delete button */}
      <button
        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
        onClick={(e) => { e.stopPropagation(); onDelete(field.id); }}
      >
        <X className="h-3 w-3" />
      </button>

      {/* Move icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-50 transition-opacity pointer-events-none">
        <Move className="h-4 w-4" style={{ color: config.color }} />
      </div>

      {/* Resize handle */}
      <div
        className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize z-20"
        style={{ backgroundColor: config.color, borderRadius: '0 0 3px 0' }}
        onMouseDown={handleResizeMouseDown}
      />
    </div>
  );
};
