import { getKrWord } from "@/_utils/api/server/krWordApi";
import Page from "@/app/(auth)/(kr)/kr-tables/table-words/page";

jest.mock("@/_utils/api/server/krWordApi", () => ({
  getKrWord: jest.fn(),
}));

describe("Kr-Words-Table Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Вызывает getKrWord", async () => {
    (getKrWord as jest.Mock).mockResolvedValue([]);

    await Page();

    expect(getKrWord).toHaveBeenCalledTimes(1);
  });
});
