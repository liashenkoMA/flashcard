//=== AUTH ===
const AUTH = 'auth';
const SIGN_IN = 'signin';

//=== USER ===
const USER = 'user';
const USER_UPDATE = 'update';

//=== HIRAGANA ===
const HIRAGANA = 'hiragana';
const HIRAGANA_UPDATE = 'update';
const HIRAGANA_WEIGHT_UPDATE = 'updateweight';

//=== KATAKANA ===
const KATAKANA = 'katakana';
const KATAKANA_UPDATE = 'update';
const KATAKANA_WEIGHT_UPDATE = 'updateweight';

//=== KANJI ===
const KANJI = 'kanji';
const KANJI_ADD = 'add';
const KANJI_WEIGHT_UPDATE = 'updateweight';

//=== WORDS ===
const WORDS = 'words';
const WORDS_ADD = 'add';
const WORDS_GET_CATEGORY = 'category';
const WORDS_WEIGHT_UPDATE = 'updateweight';

// === HANGEUL ===
const HANGEUL = 'hangeul';
const HANGEUL_UPDATE = 'update';
const HANGEUL_WEIGHT_UPDATE = 'updateweight';

//=== WORDS_KO ===
const WORDS_KO = 'words-ko';
const WORDS_KO_ADD = 'add';
const WORDS_KO_GET_CATEGORY = 'category';
const WORDS_KO_WEIGHT_UPDATE = 'updateweight';

// === HANZI ===
const HANZI = 'hanzi';
const HANZI_ADD = 'add';
const HANZI_WEIGHT_UPDATE = 'updateweight';

//=== WORDS_KO ===
const WORDS_ZH = 'words-zh';
const WORDS_ZH_ADD = 'add';
const WORDS_ZH_GET_CATEGORY = 'category';
const WORDS_ZH_WEIGHT_UPDATE = 'updateweight';

export const ROUTES = {
  AUTH,
  SIGN_IN,
  USER,
  USER_UPDATE,
  HIRAGANA,
  HIRAGANA_UPDATE,
  HIRAGANA_WEIGHT_UPDATE,
  KATAKANA,
  KATAKANA_UPDATE,
  KATAKANA_WEIGHT_UPDATE,
  KANJI,
  KANJI_ADD,
  KANJI_WEIGHT_UPDATE,
  WORDS,
  WORDS_ADD,
  WORDS_GET_CATEGORY,
  WORDS_WEIGHT_UPDATE,
  HANGEUL,
  HANGEUL_UPDATE,
  HANGEUL_WEIGHT_UPDATE,
  WORDS_KO,
  WORDS_KO_ADD,
  WORDS_KO_GET_CATEGORY,
  WORDS_KO_WEIGHT_UPDATE,
  HANZI,
  HANZI_ADD,
  HANZI_WEIGHT_UPDATE,
  WORDS_ZH,
  WORDS_ZH_ADD,
  WORDS_ZH_GET_CATEGORY,
  WORDS_ZH_WEIGHT_UPDATE,
} as const;
