import { getHanzi } from "@/_utils/api/server/hanziApi";
import buildWeightedDeck from "@/_utils/buildWeightedDeck";
import Page from "../../app/(auth)/(cn)/hanzi/repeat/page";
import { IHanzi } from "@/_interface/Interface";

jest.mock("@/_utils/api/server/hanziApi", () => ({
  getHanzi: jest.fn(),
}));

jest.mock("@/_utils/buildWeightedDeck", () => jest.fn());

describe("Hanzi Repeat Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Вызывает getHanzi", async () => {
    (getHanzi as jest.Mock).mockResolvedValue([]);

    await Page();

    expect(getHanzi).toHaveBeenCalledTimes(1);
  });

  it("Передает данные в buildWeightedDeck", async () => {
    const mockHanzi: IHanzi[] = [
      {
        _id: "1",
        category: "HSK1",
        hanzi: "日",
        translate: "солнце",
        pinyin: "rì",
        weight: 1,
      },
    ];

    (getHanzi as jest.Mock).mockResolvedValue(mockHanzi);

    (buildWeightedDeck as jest.Mock).mockReturnValue(mockHanzi);

    await Page();

    expect(buildWeightedDeck).toHaveBeenCalledTimes(1);
    expect(buildWeightedDeck).toHaveBeenCalledWith(mockHanzi);
  });
});
