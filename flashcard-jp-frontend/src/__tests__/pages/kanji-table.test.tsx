import { getKanji } from "@/_utils/api/server/kanjiApi";
import Page from "../../app/(auth)/(jp)/tables/table-kanji/page";

jest.mock("@/_utils/api/server/kanjiApi", () => ({
  getKanji: jest.fn(),
}));

describe("Kanji-Table Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Вызывает getKanji", async () => {
    (getKanji as jest.Mock).mockResolvedValue([]);

    await Page();

    expect(getKanji).toHaveBeenCalledTimes(1);
  });
});
