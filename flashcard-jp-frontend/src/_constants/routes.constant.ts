export const ROUTES = {
  home: "/",
  dashboard: "/dashboard",
  profile: "/profile",
  contacts: "/contacts",

  auth: {
    login: "/login",
    register: "/register",
  },

  kana: {
    hiragana: {
      learn: "/kana/hiragana",
      repeat: "/kana/hiragana?type=repeat",
    },
    katakana: {
      learn: "/kana/katakana",
      repeat: "/kana/katakana?type=repeat",
    },
  },

  kanji: {
    study: "/kanji/repeat",
    add: "/kanji/add",
  },

  words: {
    study: "/words/repeat",
    add: "/words/add",
  },

  tables: {
    kana: "/tables/table-kana",
    kanji: "/tables/table-kanji",
    words: "/tables/table-words",
  },

  hangeul: {
    learn: "/hangeul",
    repeat: "/hangeul?type=repeat",
  },

  kr_words: {
    study: "/kr-words/repeat",
    add: "/kr-words/add",
  },

  kr_tables: {
    hangeul: "/kr-tables/table-hangeul",
    words: "/kr-tables/table-words",
  },

  hanzi: {
    add: "/hanzi/add",
    study: "/hanzi/repeat",
  },

  cn_words: {
    study: "/cn-words/repeat",
    add: "/cn-words/add",
  },

  cn_tables: {
    hanzi: "/cn-tables/table-hanzi",
    words: "/cn-tables/table-words",
  },
};
