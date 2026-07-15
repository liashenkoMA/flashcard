import { getCnWord } from "@/_utils/api/server/cnWordsApi";
import Page from "../../app/(auth)/(cn)/cn-words/repeat/page";
import { ICnWord } from "@/_interface/Interface";
import buildWeightedDeck from "@/_utils/buildWeightedDeck";

jest.mock("@/_utils/buildWeightedDeck", () => jest.fn());

jest.mock("@/_utils/api/server/cnWordsApi", () => ({
  getCnWord: jest.fn(),
}));

describe("Cn Word Repeat Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Вызывает getCnWord", async () => {
    (getCnWord as jest.Mock).mockResolvedValue([]);

    await Page();

    expect(getCnWord).toHaveBeenCalledTimes(1);
  });

  it("Передает слова через buildWeightedDeck", async () => {
    const mockWords: ICnWord[] = [
      {
        _id: "1",
        word: "你好",
        pinyin: "nǐ hǎo",
        translate: "привет",
        category: "greeting",
        weight: 3,
      },
    ];

    (getCnWord as jest.Mock).mockResolvedValue(mockWords);

    (buildWeightedDeck as jest.Mock).mockReturnValue(mockWords);

    await Page();

    expect(buildWeightedDeck).toHaveBeenCalledWith(mockWords);
    expect(buildWeightedDeck).toHaveBeenCalledTimes(1);
  });
});
