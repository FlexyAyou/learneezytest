import React, { useRef, useEffect, useState } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Eraser } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
  disabled?: boolean;
}

/**
 * Éditeur riche minimaliste basé sur contentEditable.
 * - Applique des balises HTML réelles (<strong>, <em>, <u>, <ul>/<ol>) via execCommand (compatibilité large).
 * - Stocke et remonte du HTML nettoyé (sanitisation basique) au parent.
 * - Tolère du texte brut existant (migration depuis ancienne implémentation) et le convertit en HTML.
 * - Pas de dépendances externes lourdes (Quill/Tiptap) pour rester léger.
 */
const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Écrivez votre contenu ici...',
  height = '200px',
  disabled = false,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const lastHtmlRef = useRef<string>('');

  // Sanitize HTML (simple, évite scripts/événements). Pour besoins avancés: intégrer DOMPurify.
  const sanitizeHTML = (html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    // Retirer scripts & styles
    doc.querySelectorAll('script, style').forEach(n => n.remove());
    // Retirer attributs dangereux
    doc.querySelectorAll('*').forEach(el => {
      [...el.attributes].forEach(attr => {
        if (/^on/i.test(attr.name) || attr.name === 'style') {
          el.removeAttribute(attr.name);
        }
      });
    });
    return doc.body.innerHTML
      .replace(/\u200B/g, '') // zero-width
      .trim();
  };

  // Initial / external value sync
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const incoming = value || '';
    const isPlainText = incoming && !/[<][a-z][\s\S]*[>]/i.test(incoming); // heuristique très simple
    const normalized = isPlainText ? incoming.replace(/\n/g, '<br>') : incoming;
    if (!isFocused && normalized !== lastHtmlRef.current) {
      editor.innerHTML = normalized;
      lastHtmlRef.current = normalized;
    }
  }, [value, isFocused]);

  const emitChange = () => {
    const editor = editorRef.current;
    if (!editor) return;
    const raw = editor.innerHTML;
    const clean = sanitizeHTML(raw);
    if (clean !== lastHtmlRef.current) {
      lastHtmlRef.current = clean;
      onChange(clean);
    }
  };

  const handleInput = () => emitChange();
  const handleBlur = () => { setIsFocused(false); emitChange(); };
  const handleFocus = () => setIsFocused(true);

  const exec = (command: string) => {
    if (disabled) return;
    editorRef.current?.focus();
    // Utiliser document.execCommand (déprécié mais support large)
    try { document.execCommand(command, false); } catch { /* noop */ }
    emitChange();
  };

  const clearFormatting = () => {
    if (disabled) return;
    exec('removeFormat');
    // Retirer listes si présentes
    try { document.execCommand('outdent'); } catch { }
    emitChange();
  };

  return (
    <div className={`rich-text-editor border rounded-lg overflow-hidden ${disabled ? 'opacity-60 pointer-events-none' : ''}`}>
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted">
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => exec('bold')} title="Gras (Ctrl+B)">
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => exec('italic')} title="Italique (Ctrl+I)">
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => exec('underline')} title="Souligné (Ctrl+U)">
          <Underline className="h-4 w-4" />
        </Button>
        <div className="w-px h-8 bg-border mx-1" />
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => exec('insertUnorderedList')} title="Liste à puces">
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => exec('insertOrderedList')} title="Liste numérotée">
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-px h-8 bg-border mx-1" />
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={clearFormatting} title="Effacer la mise en forme">
          <Eraser className="h-4 w-4" />
        </Button>
      </div>

      <div
        ref={editorRef}
        className="p-4 min-h-[200px] focus:outline-none bg-background prose prose-sm max-w-none dark:prose-invert"
        style={{ minHeight: height }}
        contentEditable={!disabled}
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={handleInput}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onPaste={(e) => {
          // Coller en texte brut pour éviter styles externes
          e.preventDefault();
          const text = (e.clipboardData || (window as any).clipboardData).getData('text/plain');
          document.execCommand('insertText', false, text);
        }}
      />

      <style>{`
        .rich-text-editor [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: hsl(var(--muted-foreground));
          pointer-events: none;
          display: block;
        }
        .rich-text-editor [contenteditable] {
          outline: none;
          line-height: 1.5;
          font-family: inherit;
          word-break: break-word;
        }
        .rich-text-editor ul { list-style: disc; padding-left: 1.25rem; }
        .rich-text-editor ol { list-style: decimal; padding-left: 1.25rem; }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
