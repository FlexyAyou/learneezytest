// Utilitaire de sanitization HTML centralisé.
// Supprime balises script/style et attributs dangereux (on*, style).
// Autorise une liste réduite de balises de structure et de mise en forme.
export function sanitizeHTML(input: string): string {
  if (!input) return '';
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, 'text/html');

    // Retirer scripts & styles
    doc.querySelectorAll('script, style').forEach(el => el.remove());

    // Liste blanche minimale des balises autorisées
    const allowedTags = new Set([
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'span', 'div'
    ]);

    // Parcours des éléments
    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT, null);
    const toRemove: Element[] = [];
    while (walker.nextNode()) {
      const el = walker.currentNode as HTMLElement;
      if (!allowedTags.has(el.tagName.toLowerCase())) {
        // Remplacer les balises non autorisées par leur texte interne
        const textNode = doc.createTextNode(el.textContent || '');
        el.parentNode?.replaceChild(textNode, el);
        continue;
      }
      // Supprimer attributs dangereux
      [...el.attributes].forEach(attr => {
        const name = attr.name.toLowerCase();
        if (name.startsWith('on') || name === 'style') {
          el.removeAttribute(attr.name);
        }
      });
    }

    return doc.body.innerHTML.trim();
  } catch (e) {
    return input; // Fallback: retourner l'original en cas d'erreur
  }
}
