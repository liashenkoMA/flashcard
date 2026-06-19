import styles from "./kana.module.scss";
import { IKana } from "@/_interface/Interface";
import KanaPageComponent from "@/_components/KanaPageComponent/KanaPageComponent";
import { getHiragana, getKatakana } from "@/_utils/api/server/kanaApi";
import buildWeightedDeck from "@/_utils/buildWeightedDeck";

export interface IPageParams {
  params: { slug: string };
  searchParams: { type?: string };
}

export default async function Page({ params, searchParams }: IPageParams) {
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;

  const kana: IKana[] =
    awaitedParams.slug === "hiragana"
      ? await getHiragana()
      : await getKatakana();

  function filterKana(kana: IKana[]) {
    return kana.filter((kana) => kana.learned === true);
  }

  const filteredKana = filterKana(kana);

  const preparedKana =
    awaitedSearchParams.type === "repeat"
      ? buildWeightedDeck(filteredKana)
      : kana;

  return (
    <section className={styles.kana}>
      <KanaPageComponent
        kana={preparedKana}
        params={awaitedParams.slug}
        searchParams={awaitedSearchParams}
      />
    </section>
  );
}
