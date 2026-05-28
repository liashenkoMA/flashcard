import styles from "./kana.module.scss";
import { IKana } from "@/_interface/Interface";
import KanaPageComponent from "@/_components/KanaPageComponent/KanaPageComponent";
import { getHirakana } from "@/_utils/server/kanaApi";

export interface IPageParams {
  params: { slug: string };
  searchParams: { type?: string };
}

export default async function Page({ params, searchParams }: IPageParams) {
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;

  const kana: IKana[] =
    awaitedParams.slug === "hirakana"
      ? await getHirakana()
      : await getHirakana();

  function filterKana(kana: IKana[]) {
    if (awaitedSearchParams.type === "repeat") {
      return kana.filter((kana) => kana.learned === true);
    }

    return kana;
  }

  const filteredKana = filterKana(kana);

  return (
    <section className={styles.kana}>
      <KanaPageComponent kana={filteredKana} params={awaitedParams.slug} />
    </section>
  );
}
