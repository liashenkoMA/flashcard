export const HIRAGANA_SEED = [
  // === ГЛАСНЫЕ ===
  { symbol: 'あ', romaji: 'a', group: 'a' },
  { symbol: 'い', romaji: 'i', group: 'a' },
  { symbol: 'う', romaji: 'u', group: 'a' },
  { symbol: 'え', romaji: 'e', group: 'a' },
  { symbol: 'お', romaji: 'o', group: 'a' },

  // === K ===
  { symbol: 'か', romaji: 'ka', group: 'k' },
  { symbol: 'き', romaji: 'ki', group: 'k' },
  { symbol: 'く', romaji: 'ku', group: 'k' },
  { symbol: 'け', romaji: 'ke', group: 'k' },
  { symbol: 'こ', romaji: 'ko', group: 'k' },

  // Dakuten
  { symbol: 'が', romaji: 'ga', group: 'k', type: 'dakuten' },
  { symbol: 'ぎ', romaji: 'gi', group: 'k', type: 'dakuten' },
  { symbol: 'ぐ', romaji: 'gu', group: 'k', type: 'dakuten' },
  { symbol: 'げ', romaji: 'ge', group: 'k', type: 'dakuten' },
  { symbol: 'ご', romaji: 'go', group: 'k', type: 'dakuten' },

  // === S ===
  { symbol: 'さ', romaji: 'sa', group: 's' },
  { symbol: 'し', romaji: 'shi', group: 's' },
  { symbol: 'す', romaji: 'su', group: 's' },
  { symbol: 'せ', romaji: 'se', group: 's' },
  { symbol: 'そ', romaji: 'so', group: 's' },

  { symbol: 'ざ', romaji: 'za', group: 's', type: 'dakuten' },
  { symbol: 'じ', romaji: 'ji', group: 's', type: 'dakuten' },
  { symbol: 'ず', romaji: 'zu', group: 's', type: 'dakuten' },
  { symbol: 'ぜ', romaji: 'ze', group: 's', type: 'dakuten' },
  { symbol: 'ぞ', romaji: 'zo', group: 's', type: 'dakuten' },

  // === T ===
  { symbol: 'た', romaji: 'ta', group: 't' },
  { symbol: 'ち', romaji: 'chi', group: 't' },
  { symbol: 'つ', romaji: 'tsu', group: 't' },
  { symbol: 'て', romaji: 'te', group: 't' },
  { symbol: 'と', romaji: 'to', group: 't' },

  { symbol: 'だ', romaji: 'da', group: 't', type: 'dakuten' },
  { symbol: 'ぢ', romaji: 'ji', group: 't', type: 'dakuten' },
  { symbol: 'づ', romaji: 'zu', group: 't', type: 'dakuten' },
  { symbol: 'で', romaji: 'de', group: 't', type: 'dakuten' },
  { symbol: 'ど', romaji: 'do', group: 't', type: 'dakuten' },

  // === N ===
  { symbol: 'な', romaji: 'na', group: 'n' },
  { symbol: 'に', romaji: 'ni', group: 'n' },
  { symbol: 'ぬ', romaji: 'nu', group: 'n' },
  { symbol: 'ね', romaji: 'ne', group: 'n' },
  { symbol: 'の', romaji: 'no', group: 'n' },

  // === H ===
  { symbol: 'は', romaji: 'ha', group: 'h' },
  { symbol: 'ひ', romaji: 'hi', group: 'h' },
  { symbol: 'ふ', romaji: 'fu', group: 'h' },
  { symbol: 'へ', romaji: 'he', group: 'h' },
  { symbol: 'ほ', romaji: 'ho', group: 'h' },

  { symbol: 'ば', romaji: 'ba', group: 'h', type: 'dakuten' },
  { symbol: 'び', romaji: 'bi', group: 'h', type: 'dakuten' },
  { symbol: 'ぶ', romaji: 'bu', group: 'h', type: 'dakuten' },
  { symbol: 'べ', romaji: 'be', group: 'h', type: 'dakuten' },
  { symbol: 'ぼ', romaji: 'bo', group: 'h', type: 'dakuten' },

  // === Handakuten ===
  {
    symbol: 'ぱ',
    romaji: 'pa',
    group: 'h',
    type: 'handakuten',
  },
  {
    symbol: 'ぴ',
    romaji: 'pi',
    group: 'h',
    type: 'handakuten',
  },
  {
    symbol: 'ぷ',
    romaji: 'pu',
    group: 'h',
    type: 'handakuten',
  },
  {
    symbol: 'ぺ',
    romaji: 'pe',
    group: 'h',
    type: 'handakuten',
  },
  {
    symbol: 'ぽ',
    romaji: 'po',
    group: 'h',
    type: 'handakuten',
  },

  // === M ===
  { symbol: 'ま', romaji: 'ma', group: 'm' },
  { symbol: 'み', romaji: 'mi', group: 'm' },
  { symbol: 'む', romaji: 'mu', group: 'm' },
  { symbol: 'め', romaji: 'me', group: 'm' },
  { symbol: 'も', romaji: 'mo', group: 'm' },

  // === Y ===
  { symbol: 'や', romaji: 'ya', group: 'y' },
  { symbol: 'ゆ', romaji: 'yu', group: 'y' },
  { symbol: 'よ', romaji: 'yo', group: 'y' },

  // === R ===
  { symbol: 'ら', romaji: 'ra', group: 'r' },
  { symbol: 'り', romaji: 'ri', group: 'r' },
  { symbol: 'る', romaji: 'ru', group: 'r' },
  { symbol: 'れ', romaji: 're', group: 'r' },
  { symbol: 'ろ', romaji: 'ro', group: 'r' },

  // === W ===
  { symbol: 'わ', romaji: 'wa', group: 'w' },
  { symbol: 'を', romaji: 'wo', group: 'w' },

  // === N ===
  { symbol: 'ん', romaji: 'n', group: 'n' },

  // === МАЛЕНЬКИЕ ===
  { symbol: 'ゃ', romaji: 'ya', group: 'y', isSmall: true },
  { symbol: 'ゅ', romaji: 'yu', group: 'y', isSmall: true },
  { symbol: 'ょ', romaji: 'yo', group: 'y', isSmall: true },

  // === COMBO (полный набор) ===
  { symbol: 'きゃ', romaji: 'kya', type: 'combo' },
  { symbol: 'きゅ', romaji: 'kyu', type: 'combo' },
  { symbol: 'きょ', romaji: 'kyo', type: 'combo' },

  { symbol: 'ぎゃ', romaji: 'gya', type: 'combo' },
  { symbol: 'ぎゅ', romaji: 'gyu', type: 'combo' },
  { symbol: 'ぎょ', romaji: 'gyo', type: 'combo' },

  { symbol: 'しゃ', romaji: 'sha', type: 'combo' },
  { symbol: 'しゅ', romaji: 'shu', type: 'combo' },
  { symbol: 'しょ', romaji: 'sho', type: 'combo' },

  { symbol: 'じゃ', romaji: 'ja', type: 'combo' },
  { symbol: 'じゅ', romaji: 'ju', type: 'combo' },
  { symbol: 'じょ', romaji: 'jo', type: 'combo' },

  { symbol: 'ちゃ', romaji: 'cha', type: 'combo' },
  { symbol: 'ちゅ', romaji: 'chu', type: 'combo' },
  { symbol: 'ちょ', romaji: 'cho', type: 'combo' },

  { symbol: 'ぢゃ', romaji: 'ja', type: 'combo' },
  { symbol: 'ぢゅ', romaji: 'ju', type: 'combo' },
  { symbol: 'ぢょ', romaji: 'jo', type: 'combo' },

  { symbol: 'にゃ', romaji: 'nya', type: 'combo' },
  { symbol: 'にゅ', romaji: 'nyu', type: 'combo' },
  { symbol: 'にょ', romaji: 'nyo', type: 'combo' },

  { symbol: 'ひゃ', romaji: 'hya', type: 'combo' },
  { symbol: 'ひゅ', romaji: 'hyu', type: 'combo' },
  { symbol: 'ひょ', romaji: 'hyo', type: 'combo' },

  { symbol: 'びゃ', romaji: 'bya', type: 'combo' },
  { symbol: 'びゅ', romaji: 'byu', type: 'combo' },
  { symbol: 'びょ', romaji: 'byo', type: 'combo' },

  { symbol: 'ぴゃ', romaji: 'pya', type: 'combo' },
  { symbol: 'ぴゅ', romaji: 'pyu', type: 'combo' },
  { symbol: 'ぴょ', romaji: 'pyo', type: 'combo' },

  { symbol: 'みゃ', romaji: 'mya', type: 'combo' },
  { symbol: 'みゅ', romaji: 'myu', type: 'combo' },
  { symbol: 'みょ', romaji: 'myo', type: 'combo' },

  { symbol: 'りゃ', romaji: 'rya', type: 'combo' },
  { symbol: 'りゅ', romaji: 'ryu', type: 'combo' },
  { symbol: 'りょ', romaji: 'ryo', type: 'combo' },
];
