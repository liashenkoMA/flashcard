import { IKandji } from "@/_interface/Interface";
import { getKanji } from "@/_utils/api/server/kanjiApi";

global.fetch = jest.fn();

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    toString: () => "mock-cookie",
  })),
}));

describe("Kanji API", () => {
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getKanji", () => {
    it("Ошибка сети при получении кандзи", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(getKanji()).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное получение кандзи", async () => {
      const mockResponse = [
        {
          _id: "1",
          kanji: "日",
          translate: "день, солнце",
          jpRead: "ひ、び、か",
          chinaRead: "ニチ、ジツ",
          learn: false,
        },
        {
          _id: "2",
          kanji: "月",
          translate: "месяц, луна",
          jpRead: "つき",
          chinaRead: "ゲツ、ガツ",
          learn: true,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data: IKandji[] = await getKanji();

      await expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/kanji"),
        expect.objectContaining({
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Cookie: "mock-cookie",
          },
        }),
      );
    });

    it("Сервер вернул !res.ok", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: "Internal Server Error" }),
      } as Response);

      await expect(getKanji()).rejects.toThrow("Internal Server Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
