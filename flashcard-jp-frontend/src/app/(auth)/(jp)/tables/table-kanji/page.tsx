import KanjiTable from "@/_components/KanjiTable/KanjiTable";
import styles from "./tableKanji.module.scss";
import { getKanji } from "@/_utils/api/server/kanjiApi";

export default async function Page() {
  /*   const data = await getKanji();  НЕ ЗАБЫТЬ ПОПРОБОВАТЬ ДОПИСАТЬ ТИП ДЛЯ data!!!! */

  const data = [
    {
      _id: "1",
      kanji: "日",
      translate: "день, солнце",
      jpRead: "ひ、び、か",
      chinaRead: "ニチ、ジツ",
      learned: false,
    },
    {
      _id: "2",
      kanji: "月",
      translate: "месяц, луна",
      jpRead: "つき",
      chinaRead: "ゲツ、ガツ",
      learned: true,
    },
    {
      _id: "3",
      kanji: "火",
      translate: "огонь",
      jpRead: "ひ",
      chinaRead: "カ",
      learned: false,
    },
    {
      _id: "4",
      kanji: "水",
      translate: "вода",
      jpRead: "みず",
      chinaRead: "スイ",
      learned: true,
    },
    {
      _id: "5",
      kanji: "木",
      translate: "дерево",
      jpRead: "き、こ",
      chinaRead: "モク、ボク",
      learned: false,
    },
  ];

  return (
    <section className={styles.tablekanji}>
      <KanjiTable kanji={data} />
    </section>
  );
}
