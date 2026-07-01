export const ROUTES = {
  home: "/",
  dashboard: "/dashboard",
  profile: "/profile",

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

  auth: {
    login: "/login",
    register: "/register",
  },
};
