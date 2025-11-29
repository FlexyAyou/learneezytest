// Simple test to verify cloze normalization logic

const testClozeData = {
  id: 'q-5',
  type: 'fill-blank',
  stem: 'Texte à trous 1 — Informatique',
  question: 'La [blank] est l\'unité de base de l\'information en informatique.',
  correct_answer: ['bit', 'byte'],
  correctAnswers: ['bit', 'byte'],
  holes: [
    { id: 'h1', answer: 'bit', options: [] },
    { id: 'h2', answer: 'byte', options: [] }
  ]
};

// Test parseClozePlaceholders
const parseClozePlaceholders = (text) => {
  if (!text) return { parts: [''], indices: [] };
  const indexedRegex = /(?:\{\{(\d+)\}\}|\{(\d+)\}|\[\[(\d+)\]\]|<hole:(\d+)>)/g;
  const blankRegex = /\[blank\]/g;
  
  let lastIndex = 0;
  const parts = [];
  const indices = [];
  let m;
  
  while ((m = indexedRegex.exec(text)) !== null) {
    parts.push(text.slice(lastIndex, m.index));
    const found = m[1] ?? m[2] ?? m[3] ?? m[4];
    indices.push(Number(found));
    lastIndex = indexedRegex.lastIndex;
  }
  
  if (indices.length > 0) {
    parts.push(text.slice(lastIndex));
    return { parts, indices };
  }

  lastIndex = 0;
  const tmpParts = [];
  let partIdx = 0;
  while ((m = blankRegex.exec(text)) !== null) {
    tmpParts.push(text.slice(lastIndex, m.index));
    indices.push(partIdx);
    lastIndex = blankRegex.lastIndex;
    partIdx += 1;
  }
  
  if (indices.length > 0) {
    tmpParts.push(text.slice(lastIndex));
    return { parts: tmpParts, indices };
  }

  return { parts: [String(text ?? '')], indices: [] };
};

console.log('Test cloze normalization:');
console.log('======================');

const testText = 'La [blank] est l\'unité de base de l\'information en informatique.';
const result = parseClozePlaceholders(testText);
console.log('Input text:', testText);
console.log('Parsed result:', result);
console.log('Has [blank] placeholders:', result.indices.length > 0);
console.log('Parts:', result.parts);
console.log('Indices:', result.indices);

// Expected: parts should be ["La ", " est l'unité de base de l'information en informatique."]
// Expected: indices should be [0]
