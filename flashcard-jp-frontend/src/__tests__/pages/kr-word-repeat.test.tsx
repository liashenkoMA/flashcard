import { getKrWord } from "@/_utils/api/server/krWordApi";
import Page from "../../app/(auth)/(kr)/kr-words/repeat/page";
import { IWord } from "@/_interface/Interface";
import buildWeightedDeck from "@/_utils/buildWeightedDeck";

jest.mock("@/_utils/buildWeightedDeck", () => jest.fn());

jest.mock("@/_utils/api/server/krWordApi", () => ({
  getKrWord: jest.fn(),
}));

describe("Kr Word Repeat Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Вызывает getKrWord", async () => {
    (getKrWord as jest.Mock).mockResolvedValue([]);

    await Page();

    expect(getKrWord).toHaveBeenCalledTimes(1);
  });

  it("Передает слова через buildWeightedDeck", async () => {
    const mockWords: IWord[] = [
      {
        _id: "1",
        word: "안녕",
        translate: "привет",
        category: "приветствие",
        weight: 3,
      },
    ];

    (getKrWord as jest.Mock).mockResolvedValue(mockWords);

    (buildWeightedDeck as jest.Mock).mockReturnValue(mockWords);

    await Page();

    expect(buildWeightedDeck).toHaveBeenCalledWith(mockWords);
    expect(buildWeightedDeck).toHaveBeenCalledTimes(1);
  });
});
