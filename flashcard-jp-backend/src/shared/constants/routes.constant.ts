//=== AUTH ===
const AUTH = 'auth';
const SIGN_IN = 'signin';

//=== USER ===
const USER = 'user';
const USER_UPDATE = 'update';

//=== HIRAGANA ===
const HIRAGANA = 'hiragana';
const HIRAGANA_UPDATE = 'update';

//=== KATAKANA ===
const KATAKANA = 'katakana';
const KATAKANA_UPDATE = 'update';

export const ROUTES = {
  AUTH,
  SIGN_IN,
  USER,
  USER_UPDATE,
  HIRAGANA,
  HIRAGANA_UPDATE,
  KATAKANA,
  KATAKANA_UPDATE,
} as const;
