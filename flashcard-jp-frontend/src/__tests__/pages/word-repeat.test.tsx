import { getWord } from "@/_utils/api/server/wordApi";
import Page from "../../app/(auth)/(jp)/words/repeat/page";

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
});
