import { getWord } from "@/_utils/api/server/wordApi";
import Page from "../../app/(auth)/(jp)/words/repeat/page";
import buildWeightedDeck from "@/_utils/buildWeightedDeck";
import { IWord } from "@/_interface/Interface";

jest.mock("@/_utils/buildWeightedDeck", () => jest.fn());

jest.mock("@/_utils/api/server/wordApi", () => ({
  getWord: jest.fn(),
}));

describe("Word Repeat Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Вызывает getWord", async () => {
    (getWord as jest.Mock).mockResolvedValue([]);

    await Page();

    expect(getWord).toHaveBeenCalledTimes(1);
  });

  it("Передает слова через buildWeightedDeck", async () => {
    const mockWords: IWord[] = [
      {
        _id: "1",
        word: "猫",
        translate: "кошка",
        category: "животные",
        weight: 3,
      },
    ];

    (getWord as jest.Mock).mockResolvedValue(mockWords);

    (buildWeightedDeck as jest.Mock).mockReturnValue(mockWords);

    await Page();

    expect(buildWeightedDeck).toHaveBeenCalledWith(mockWords);
    expect(buildWeightedDeck).toHaveBeenCalledTimes(1);
  });
});
