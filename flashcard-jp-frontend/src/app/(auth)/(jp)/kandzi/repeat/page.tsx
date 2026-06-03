import styles from "./kandjiRepeat.module.scss";
import { IKanji } from "@/_interface/Interface";
import KandjiRepeatPageComponent from "@/_components/KandjiRepeatPageComponent/KandjiRepeatPageComponent";
import { getKanji } from "@/_utils/api/server/kanjiApi";

export default async function KandziRepeat() {
  /* const kanji: IKanji[] = await getKanji(); */

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
    <section className={styles.kandjirepeat}>
      <KandjiRepeatPageComponent kanji={data} />
    </section>
  );
}
