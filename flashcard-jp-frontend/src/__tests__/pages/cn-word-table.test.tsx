import { getCnWord } from "@/_utils/api/server/cnWordsApi";
import Page from "@/app/(auth)/(cn)/cn-tables/table-words/page";

jest.mock("@/_utils/api/server/cnWordsApi", () => ({
  getCnWord: jest.fn(),
}));

describe("CnWords-Table Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Вызывает getCnWords", async () => {
    (getCnWord as jest.Mock).mockResolvedValue([]);

    await Page();

    expect(getCnWord).toHaveBeenCalledTimes(1);
  });
});
