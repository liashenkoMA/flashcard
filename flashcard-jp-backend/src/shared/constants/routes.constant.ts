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

//=== WORDS ===
const WORDS = 'words';
const WORDS_ADD = 'add';
const WORDS_GET_CATEGORY = 'category';

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
  WORDS,
  WORDS_ADD,
  WORDS_GET_CATEGORY,
} as const;
