import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HtmlTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
  className?: string;
}

const HtmlTextEditor: React.FC<HtmlTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Écrivez votre contenu ici...',
  height = '200px',
  className = ''
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  return (
    <div className={`html-text-editor border rounded-lg overflow-hidden bg-background ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/30">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('bold')}
          className="h-8 w-8 p-0 hover:bg-accent"
          title="Gras (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('italic')}
          className="h-8 w-8 p-0 hover:bg-accent"
          title="Italique (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('underline')}
          className="h-8 w-8 p-0 hover:bg-accent"
          title="Souligné (Ctrl+U)"
        >
          <Underline className="h-4 w-4" />
        </Button>

        <div className="w-px h-8 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('formatBlock', 'h1')}
          className="h-8 w-8 p-0 hover:bg-accent"
          title="Titre 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('formatBlock', 'h2')}
          className="h-8 w-8 p-0 hover:bg-accent"
          title="Titre 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <div className="w-px h-8 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('insertUnorderedList')}
          className="h-8 w-8 p-0 hover:bg-accent"
          title="Liste à puces"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('insertOrderedList')}
          className="h-8 w-8 p-0 hover:bg-accent"
          title="Liste numérotée"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-8 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('justifyLeft')}
          className="h-8 w-8 p-0 hover:bg-accent"
          title="Aligner à gauche"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('justifyCenter')}
          className="h-8 w-8 p-0 hover:bg-accent"
          title="Centrer"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('justifyRight')}
          className="h-8 w-8 p-0 hover:bg-accent"
          title="Aligner à droite"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-4 min-h-[200px] focus:outline-none bg-background prose prose-sm max-w-none"
        style={{ minHeight: height }}
        data-placeholder={placeholder}
      />

      <style>{`
        .html-text-editor [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: hsl(var(--muted-foreground));
          pointer-events: none;
        }
        .html-text-editor [contenteditable] {
          outline: none;
          font-family: inherit;
          line-height: 1.6;
        }
        .html-text-editor .prose h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0.5rem 0;
        }
        .html-text-editor .prose h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0.5rem 0;
        }
        .html-text-editor .prose ul,
        .html-text-editor .prose ol {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }
        .html-text-editor .prose li {
          margin: 0.25rem 0;
        }
      `}</style>
    </div>
  );
};

export default HtmlTextEditor;
