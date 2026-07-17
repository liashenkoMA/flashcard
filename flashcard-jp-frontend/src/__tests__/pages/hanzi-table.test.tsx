import { getHanzi } from "@/_utils/api/server/hanziApi";
import Page from "@/app/(auth)/(cn)/cn-tables/table-hanzi/page";

jest.mock("@/_utils/api/server/hanziApi", () => ({
  getHanzi: jest.fn(),
}));

describe("Hanzi-Table Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Вызывает getHanzi", async () => {
    (getHanzi as jest.Mock).mockResolvedValue([]);

    await Page();

    expect(getHanzi).toHaveBeenCalledTimes(1);
  });
});
