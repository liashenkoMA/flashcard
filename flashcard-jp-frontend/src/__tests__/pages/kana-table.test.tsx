import Page from "../../app/(auth)/(jp)/tables/table-kana/page";
import { getHiragana, getKatakana } from "@/_utils/api/server/kanaApi";

jest.mock("@/_utils/server/kanaApi", () => ({
  getHiragana: jest.fn(),
  getKatakana: jest.fn(),
}));

describe("Kana-Table Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Вызывает getHiragana и getKatakana", async () => {
    (getHiragana as jest.Mock).mockResolvedValue([]);
    (getKatakana as jest.Mock).mockResolvedValue([]);

    await Page();

    expect(getHiragana).toHaveBeenCalledTimes(1);
    expect(getKatakana).toHaveBeenCalledTimes(1);
  });

  it("Вызывает Promise.all", async () => {
    let hiraganaResolved = false;
    let katakanaResolved = false;

    (getHiragana as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            hiraganaResolved = true;
            resolve([]);
          }, 20);
        }),
    );

    (getKatakana as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            katakanaResolved = true;
            resolve([]);
          }, 10);
        }),
    );

    await Page();

    expect(hiraganaResolved).toBe(true);
    expect(katakanaResolved).toBe(true);
  });
});
