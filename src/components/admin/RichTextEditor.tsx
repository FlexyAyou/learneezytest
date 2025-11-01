import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, List, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Écrivez votre contenu ici...',
  height = '200px'
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.textContent !== value) {
      editorRef.current.textContent = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      // Renvoyer seulement le texte brut, sans balises HTML
      onChange(editorRef.current.textContent || '');
    }
  };

  const insertFormatting = (prefix: string, suffix: string = prefix) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && editorRef.current?.contains(selection.anchorNode)) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      const formattedText = prefix + selectedText + suffix;
      
      range.deleteContents();
      range.insertNode(document.createTextNode(formattedText));
      
      // Mettre à jour la valeur
      if (editorRef.current) {
        onChange(editorRef.current.textContent || '');
      }
    }
    editorRef.current?.focus();
  };

  return (
    <div className="rich-text-editor border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex gap-1 p-2 border-b bg-muted">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting('**')}
          className="h-8 w-8 p-0"
          title="Gras (ajoute **texte**)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting('*')}
          className="h-8 w-8 p-0"
          title="Italique (ajoute *texte*)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting('_')}
          className="h-8 w-8 p-0"
          title="Souligné (ajoute _texte_)"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <div className="w-px h-8 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting('\n• ')}
          className="h-8 w-8 p-0"
          title="Liste à puces"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting('\n1. ')}
          className="h-8 w-8 p-0"
          title="Liste numérotée"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-4 min-h-[200px] focus:outline-none bg-background whitespace-pre-wrap"
        style={{ minHeight: height }}
        data-placeholder={placeholder}
      />

      <style>{`
        .rich-text-editor [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: hsl(var(--muted-foreground));
          pointer-events: none;
        }
        .rich-text-editor [contenteditable] {
          outline: none;
          font-family: inherit;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
