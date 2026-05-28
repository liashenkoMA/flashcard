import { IKana, IUpdateKanaResponse } from "@/_interface/Interface";
import { updateHirakana } from "@/_utils/client/kanaApi";
import { getHirakana } from "@/_utils/server/kanaApi";

global.fetch = jest.fn();

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    toString: () => "mock-cookie",
  })),
}));

describe("Kana Api", () => {
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getHiragana", () => {
    it("Ошибка сети при получении каны", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(getHirakana()).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное получение каны", async () => {
      const mockResponse: IKana[] = [
        { symbol: "あ", romaji: "a", group: "a", learned: false },
        { symbol: "い", romaji: "i", group: "a", learned: false },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data = await getHirakana();

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/hiragana"),
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

      await expect(getHirakana()).rejects.toThrow("Internal Server Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateHiragana", () => {
    it("Ошибка сети при изучении каны", async () => {
      const mockHiragana = { symbol: "が", romaji: "ga" };

      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(updateHirakana(mockHiragana)).rejects.toThrow(
        "Network Error",
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное изучение каны", async () => {
      const mockHiragana = { symbol: "が", romaji: "ga" };

      const mockResponse: IUpdateKanaResponse = {
        message: "Выучена",
        hiraganaId: "123",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await updateHirakana(mockHiragana);

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/hiragana/update"),
        expect.objectContaining({
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            symbol: mockHiragana.symbol,
          }),
        }),
      );
    });

    it("Сервер вернул !res.ok", async () => {
      const mockHiragana = { symbol: "が", romaji: "ga" };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "Internal Server Error" }),
      } as Response);

      await expect(updateHirakana(mockHiragana)).rejects.toThrow(
        "Internal Server Error",
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
