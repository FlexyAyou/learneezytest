// Utilities to normalize questions for the student side
// - generate ids when missing
// - normalize options, correct_answers, correct_order
// - transform cloze (texte à trous) into textParts + holes

export type RawQuestion = any;

export type NormalizedOption = {
  id: string;
  text?: string;
  media?: any;
  originalIndex?: number;
};

export type ClozeHole = {
  id: string;
  answer?: string;
  options?: NormalizedOption[];
  order?: number;
};

export type NormalizedCloze = {
  type: 'cloze';
  textParts: string[]; // segments intercalés par trous
  holes: ClozeHole[];
};

export type NormalizedQuestion = {
  id: string;
  type: string;
  stem?: string;
  options?: NormalizedOption[];
  correctAnswers: string[];
  correctOrder?: string[];
  raw?: RawQuestion;
  cloze?: NormalizedCloze;
  [k: string]: any;
};

const uid = (): string => {
  try {
    // modern browsers / env
    // @ts-ignore
    if (typeof crypto !== 'undefined' && typeof (crypto as any).randomUUID === 'function') return (crypto as any).randomUUID();
  } catch {}
  return Math.random().toString(36).slice(2, 10);
};

const ensureArrayOfIds = (input: any): string[] => {
  if (input == null) return [];
  if (Array.isArray(input)) return input.map(i => (i && typeof i === 'object' ? String(i.id ?? i) : String(i)));
  if (typeof input === 'string') return input.includes(',') ? input.split(',').map(s => s.trim()).filter(Boolean) : [input];
  return [String(input)];
};

const normalizeOptions = (rawOptions: any[] | undefined): NormalizedOption[] => {
  if (!Array.isArray(rawOptions)) return [];
  return rawOptions.map((opt, i) => {
    if (typeof opt === 'string') return { id: `opt-${i}-${uid()}`, text: opt, originalIndex: i };
    const id = String(opt.id ?? opt.key ?? opt.uuid ?? `opt-${i}-${uid()}`);
    return { id, text: opt.text ?? opt.label ?? opt.name, media: opt.media ?? opt.url, originalIndex: i };
  });
};

const parseClozePlaceholders = (text: string) => {
  if (!text) return { parts: [''], indices: [] as number[] };
  // support several placeholder styles: {0} {{0}} [[0]] <hole:0> and [blank]
  const indexedRegex = /(?:\{\{(\d+)\}\}|\{(\d+)\}|\[\[(\d+)\]\]|<hole:(\d+)>)/g;
  const blankRegex = /\[blank\]/g;
  // try indexed placeholders first
  let lastIndex = 0;
  const parts: string[] = [];
  const indices: number[] = [];
  let m: RegExpExecArray | null;
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

  // fallback to [blank] occurrences
  lastIndex = 0;
  const tmpParts: string[] = [];
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

  return { parts: [String(text ?? '')], indices: [] as number[] };
};

const normalizeCloze = (raw: any): NormalizedCloze | null => {
  // Try to get text from various fields - in priority order
  let text: string = '';
  
  // First, check if there's explicit text with [blank] markers
  if (typeof raw?.text === 'string' && raw.text.includes('[blank]')) {
    text = raw.text;
  } else if (typeof raw?.question === 'string' && raw.question.includes('[blank]')) {
    text = raw.question;
  } else if (typeof raw?.stem === 'string' && raw.stem.includes('[blank]')) {
    text = raw.stem;
  } else {
    // Fallback: use any available text field
    text = raw?.text ?? raw?.question ?? raw?.stem ?? '';
  }

  const holesRaw: any[] = Array.isArray(raw?.holes) ? raw.holes : [];
  
  // Get correct answers from various possible field names
  const correctAnswersFromRaw: any[] = Array.isArray(raw?.correctAnswers)
    ? raw.correctAnswers
    : Array.isArray(raw?.correct_answer)
    ? raw.correct_answer
    : Array.isArray(raw?.correctAnswer)
    ? raw.correctAnswer
    : [];

  // Validation: need at least text or holes or correct answers
  if (!text && holesRaw.length === 0 && correctAnswersFromRaw.length === 0) return null;

  const { parts, indices } = parseClozePlaceholders(String(text));
  
  console.log('[normalizeCloze]', {
    textPreview: String(text).substring(0, 60),
    hasBlank: indices.length > 0,
    partCount: parts.length,
    holeCount: holesRaw.length,
    correctCount: correctAnswersFromRaw.length,
  });
  
  // Case 1: Placeholders found in text (indexed style: {0}, {{0}}, [[0]], <hole:0>) OR [blank] style
  if (indices.length > 0) {
    const holes: ClozeHole[] = indices.map((idx, order) => {
      const rawHole = holesRaw[idx] ?? {};
      const holeId = String(rawHole.id ?? rawHole.uuid ?? `hole-${idx}-${uid()}`);
      const opts = normalizeOptions(rawHole.options ?? rawHole.choices ?? []);
      const answer = rawHole.answer ?? rawHole.value ?? rawHole.correct ?? correctAnswersFromRaw[idx];
      return { id: holeId, answer, options: opts.length ? opts : undefined, order };
    });
    console.log('  → Case 1: Placeholders in text (indexed or [blank]) - holes:', holes.length);
    return { type: 'cloze', textParts: parts, holes };
  }

  // Case 2: Explicit holes array provided
  if (holesRaw.length > 0) {
    const holes = holesRaw.map((rawHole, idx) => ({ 
      id: String(rawHole.id ?? rawHole.uuid ?? `hole-${idx}-${uid()}`), 
      answer: rawHole.answer ?? rawHole.value ?? rawHole.correct ?? correctAnswersFromRaw[idx],
      options: normalizeOptions(rawHole.options ?? rawHole.choices ?? []), 
      order: idx 
    }));
    console.log('  → Case 2: Explicit holes array - holes:', holes.length);
    return { type: 'cloze', textParts: [text, ''], holes };
  }

  // Case 3: correctAnswers provided but no placeholders (auto-generate)
  if (correctAnswersFromRaw.length > 0 && text) {
    const holes = correctAnswersFromRaw.map((ans, idx) => ({
      id: `hole-${idx}-${uid()}`,
      answer: ans,
      options: undefined,
      order: idx
    }));
    console.log('  → Case 3: Auto-generated holes from correctAnswers - holes:', holes.length);
    return { type: 'cloze', textParts: [text], holes };
  }

  // Case 4: Only text provided, no answers (fallback)
  if (text) {
    console.log('  → Case 4: Only text, no answers');
    return { type: 'cloze', textParts: [text], holes: [] };
  }

  return null;
};

