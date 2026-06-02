import {
  IKana,
  IUpdateHirakanaResponse,
  IUpdateKatakanaResponse,
} from "@/_interface/Interface";
import { updateHiragana, updateKatakana } from "@/_utils/api/client/kanaApi";
import { getHiragana, getKatakana } from "@/_utils/api/server/kanaApi";

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

      await expect(getHiragana()).rejects.toThrow("Network Error");
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

      const data: IKana[] = await getHiragana();

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

      await expect(getHiragana()).rejects.toThrow("Internal Server Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateHiragana", () => {
    it("Ошибка сети при изучении каны", async () => {
      const mockHiragana = { symbol: "が", romaji: "ga" };

      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(updateHiragana(mockHiragana)).rejects.toThrow(
        "Network Error",
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное изучение каны", async () => {
      const mockHiragana = { symbol: "が", romaji: "ga" };

      const mockResponse: IUpdateHirakanaResponse = {
        message: "Выучена",
        hiraganaId: "123",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result: IUpdateHirakanaResponse =
        await updateHiragana(mockHiragana);

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

      await expect(updateHiragana(mockHiragana)).rejects.toThrow(
        "Internal Server Error",
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("getkatakana", () => {
    it("Ошибка сети при получении каны", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(getKatakana()).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное получение каны", async () => {
      const mockResponse: IKana[] = [
        { symbol: "ア", romaji: "a", group: "a", learned: false },
        { symbol: "イ", romaji: "i", group: "a", learned: false },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data: IKana[] = await getKatakana();

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/katakana"),
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
        json: async () => ({
          message: "Internal Server Error",
        }),
      } as Response);

      await expect(getKatakana()).rejects.toThrow("Internal Server Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("updatekatakana", () => {
    it("Ошибка сети при получении каны", async () => {
      const mockKatakana = { symbol: "ア", romaji: "a" };

      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(updateKatakana(mockKatakana)).rejects.toThrow(
        "Network Error",
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное получение каны", async () => {
      const mockKatakana = { symbol: "ア", romaji: "a" };

      const mockResponse: IUpdateKatakanaResponse = {
        message: "Выучена",
        katakanaId: "123",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data: IUpdateKatakanaResponse = await updateKatakana(mockKatakana);

      await expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/katakana/update"),
        expect.objectContaining({
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            symbol: mockKatakana.symbol,
          }),
        }),
      );
    });

    it("Сервер вернул !res.ok", async () => {
      const mockKatakana = { symbol: "ア", romaji: "a" };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: "Internal Server Error" }),
      } as Response);

      await expect(updateKatakana(mockKatakana)).rejects.toThrow(
        "Internal Server Error",
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
