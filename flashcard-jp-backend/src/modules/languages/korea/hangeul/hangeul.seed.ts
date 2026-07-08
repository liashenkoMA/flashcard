export const HANGUL_SEED = [
  // === Basic consonants ===
  { symbol: 'ㄱ', romaji: 'g/k', group: 'basic-consonant' },
  { symbol: 'ㄴ', romaji: 'n', group: 'basic-consonant' },
  { symbol: 'ㄷ', romaji: 'd/t', group: 'basic-consonant' },
  { symbol: 'ㄹ', romaji: 'r/l', group: 'basic-consonant' },
  { symbol: 'ㅁ', romaji: 'm', group: 'basic-consonant' },
  { symbol: 'ㅂ', romaji: 'b/p', group: 'basic-consonant' },
  { symbol: 'ㅅ', romaji: 's', group: 'basic-consonant' },
  { symbol: 'ㅇ', romaji: 'ng / silent', group: 'basic-consonant' },
  { symbol: 'ㅈ', romaji: 'j', group: 'basic-consonant' },
  { symbol: 'ㅊ', romaji: 'ch', group: 'basic-consonant' },
  { symbol: 'ㅋ', romaji: 'k', group: 'basic-consonant' },
  { symbol: 'ㅌ', romaji: 't', group: 'basic-consonant' },
  { symbol: 'ㅍ', romaji: 'p', group: 'basic-consonant' },
  { symbol: 'ㅎ', romaji: 'h', group: 'basic-consonant' },

  // === Double consonants ===
  { symbol: 'ㄲ', romaji: 'kk', group: 'double-consonant', baseSymbol: 'ㄱ' },
  { symbol: 'ㄸ', romaji: 'tt', group: 'double-consonant', baseSymbol: 'ㄷ' },
  { symbol: 'ㅃ', romaji: 'pp', group: 'double-consonant', baseSymbol: 'ㅂ' },
  { symbol: 'ㅆ', romaji: 'ss', group: 'double-consonant', baseSymbol: 'ㅅ' },
  { symbol: 'ㅉ', romaji: 'jj', group: 'double-consonant', baseSymbol: 'ㅈ' },

  // === Basic vowels ===
  { symbol: 'ㅏ', romaji: 'a', group: 'basic-vowel' },
  { symbol: 'ㅑ', romaji: 'ya', group: 'basic-vowel' },
  { symbol: 'ㅓ', romaji: 'eo', group: 'basic-vowel' },
  { symbol: 'ㅕ', romaji: 'yeo', group: 'basic-vowel' },
  { symbol: 'ㅗ', romaji: 'o', group: 'basic-vowel' },
  { symbol: 'ㅛ', romaji: 'yo', group: 'basic-vowel' },
  { symbol: 'ㅜ', romaji: 'u', group: 'basic-vowel' },
  { symbol: 'ㅠ', romaji: 'yu', group: 'basic-vowel' },
  { symbol: 'ㅡ', romaji: 'eu', group: 'basic-vowel' },
  { symbol: 'ㅣ', romaji: 'i', group: 'basic-vowel' },

  // === Compound vowels ===
  { symbol: 'ㅐ', romaji: 'ae', group: 'compound-vowel' },
  { symbol: 'ㅒ', romaji: 'yae', group: 'compound-vowel' },
  { symbol: 'ㅔ', romaji: 'e', group: 'compound-vowel' },
  { symbol: 'ㅖ', romaji: 'ye', group: 'compound-vowel' },
  { symbol: 'ㅘ', romaji: 'wa', group: 'compound-vowel' },
  { symbol: 'ㅙ', romaji: 'wae', group: 'compound-vowel' },
  { symbol: 'ㅚ', romaji: 'oe', group: 'compound-vowel' },
  { symbol: 'ㅝ', romaji: 'wo', group: 'compound-vowel' },
  { symbol: 'ㅞ', romaji: 'we', group: 'compound-vowel' },
  { symbol: 'ㅟ', romaji: 'wi', group: 'compound-vowel' },
  { symbol: 'ㅢ', romaji: 'ui', group: 'compound-vowel' },
];
