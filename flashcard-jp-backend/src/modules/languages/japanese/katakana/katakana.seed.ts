export const KATAKANA_SEED = [
  { symbol: 'ア', romaji: 'a', group: 'a' },
  { symbol: 'イ', romaji: 'i', group: 'a' },
  { symbol: 'ウ', romaji: 'u', group: 'a' },
  { symbol: 'エ', romaji: 'e', group: 'a' },
  { symbol: 'オ', romaji: 'o', group: 'a' },

  { symbol: 'カ', romaji: 'ka', group: 'k' },
  { symbol: 'キ', romaji: 'ki', group: 'k' },
  { symbol: 'ク', romaji: 'ku', group: 'k' },
  { symbol: 'ケ', romaji: 'ke', group: 'k' },
  { symbol: 'コ', romaji: 'ko', group: 'k' },

  { symbol: 'ガ', romaji: 'ga', group: 'k', type: 'dakuten', baseSymbol: 'カ' },
  { symbol: 'ギ', romaji: 'gi', group: 'k', type: 'dakuten', baseSymbol: 'キ' },
  { symbol: 'グ', romaji: 'gu', group: 'k', type: 'dakuten', baseSymbol: 'ク' },
  { symbol: 'ゲ', romaji: 'ge', group: 'k', type: 'dakuten', baseSymbol: 'ケ' },
  { symbol: 'ゴ', romaji: 'go', group: 'k', type: 'dakuten', baseSymbol: 'コ' },

  { symbol: 'サ', romaji: 'sa', group: 's' },
  { symbol: 'シ', romaji: 'shi', group: 's' },
  { symbol: 'ス', romaji: 'su', group: 's' },
  { symbol: 'セ', romaji: 'se', group: 's' },
  { symbol: 'ソ', romaji: 'so', group: 's' },

  { symbol: 'ザ', romaji: 'za', type: 'dakuten', baseSymbol: 'サ' },
  { symbol: 'ジ', romaji: 'ji', type: 'dakuten', baseSymbol: 'シ' },
  { symbol: 'ズ', romaji: 'zu', type: 'dakuten', baseSymbol: 'ス' },
  { symbol: 'ゼ', romaji: 'ze', type: 'dakuten', baseSymbol: 'セ' },
  { symbol: 'ゾ', romaji: 'zo', type: 'dakuten', baseSymbol: 'ソ' },

  { symbol: 'タ', romaji: 'ta', group: 't' },
  { symbol: 'チ', romaji: 'chi', group: 't' },
  { symbol: 'ツ', romaji: 'tsu', group: 't' },
  { symbol: 'テ', romaji: 'te', group: 't' },
  { symbol: 'ト', romaji: 'to', group: 't' },

  { symbol: 'ダ', romaji: 'da', type: 'dakuten', baseSymbol: 'タ' },
  { symbol: 'ヂ', romaji: 'ji', type: 'dakuten', baseSymbol: 'チ' },
  { symbol: 'ヅ', romaji: 'zu', type: 'dakuten', baseSymbol: 'ツ' },
  { symbol: 'デ', romaji: 'de', type: 'dakuten', baseSymbol: 'テ' },
  { symbol: 'ド', romaji: 'do', type: 'dakuten', baseSymbol: 'ト' },

  { symbol: 'ナ', romaji: 'na' },
  { symbol: 'ニ', romaji: 'ni' },
  { symbol: 'ヌ', romaji: 'nu' },
  { symbol: 'ネ', romaji: 'ne' },
  { symbol: 'ノ', romaji: 'no' },

  { symbol: 'ハ', romaji: 'ha' },
  { symbol: 'ヒ', romaji: 'hi' },
  { symbol: 'フ', romaji: 'fu' },
  { symbol: 'ヘ', romaji: 'he' },
  { symbol: 'ホ', romaji: 'ho' },

  { symbol: 'バ', romaji: 'ba', type: 'dakuten' },
  { symbol: 'ビ', romaji: 'bi', type: 'dakuten' },
  { symbol: 'ブ', romaji: 'bu', type: 'dakuten' },
  { symbol: 'ベ', romaji: 'be', type: 'dakuten' },
  { symbol: 'ボ', romaji: 'bo', type: 'dakuten' },

  { symbol: 'パ', romaji: 'pa', type: 'handakuten' },
  { symbol: 'ピ', romaji: 'pi', type: 'handakuten' },
  { symbol: 'プ', romaji: 'pu', type: 'handakuten' },
  { symbol: 'ペ', romaji: 'pe', type: 'handakuten' },
  { symbol: 'ポ', romaji: 'po', type: 'handakuten' },

  // M
  { symbol: 'マ', romaji: 'ma' },
  { symbol: 'ミ', romaji: 'mi' },
  { symbol: 'ム', romaji: 'mu' },
  { symbol: 'メ', romaji: 'me' },
  { symbol: 'モ', romaji: 'mo' },

  { symbol: 'ヤ', romaji: 'ya' },
  { symbol: 'ユ', romaji: 'yu' },
  { symbol: 'ヨ', romaji: 'yo' },

  { symbol: 'ラ', romaji: 'ra' },
  { symbol: 'リ', romaji: 'ri' },
  { symbol: 'ル', romaji: 'ru' },
  { symbol: 'レ', romaji: 're' },
  { symbol: 'ロ', romaji: 'ro' },

  { symbol: 'ワ', romaji: 'wa' },
  { symbol: 'ヲ', romaji: 'wo' },

  { symbol: 'ン', romaji: 'n' },

  // Маленькие
  { symbol: 'ャ', romaji: 'ya', isSmall: true },
  { symbol: 'ュ', romaji: 'yu', isSmall: true },
  { symbol: 'ョ', romaji: 'yo', isSmall: true },

  // === COMBO (полный набор) ===
  { symbol: 'キャ', romaji: 'kya', type: 'combo' },
  { symbol: 'キュ', romaji: 'kyu', type: 'combo' },
  { symbol: 'キョ', romaji: 'kyo', type: 'combo' },

  { symbol: 'ギャ', romaji: 'gya', type: 'combo' },
  { symbol: 'ギュ', romaji: 'gyu', type: 'combo' },
  { symbol: 'ギョ', romaji: 'gyo', type: 'combo' },

  { symbol: 'シャ', romaji: 'sha', type: 'combo' },
  { symbol: 'シュ', romaji: 'shu', type: 'combo' },
  { symbol: 'ショ', romaji: 'sho', type: 'combo' },

  { symbol: 'ジャ', romaji: 'ja', type: 'combo' },
  { symbol: 'ジュ', romaji: 'ju', type: 'combo' },
  { symbol: 'ジョ', romaji: 'jo', type: 'combo' },

  { symbol: 'チャ', romaji: 'cha', type: 'combo' },
  { symbol: 'チュ', romaji: 'chu', type: 'combo' },
  { symbol: 'チョ', romaji: 'cho', type: 'combo' },

  { symbol: 'ヂャ', romaji: 'ja', type: 'combo' },
  { symbol: 'ヂュ', romaji: 'ju', type: 'combo' },
  { symbol: 'ヂョ', romaji: 'jo', type: 'combo' },

  { symbol: 'ニャ', romaji: 'nya', type: 'combo' },
  { symbol: 'ニュ', romaji: 'nyu', type: 'combo' },
  { symbol: 'ニョ', romaji: 'nyo', type: 'combo' },

  { symbol: 'ヒャ', romaji: 'hya', type: 'combo' },
  { symbol: 'ヒュ', romaji: 'hyu', type: 'combo' },
  { symbol: 'ヒョ', romaji: 'hyo', type: 'combo' },

  { symbol: 'ビャ', romaji: 'bya', type: 'combo' },
  { symbol: 'ビュ', romaji: 'byu', type: 'combo' },
  { symbol: 'ビョ', romaji: 'byo', type: 'combo' },

  { symbol: 'ピャ', romaji: 'pya', type: 'combo' },
  { symbol: 'ピュ', romaji: 'pyu', type: 'combo' },
  { symbol: 'ピョ', romaji: 'pyo', type: 'combo' },

  { symbol: 'ミャ', romaji: 'mya', type: 'combo' },
  { symbol: 'ミュ', romaji: 'myu', type: 'combo' },
  { symbol: 'ミョ', romaji: 'myo', type: 'combo' },

  { symbol: 'リャ', romaji: 'rya', type: 'combo' },
  { symbol: 'リュ', romaji: 'ryu', type: 'combo' },
  { symbol: 'リョ', romaji: 'ryo', type: 'combo' },
];
