// Utilitaire de sanitization HTML centralisé, basé sur DOMPurify (plus robuste).
import DOMPurify from 'dompurify';

export function sanitizeHTML(input: string): string {
  if (!input) return '';
  const ALLOWED_TAGS = [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li',
    'blockquote', 'code', 'pre', 'span', 'div',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
  ];
  // Par défaut DOMPurify supprime scripts, event handlers et style; on garde ça
  const clean = DOMPurify.sanitize(input, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ['class'], // on garde 'class' pour prose/content-html éventuelles
    RETURN_TRUSTED_TYPE: false
  }) as string;
  return (clean || '').trim();
}
