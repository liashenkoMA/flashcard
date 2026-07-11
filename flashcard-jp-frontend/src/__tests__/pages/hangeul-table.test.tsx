import { getHangeul } from "@/_utils/api/server/hangeulApi";
import Page from "@/app/(auth)/(kr)/kr-tables/table-hangeul/page";

jest.mock("@/_utils/api/server/hangeulApi", () => ({
  getHangeul: jest.fn(),
}));

describe("Hangeul-Table Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Вызывает getHangeul", async () => {
    (getHangeul as jest.Mock).mockResolvedValue([]);

    await Page();

    expect(getHangeul).toHaveBeenCalledTimes(1);
  });
});
