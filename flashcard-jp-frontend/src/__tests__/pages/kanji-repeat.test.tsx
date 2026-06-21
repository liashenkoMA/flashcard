import { getKanji } from "@/_utils/api/server/kanjiApi";
import Page from "../../app/(auth)/(jp)/kanji/repeat/page";
import buildWeightedDeck from "@/_utils/buildWeightedDeck";

jest.mock("@/_utils/api/server/kanjiApi", () => ({
  getKanji: jest.fn(),
}));

jest.mock("@/_utils/buildWeightedDeck", () => jest.fn());

describe("Kanji Repeat Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Вызывает getKanji", async () => {
    (getKanji as jest.Mock).mockResolvedValue([]);

    await Page();

    expect(getKanji).toHaveBeenCalledTimes(1);
  });

  it("Передает данные в buildWeightedDeck", async () => {
    const mockKanji = [
      {
        _id: "1",
        kanji: "日",
        translate: "день",
        jpRead: "ひ",
        chinaRead: "ニチ",
        learned: true,
        weight: 2,
      },
    ];

    (getKanji as jest.Mock).mockResolvedValue(mockKanji);

    (buildWeightedDeck as jest.Mock).mockReturnValue(mockKanji);

    await Page();

    expect(buildWeightedDeck).toHaveBeenCalledTimes(1);
    expect(buildWeightedDeck).toHaveBeenCalledWith(mockKanji);
  });
});
