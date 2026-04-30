import { IKana, IUpdateKanaResponse } from "@/_interface/Interface";
import { getHiragana, updateHiragana } from "@/_utils/kanaApi";

global.fetch = jest.fn();

describe("Kana Api", () => {
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  describe("getHiragana", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("Ошибка сети при получении каны", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(getHiragana()).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное получение каны", async () => {
      const mockResponse: IKana[] = [
        { symbol: "あ", romaji: "a", group: "a", learned: false },
        {
          symbol: "い",
          romaji: "i",
          group: "a",
          learned: false,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data = await getHiragana();

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/hiragana$/),
        expect.objectContaining({
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }),
      );
    });

    it("Сервер вернул !res.ok", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: async () => ({ message: "Internal Server Error" }),
      } as Response);

      await expect(getHiragana()).rejects.toThrow("Internal Server Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateHiragana", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("Ошибка сети при изучении каны", async () => {
      const mockHiragana = {
        symbol: "が",
        romaji: "ga",
      };

      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(updateHiragana(mockHiragana)).rejects.toThrow(
        "Network Error",
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное изучение каны", async () => {
      const mockHiragana = {
        symbol: "が",
        romaji: "ga",
      };

      const mockResponse: IUpdateKanaResponse = {
        message: "Выучена",
        hiraganaId: "123",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      } as Response);

      const result = await updateHiragana(mockHiragana);

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/hiragana\/update$/),
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            symbol: mockHiragana.symbol,
          }),
        },
      );
    });

    it("Сервер вернул !res.ok", async () => {
      const mockHiragana = {
        symbol: "が",
        romaji: "ga",
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: async () => ({ message: "Internal Server Error" }),
      } as Response);

      await expect(updateHiragana(mockHiragana)).rejects.toThrow(
        "Internal Server Error",
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
