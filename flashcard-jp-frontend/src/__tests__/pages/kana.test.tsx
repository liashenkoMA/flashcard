import Page, { IPageParams } from "@/app/(auth)/(jp)/kana/[slug]/page";
import { getHiragana, getKatakana } from "@/_utils/api/server/kanaApi";
import buildWeightedDeck from "@/_utils/buildWeightedDeck";

jest.mock("@/_utils/buildWeightedDeck", () => jest.fn());
jest.mock("@/_utils/api/server/kanaApi", () => ({
  getHiragana: jest.fn(),
  getKatakana: jest.fn(),
}));

const mockKana = [
  { symbol: "あ", romaji: "a", learned: true },
  { symbol: "い", romaji: "i", learned: false },
  { symbol: "う", romaji: "u", learned: true },
];

describe("Kana Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Вызывает getHirakana и возвращает данные без фильтра", async () => {
    (getHiragana as jest.Mock).mockResolvedValue(mockKana);

    const params = { slug: "hiragana" };
    const searchParams = {};

    const result = await Page({
      params,
      searchParams,
    } as IPageParams);

    expect(getHiragana).toHaveBeenCalledTimes(1);
    expect(result.props.children.props.kana).toEqual(mockKana);
  });

  it("Вызывает getKatakana и возвращает данные без фильтра", async () => {
    (getKatakana as jest.Mock).mockResolvedValue(mockKana);

    const params = { slug: "katakana" };
    const searchParams = {};

    const result = await Page({
      params,
      searchParams,
    } as IPageParams);

    expect(getKatakana).toHaveBeenCalledTimes(1);
    expect(result.props.children.props.kana).toEqual(mockKana);
  });

  it("При type=repeat передает изученные kana в buildWeightedDeck", async () => {
    (getHiragana as jest.Mock).mockResolvedValue(mockKana);

    const weightedKana = [
      { symbol: "あ", romaji: "a", learned: true },
      { symbol: "う", romaji: "u", learned: true },
      { symbol: "あ", romaji: "a", learned: true },
    ];

    (buildWeightedDeck as jest.Mock).mockReturnValue(weightedKana);

    const params = { slug: "hiragana" };
    const searchParams = { type: "repeat" };

    const result = await Page({
      params,
      searchParams,
    } as IPageParams);

    expect(buildWeightedDeck).toHaveBeenCalledWith([
      { symbol: "あ", romaji: "a", learned: true },
      { symbol: "う", romaji: "u", learned: true },
    ]);
    expect(result.props.children.props.kana).toEqual(weightedKana);
  });

  it("Если type не repeat — возвращает полный список", async () => {
    (getHiragana as jest.Mock).mockResolvedValue(mockKana);

    const params = { slug: "hiragana" };
    const searchParams = { type: "all" };

    const result = await Page({
      params,
      searchParams,
    } as IPageParams);

    expect(result.props.children.props.kana).toEqual(mockKana);
  });
});
