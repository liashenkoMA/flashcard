import { IHangeul } from "@/_interface/Interface";
import { getHangeul } from "@/_utils/api/server/hangeulApi";
import buildWeightedDeck from "@/_utils/buildWeightedDeck";
import Page, { IPageParams } from "@/app/(auth)/(kr)/hangeul/page";

jest.mock("@/_utils/buildWeightedDeck", () => jest.fn());
jest.mock("@/_utils/api/server/hangeulApi", () => ({
  getHangeul: jest.fn(),
}));

const mockHangeul: IHangeul[] = [
  { symbol: "ㄱ", romaji: "a", learned: true, _id: "1", weight: 1 },
  { symbol: "ㄴ", romaji: "i", learned: false, _id: "1", weight: 1 },
  { symbol: "ㄷ", romaji: "u", learned: true, _id: "1", weight: 1 },
];

describe("Hangeul page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Вызывает getHanguel и возвращает данные без фильтра", async () => {
    (getHangeul as jest.Mock).mockResolvedValue(mockHangeul);

    const searchParams = {};

    const result = await Page({ searchParams } as IPageParams);

    expect(getHangeul).toHaveBeenCalledTimes(1);
    expect(result.props.children.props.hangeul).toEqual(mockHangeul);
  });

  it("При type=repeat передает изученные hangeul в buildWeightedDeck", async () => {
    (getHangeul as jest.Mock).mockResolvedValue(mockHangeul);

    const weightedHangeul: IHangeul[] = [
      { symbol: "ㄱ", romaji: "a", learned: true, _id: "1", weight: 1 },
      { symbol: "ㄷ", romaji: "u", learned: true, _id: "1", weight: 1 },
      { symbol: "ㄱ", romaji: "a", learned: true, _id: "1", weight: 1 },
    ];

    (buildWeightedDeck as jest.Mock).mockReturnValue(weightedHangeul);

    const searchParams = { type: "repeat" };

    const result = await Page({ searchParams } as IPageParams);

    expect(buildWeightedDeck).toHaveBeenCalledWith([
      { symbol: "ㄱ", romaji: "a", learned: true, _id: "1", weight: 1 },
      { symbol: "ㄷ", romaji: "u", learned: true, _id: "1", weight: 1 },
    ]);
    expect(result.props.children.props.hangeul).toEqual(weightedHangeul);
  });

  it("Если type не repeat — возвращает полный список", async () => {
    (getHangeul as jest.Mock).mockResolvedValue(mockHangeul);

    const searchParams = { type: "all" };

    const result = await Page({ searchParams } as IPageParams);

    expect(result.props.children.props.hangeul).toEqual(mockHangeul);
  });
});