export const normalizeQuestions = (rawQuestions: RawQuestion[] | undefined): NormalizedQuestion[] => {
  if (!Array.isArray(rawQuestions)) return [];
  return rawQuestions.map((raw, qIdx) => {
    const qId = String(raw?.id ?? raw?.uuid ?? `q-${qIdx}-${uid()}`);
    const qType = String(raw?.type ?? raw?.kind ?? 'unknown');
    const stem = raw?.stem ?? raw?.question ?? raw?.text ?? '';

    let opts = normalizeOptions(raw?.options ?? raw?.choices ?? raw?.answers);

    // some question types supply `items` (ordering/matching) as an array of strings
    if ((!opts || opts.length === 0) && Array.isArray(raw?.items) && raw.items.length) {
      opts = raw.items.map((it: any, i: number) => (typeof it === 'string' ? { id: `opt-${i}-${uid()}`, text: it, originalIndex: i } : { id: String(it.id ?? `opt-${i}-${uid()}`), text: it.text ?? it.label ?? String(it), originalIndex: i }));
    }

    // handle true/false type when options are not provided
    const isTrueFalse = /true[-_ ]?false|truefalse|vrai[-_ ]?faux|boolean/i.test(String(raw?.type ?? raw?.kind ?? ''));
    if (isTrueFalse && (!opts || opts.length === 0)) {
      opts = [
        { id: `opt-true-${uid()}`, text: raw?.labels?.true ?? raw?.true_label ?? 'True', originalIndex: 0 },
        { id: `opt-false-${uid()}`, text: raw?.labels?.false ?? raw?.false_label ?? 'False', originalIndex: 1 },
      ];
    }

    // Gather correct answers from many possible field names
    let correctAnswers = ensureArrayOfIds(raw?.correct_answers ?? raw?.correctAnswers ?? raw?.correct_answer ?? raw?.correctAnswer ?? raw?.answer ?? raw?.answers);

    // If single boolean correct_answer present (true/false), map to our true/false option ids
    if ((raw?.correct_answer === true || raw?.correct_answer === false) && isTrueFalse) {
      correctAnswers = [raw.correct_answer ? opts[0].id : opts[1].id];
    }

    // numeric indices -> map to option ids
    if (correctAnswers.length && opts.length && correctAnswers.every(c => /^\d+$/.test(String(c)))) {
      correctAnswers = correctAnswers.map(idx => {
        const i = Number(idx);
        return opts[i] ? opts[i].id : String(idx);
      });
    }

    // string answers that match option text -> map to option ids (case-insensitive)
    if (correctAnswers.length && opts.length) {
      correctAnswers = correctAnswers.map(c => {
        const cStr = String(c ?? '').trim();
        // already an id?
        if (opts.find(o => o.id === cStr)) return cStr;
        const matched = opts.find(o => (o.text ?? '').trim().toLowerCase() === cStr.toLowerCase());
        if (matched) return matched.id;
        return cStr;
      });
    }

    let correctOrder = ensureArrayOfIds(raw?.correct_order ?? raw?.correctOrder ?? raw?.order ?? raw?.correctOrderIndices);
    if (correctOrder.length && opts.length && correctOrder.every(c => /^\d+$/.test(String(c)))) {
      correctOrder = correctOrder.map(idx => {
        const i = Number(idx);
        return opts[i] ? opts[i].id : String(idx);
      });
    }

    const normalized: NormalizedQuestion = { id: qId, type: qType, stem, options: opts, correctAnswers, correctOrder: correctOrder.length ? correctOrder : undefined, raw };

    // Detect cloze/fill-blank questions by type name
    if (/cloze|trous|texte|fill[-_]?blank/i.test(qType)) {
      const cloze = normalizeCloze(raw);
      if (cloze) {
        normalized.cloze = cloze;
      } else {
        console.warn('Question detected as fill-blank but normalizeCloze returned null:', { qId, type: qType });
      }
    }

    return normalized;
  });
};

export default normalizeQuestions;
