import Page from "../../app/(auth)/(jp)/tables/table-words/page";
import { getWord } from "@/_utils/api/server/wordApi";

jest.mock("@/_utils/api/server/wordApi", () => ({
  getWord: jest.fn(),
}));

describe("Words-Table Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Вызывает getWord", async () => {
    (getWord as jest.Mock).mockResolvedValue([]);

    await Page();

    expect(getWord).toHaveBeenCalledTimes(1);
  });
});
