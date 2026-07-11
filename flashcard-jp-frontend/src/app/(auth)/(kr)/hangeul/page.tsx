import { IHangeul } from "@/_interface/Interface";
import styles from "./hangeul.module.scss";
import { getHangeul } from "@/_utils/api/server/hangeulApi";
import buildWeightedDeck from "@/_utils/buildWeightedDeck";
import HangeulPageComponent from "@/_components/HangeulPageComponent/HangeulPageComponent";

export interface IPageParams {
  searchParams: { type?: string };
}

export default async function Page({ searchParams }: IPageParams) {
  const awaitedSearchParams = await searchParams;

  const hangeul: IHangeul[] = await getHangeul();

  function filterKana(hangeul: IHangeul[]) {
    return hangeul.filter((symbol) => symbol.learned === true);
  }

  const filteredhangeul = filterKana(hangeul);

  const preparedHangeul =
    awaitedSearchParams.type === "repeat"
      ? buildWeightedDeck(filteredhangeul)
      : hangeul;

  return (
    <section className={styles.hangeul}>
      <HangeulPageComponent
        hangeul={preparedHangeul}
        searchParams={awaitedSearchParams}
      />
    </section>
  );
}
