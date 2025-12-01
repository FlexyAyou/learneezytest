// Test complet de normalisation des questions de type cloze
// Simulate the normalizeQuestions function

const uid = () => Math.random().toString(36).slice(2, 10);

const normalizeOptions = (rawOptions) => {
  if (!Array.isArray(rawOptions)) return [];
  return rawOptions.map((opt, i) => {
    if (typeof opt === 'string') return { id: `opt-${i}-${uid()}`, text: opt, originalIndex: i };
    const id = String(opt.id ?? opt.key ?? opt.uuid ?? `opt-${i}-${uid()}`);
    return { id, text: opt.text ?? opt.label ?? opt.name, media: opt.media ?? opt.url, originalIndex: i };
  });
};

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

const ensureArrayOfIds = (input) => {
  if (input == null) return [];
  if (Array.isArray(input)) return input.map(i => (i && typeof i === 'object' ? String(i.id ?? i) : String(i)));
  if (typeof input === 'string') return input.includes(',') ? input.split(',').map(s => s.trim()).filter(Boolean) : [input];
  return [String(input)];
};

const normalizeCloze = (raw) => {
  const text = raw?.text ?? raw?.stem ?? raw?.question ?? '';
  const holesRaw = Array.isArray(raw?.holes) ? raw.holes : [];
  const correctAnswersFromRaw = Array.isArray(raw?.correctAnswers)
    ? raw.correctAnswers
    : Array.isArray(raw?.correct_answer)
    ? raw.correct_answer
    : Array.isArray(raw?.correctAnswer)
    ? raw.correctAnswer
    : [];

  console.log('  normalizeCloze input:', { text: text.substring(0, 50), holesRaw: holesRaw.length, correctAnswersFromRaw });

  if (!text && holesRaw.length === 0 && correctAnswersFromRaw.length === 0) return null;

  const { parts, indices } = parseClozePlaceholders(String(text));
  console.log('  parseClozePlaceholders result:', { parts: parts.length, indices });

  if (indices.length > 0) {
    const holes = indices.map((idx, order) => {
      const rawHole = holesRaw[idx] ?? {};
      const holeId = String(rawHole.id ?? rawHole.uuid ?? `hole-${idx}-${uid()}`);
      const opts = normalizeOptions(rawHole.options ?? rawHole.choices ?? []);
      const answer = rawHole.answer ?? rawHole.value ?? rawHole.correct ?? correctAnswersFromRaw[idx];
      return { id: holeId, answer, options: opts.length ? opts : undefined, order };
    });
    console.log('  Case 1: indexed placeholders - holes:', holes.length);
    return { type: 'cloze', textParts: parts, holes };
  }

  if (correctAnswersFromRaw.length > 0 && parts.length > 1) {
    const holes = correctAnswersFromRaw.map((ans, idx) => ({
      id: `hole-${idx}-${uid()}`,
      answer: ans,
      options: normalizeOptions((raw?.options ?? raw?.choices ?? [])[idx] ?? raw?.options ?? []),
      order: idx
    }));
    console.log('  Case 2: [blank] placeholders - holes:', holes.length);
    return { type: 'cloze', textParts: parts, holes };
  }

  if (holesRaw.length > 0) {
    const holes = holesRaw.map((rawHole, idx) => ({
      id: String(rawHole.id ?? rawHole.uuid ?? `hole-${idx}-${uid()}`),
      answer: rawHole.answer ?? rawHole.value ?? rawHole.correct ?? correctAnswersFromRaw[idx],
      options: normalizeOptions(rawHole.options ?? rawHole.choices ?? []),
      order: idx
    }));
    console.log('  Case 3: explicit holes - holes:', holes.length);
    return { type: 'cloze', textParts: [text, ''], holes };
  }

  if (correctAnswersFromRaw.length > 0 && text) {
    const holes = correctAnswersFromRaw.map((ans, idx) => ({
      id: `hole-${idx}-${uid()}`,
      answer: ans,
      options: undefined,
      order: idx
    }));
    console.log('  Case 4: auto-generated holes - holes:', holes.length);
    return { type: 'cloze', textParts: [text], holes };
  }

  if (text) {
    console.log('  Case 5: only text, no answers');
    return { type: 'cloze', textParts: [text], holes: [] };
  }

  return null;
};

// TEST CASE 1: [blank] style with correct_answer
console.log('\n=== TEST CASE 1: [blank] with correct_answer ===');
const testCase1 = {
  id: 'q-5',
  type: 'fill-blank',
  stem: 'Texte à trous 1 — Informatique',
  question: 'La [blank] est l\'unité de base de l\'information en informatique.',
  correct_answer: ['bit']
};
const result1 = normalizeCloze(testCase1);
console.log('Result:', result1 ? { holes: result1.holes.length, parts: result1.textParts.length } : null);

// TEST CASE 2: text field with [blank]
console.log('\n=== TEST CASE 2: text field with [blank] ===');
const testCase2 = {
  id: 'q-5',
  type: 'fill-blank',
  text: 'La [blank] est l\'unité de base.',
  correctAnswers: ['bit']
};
const result2 = normalizeCloze(testCase2);
console.log('Result:', result2 ? { holes: result2.holes.length, parts: result2.textParts.length } : null);

// TEST CASE 3: No [blank] but has correctAnswers
console.log('\n=== TEST CASE 3: No [blank] but has correctAnswers ===');
const testCase3 = {
  id: 'q-5',
  type: 'fill-blank',
  question: 'La _____ est l\'unité de base.',
  correctAnswers: ['bit']
};
const result3 = normalizeCloze(testCase3);
console.log('Result:', result3 ? { holes: result3.holes.length, parts: result3.textParts.length } : null);

console.log('\n✅ All tests completed');
