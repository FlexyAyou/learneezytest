import React, { useRef, useEffect, useState } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Eraser, Quote, Code, SquareCode, Undo2, Redo2, Heading1, Heading2, Heading3, Type, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { sanitizeHTML } from '@/utils/sanitizeHTML';

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
  const savedRangeRef = useRef<Range | null>(null);
  const [preferRichPaste, setPreferRichPaste] = useState<boolean>(false);
  const [toolbarState, setToolbarState] = useState({
    bold: false,
    italic: false,
    underline: false,
    ul: false,
    ol: false,
    heading: '' as '' | 'h1' | 'h2' | 'h3' | 'p' | 'pre' | 'blockquote'
  });
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const historySizesRef = useRef<number[]>([]);
  const historyBytesRef = useRef<number>(0);
  const MAX_HISTORY_BYTES = 1_000_000; // ~1MB
  const computeByteLength = (s: string) => {
    try { return new TextEncoder().encode(s).length; } catch { return s.length * 2; }
  };
  // sanitizeHTML importé depuis util (DOMPurify)

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
      // Historique
      const h = historyRef.current;
      const hs = historySizesRef.current;
      const i = historyIndexRef.current;
      // Trancher la pile si on avait fait undo puis édité
      if (i < h.length - 1) {
        const removed = h.splice(i + 1);
        const removedSizes = hs.splice(i + 1);
        historyBytesRef.current -= removedSizes.reduce((a, b) => a + b, 0);
      }
      const size = computeByteLength(clean);
      h.push(clean);
      hs.push(size);
      historyBytesRef.current += size;
      // Limite mémoire (~1MB) et borne de sécurité sur le nombre d'entrées
      while ((historyBytesRef.current > MAX_HISTORY_BYTES || h.length > 300) && h.length > 1) {
        historyBytesRef.current -= hs[0] || 0;
        hs.shift();
        h.shift();
      }
      historyIndexRef.current = h.length - 1;
    }
  };

  const handleInput = () => emitChange();
  const handleBlur = () => { setIsFocused(false); emitChange(); };
  const handleFocus = () => { setIsFocused(true); updateToolbarState(); };

  const selectionIsInsideEditor = (): boolean => {
    const editor = editorRef.current;
    if (!editor) return false;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return false;
    const range = sel.getRangeAt(0);
    const container = range.commonAncestorContainer as Node;
    return editor.contains(container.nodeType === 3 ? container.parentNode as Node : container);
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && selectionIsInsideEditor()) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (sel && savedRangeRef.current) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
  };

  const updateToolbarState = () => {
    if (disabled) return;
    // Tenter de restaurer la sélection pour interroger l'état correctement
    if (!selectionIsInsideEditor()) restoreSelection();
    let bold = false, italic = false, underline = false, ul = false, ol = false;
    let heading: '' | 'h1' | 'h2' | 'h3' | 'p' | 'pre' | 'blockquote' = '';
    try { bold = document.queryCommandState('bold'); } catch { }
    try { italic = document.queryCommandState('italic'); } catch { }
    try { underline = document.queryCommandState('underline'); } catch { }
    try { ul = document.queryCommandState('insertUnorderedList'); } catch { }
    try { ol = document.queryCommandState('insertOrderedList'); } catch { }
    // Déterminer la balise de bloc courante (heading) via selection
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      let node: Node | null = sel.getRangeAt(0).startContainer;
      if (node && node.nodeType === 3) node = node.parentNode; // texte → parent élément
      while (node && node instanceof HTMLElement) {
        const tag = node.tagName.toLowerCase();
        if (['h1', 'h2', 'h3', 'p', 'pre', 'blockquote'].includes(tag)) { heading = tag as any; break; }
        node = node.parentElement;
      }
    }
    setToolbarState({ bold, italic, underline, ul, ol, heading });
  };
  const applyHeading = (tag: 'p' | 'h1' | 'h2' | 'h3') => {
    if (disabled) return;
    editorRef.current?.focus();
    restoreSelection();
    try { document.execCommand('formatBlock', false, tag); } catch { }
    saveSelection();
    emitChange();
    updateToolbarState();
  };

  const toggleBlockquote = () => {
    if (disabled) return;
    editorRef.current?.focus();
    restoreSelection();
    // Si déjà dans un blockquote, repasse en paragraphe
    const inBq = toolbarState.heading === 'blockquote';
    try { document.execCommand('formatBlock', false, inBq ? 'p' : 'blockquote'); } catch { }
    saveSelection();
    emitChange();
    updateToolbarState();
  };

  const togglePre = () => {
    if (disabled) return;
    editorRef.current?.focus();
    restoreSelection();
    const inPre = toolbarState.heading === 'pre';
    try { document.execCommand('formatBlock', false, inPre ? 'p' : 'pre'); } catch { }
    saveSelection();
    emitChange();
    updateToolbarState();
  };

  const escapeHTML = (s: string) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));
  const toggleInlineCode = () => {
    if (disabled) return;
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    const text = sel.toString();
    // Simple wrap avec insertHTML
    document.execCommand('insertHTML', false, `<code>${escapeHTML(text)}</code>`);
    saveSelection();
    emitChange();
    updateToolbarState();
  };

  const undo = () => {
    const h = historyRef.current;
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    const html = h[historyIndexRef.current] || '';
    if (editorRef.current) {
      editorRef.current.innerHTML = html;
      lastHtmlRef.current = html;
      onChange(html);
    }
  };

  const redo = () => {
    const h = historyRef.current;
    if (historyIndexRef.current >= h.length - 1) return;
    historyIndexRef.current += 1;
    const html = h[historyIndexRef.current] || '';
    if (editorRef.current) {
      editorRef.current.innerHTML = html;
      lastHtmlRef.current = html;
      onChange(html);
    }
  };

  const exec = (command: string) => {
    if (disabled) return;
    // Restaurer la sélection avant d'exécuter la commande
    editorRef.current?.focus();
    restoreSelection();
    // Utiliser document.execCommand (déprécié mais support large)
    try { document.execCommand(command, false); } catch { /* noop */ }
    // Sauvegarder la nouvelle sélection après action
    saveSelection();
    emitChange();
    // Mettre à jour l'état de la toolbar après l'action
    updateToolbarState();
  };

  const clearFormatting = () => {
    if (disabled) return;
    exec('removeFormat');
    // Retirer listes si présentes
    try { document.execCommand('outdent'); } catch { }
    emitChange();
  };

  // Mettre à jour la toolbar quand la sélection change
  useEffect(() => {
    if (!isFocused) return;
    const handler = () => {
      saveSelection();
      updateToolbarState();
    };
    document.addEventListener('selectionchange', handler);
    return () => document.removeEventListener('selectionchange', handler);
  }, [isFocused]);

  useEffect(() => {
    // Initialiser l'historique avec la valeur initiale
    const initial = value || '';
    historyRef.current = [initial];
    const sz = computeByteLength(initial);
    historySizesRef.current = [sz];
    historyBytesRef.current = sz;
    historyIndexRef.current = 0;
  }, []);

  // Helpers: trouver le bloc courant et transformer les préfixes Markdown (#, ##, ###, >, ```)
  const getCurrentBlockElement = (): HTMLElement | null => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    let node: Node | null = sel.getRangeAt(0).startContainer;
    if (node && node.nodeType === 3) node = node.parentNode; // Text -> parent
    while (node && node instanceof HTMLElement) {
      const tag = node.tagName.toLowerCase();
      if (['p', 'div', 'li', 'h1', 'h2', 'h3', 'blockquote', 'pre'].includes(tag)) return node;
      node = node.parentElement;
    }
    return null;
  };

  const deletePrefixAtStart = (el: HTMLElement, count: number) => {
    // Supprime les 'count' premiers caractères textuels du bloc (cas simple)
    let remaining = count;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    const firstText = walker.nextNode() as Text | null;
    if (firstText && firstText.data.length >= remaining) {
      const r = document.createRange();
      r.setStart(firstText, 0);
      r.setEnd(firstText, remaining);
      r.deleteContents();
    }
  };

  const transformFromPrefix = () => {
    if (disabled) return;
    const block = getCurrentBlockElement();
    if (!block) return;
    const textStart = (block.innerText || '').slice(0, 6); // assez pour "### " ou ```

    // Ordre: ###, ##, #, >, ```
    if (/^###\s/.test(textStart)) {
      deletePrefixAtStart(block, 4);
      applyHeading('h3');
      emitChange();
      return;
    }
    if (/^##\s/.test(textStart)) {
      deletePrefixAtStart(block, 3);
      applyHeading('h2');
      emitChange();
      return;
    }
    if (/^#\s/.test(textStart)) {
      deletePrefixAtStart(block, 2);
      applyHeading('h1');
      emitChange();
      return;
    }
    if (/^>\s/.test(textStart)) {
      deletePrefixAtStart(block, 2);
      // Basculer en blockquote
      toggleBlockquote();
      emitChange();
      return;
    }
    if (/^```/.test(textStart)) {
      // Supporte ``` ou ``` + espace
      const rm = textStart.startsWith('``` ') ? 4 : 3;
      deletePrefixAtStart(block, rm);
      togglePre();
      emitChange();
      return;
    }
  };

  return (
    <div className={`rich-text-editor border rounded-lg overflow-hidden ${disabled ? 'opacity-60 pointer-events-none' : ''}`}>
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted">
        <Button type="button" aria-pressed={toolbarState.bold} variant="ghost" size="sm" className={`h-8 w-8 p-0 ${toolbarState.bold ? 'bg-primary/15 text-primary border border-primary shadow-sm' : ''}`} onClick={() => exec('bold')} title="Gras (Ctrl+B)">
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" aria-pressed={toolbarState.italic} variant="ghost" size="sm" className={`h-8 w-8 p-0 ${toolbarState.italic ? 'bg-primary/15 text-primary border border-primary shadow-sm' : ''}`} onClick={() => exec('italic')} title="Italique (Ctrl+I)">
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" aria-pressed={toolbarState.underline} variant="ghost" size="sm" className={`h-8 w-8 p-0 ${toolbarState.underline ? 'bg-primary/15 text-primary border border-primary shadow-sm' : ''}`} onClick={() => exec('underline')} title="Souligné (Ctrl+U)">
          <Underline className="h-4 w-4" />
        </Button>
        <div className="w-px h-8 bg-border mx-1" />
        <Button type="button" aria-pressed={toolbarState.ul} variant="ghost" size="sm" className={`h-8 w-8 p-0 ${toolbarState.ul ? 'bg-primary/15 text-primary border border-primary shadow-sm' : ''}`} onClick={() => exec('insertUnorderedList')} title="Liste à puces">
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" aria-pressed={toolbarState.ol} variant="ghost" size="sm" className={`h-8 w-8 p-0 ${toolbarState.ol ? 'bg-primary/15 text-primary border border-primary shadow-sm' : ''}`} onClick={() => exec('insertOrderedList')} title="Liste numérotée">
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-px h-8 bg-border mx-1" />
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={clearFormatting} title="Effacer la mise en forme">
          <Eraser className="h-4 w-4" />
        </Button>
        <div className="w-px h-8 bg-border mx-1" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className={`h-8 px-2 ${toolbarState.heading && toolbarState.heading !== 'p' ? 'bg-primary/15 text-primary border border-primary shadow-sm' : ''}`} title="Titre/Paragraphe">
              {toolbarState.heading === 'h1' ? <Heading1 className="h-4 w-4" /> : toolbarState.heading === 'h2' ? <Heading2 className="h-4 w-4" /> : toolbarState.heading === 'h3' ? <Heading3 className="h-4 w-4" /> : <Type className="h-4 w-4" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => applyHeading('p')}><Type className="h-4 w-4 mr-2" />Paragraphe</DropdownMenuItem>
            <DropdownMenuItem onClick={() => applyHeading('h3')}><Heading3 className="h-4 w-4 mr-2" />Titre 3</DropdownMenuItem>
            <DropdownMenuItem onClick={() => applyHeading('h2')}><Heading2 className="h-4 w-4 mr-2" />Titre 2</DropdownMenuItem>
            <DropdownMenuItem onClick={() => applyHeading('h1')}><Heading1 className="h-4 w-4 mr-2" />Titre 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button type="button" variant="ghost" size="sm" className={`h-8 w-8 p-0 ${toolbarState.heading === 'blockquote' ? 'bg-primary/15 text-primary border border-primary shadow-sm' : ''}`} onClick={toggleBlockquote} title="Citation">
          <Quote className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={toggleInlineCode} title="Code inline">
          <Code className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className={`h-8 w-8 p-0 ${toolbarState.heading === 'pre' ? 'bg-primary/15 text-primary border border-primary shadow-sm' : ''}`} onClick={togglePre} title="Bloc de code">
          <SquareCode className="h-4 w-4" />
        </Button>
        <div className="w-px h-8 bg-border mx-1" />
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={undo} title="Annuler (Ctrl+Z)">
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={redo} title="Rétablir (Ctrl+Y)">
          <Redo2 className="h-4 w-4" />
        </Button>
        <div className="w-px h-8 bg-border mx-1" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className={`h-8 px-2 ${preferRichPaste ? 'bg-primary/15 text-primary border border-primary shadow-sm' : ''}`} title="Mode de collage">
              <span className="text-xs font-medium">Coller</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setPreferRichPaste(false)}>Coller sans mise en forme</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPreferRichPaste(true)}>Coller avec mise en forme</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => {
            if (editorRef.current) {
              editorRef.current.innerHTML = '';
              lastHtmlRef.current = '';
              onChange('');
              historyRef.current = [''];
              historyIndexRef.current = 0;
              historyBytesRef.current = 0;
            }
          }}
          title="Effacer tout"
        >
          <Trash2 className="h-4 w-4" />
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
        onKeyUp={() => { updateToolbarState(); transformFromPrefix(); }}
        onMouseUp={updateToolbarState}
        onPaste={(e) => {
          if (!preferRichPaste) {
            // Coller en texte brut pour éviter styles externes
            e.preventDefault();
            const text = (e.clipboardData || (window as any).clipboardData).getData('text/plain');
            document.execCommand('insertText', false, text);
          } else {
            // Laisser le collage riche puis assainir l'HTML
            setTimeout(() => emitChange(), 0);
          }
        }}
        onKeyDown={(e) => {
          const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
          const mod = isMac ? e.metaKey : e.ctrlKey;
          if (mod && e.key.toLowerCase() === 'z') { e.preventDefault(); undo(); }
          if (mod && e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); }
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
        .rich-text-editor ul ul { list-style: circle; }
        .rich-text-editor ul ul ul { list-style: square; }
        .rich-text-editor ol { list-style: decimal; padding-left: 1.25rem; }
        .rich-text-editor ol ol { list-style: lower-alpha; }
        .rich-text-editor ol ol ol { list-style: lower-roman; }
        .rich-text-editor blockquote {
          border-left: 4px solid hsl(var(--muted-foreground));
          padding-left: 1rem;
          color: hsl(var(--muted-foreground));
          font-style: italic;
          margin: 0.75rem 0;
          background-color: hsl(var(--muted) / 0.2);
        }
        .dark .rich-text-editor blockquote {
          border-left-color: hsl(var(--muted-foreground));
          background-color: hsl(var(--muted) / 0.3);
          color: hsl(var(--muted-foreground));
        }
        .dark .rich-text-editor pre {
          background-color: hsl(var(--muted) / 0.25);
          border-color: hsl(var(--border));
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
