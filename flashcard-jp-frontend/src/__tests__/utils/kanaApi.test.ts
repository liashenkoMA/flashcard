import {
  IKana,
  IUpdateHiraganaWeightResponse,
  IUpdateHirakanaResponse,
  IUpdateKatakanaResponse,
  IUpdateKatakanaWeightResponse,
} from "@/_interface/Interface";
import {
  updateHiragana,
  updateHiraganaWeight,
  updateKatakana,
  updateKatakanaWeight,
} from "@/_utils/api/client/kanaApi";
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
        {
          symbol: "あ",
          romaji: "a",
          group: "a",
          learned: false,
          weight: 1,
          _id: "1",
        },
        {
          symbol: "い",
          romaji: "i",
          group: "a",
          learned: false,
          weight: 1,
          _id: "1",
        },
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
      const mockHiragana = { symbol: "が", romaji: "ga", weight: 1, _id: "1" };

      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(updateHiragana(mockHiragana)).rejects.toThrow(
        "Network Error",
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное изучение каны", async () => {
      const mockHiragana = { symbol: "が", romaji: "ga", weight: 1, _id: "1" };

      const mockResponse: IUpdateHirakanaResponse = {
        message: "Выучена",
        hiraganaId: "123",
        learned: true,
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
      const mockHiragana = { symbol: "が", romaji: "ga", weight: 1, _id: "1" };

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
        {
          symbol: "ア",
          romaji: "a",
          group: "a",
          learned: false,
          weight: 1,
          _id: "1",
        },
        {
          symbol: "イ",
          romaji: "i",
          group: "a",
          learned: false,
          weight: 1,
          _id: "1",
        },
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
      const mockKatakana = { symbol: "ア", romaji: "a", weight: 1, _id: "1" };

      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(updateKatakana(mockKatakana)).rejects.toThrow(
        "Network Error",
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное получение каны", async () => {
      const mockKatakana = { symbol: "ア", romaji: "a", weight: 1, _id: "1" };

      const mockResponse: IUpdateKatakanaResponse = {
        message: "Выучена",
        katakanaId: "123",
        learned: true,
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
      const mockKatakana = { symbol: "ア", romaji: "a", weight: 1, _id: "1" };

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

  describe("updateHiraganaWeight", () => {
    it("Ошибка сети при изменении веса хираганы", async () => {
      const mockHiragana = {
        symbol: "が",
        romaji: "ga",
        weight: 1,
        _id: "1",
      };

      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(
        updateHiraganaWeight(mockHiragana, { status: "remember" }),
      ).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное изменение веса хираганы", async () => {
      const mockHiragana = {
        symbol: "が",
        romaji: "ga",
        weight: 1,
        _id: "1",
      };

      const mockResponse: IUpdateHiraganaWeightResponse = {
        message: "Вес обновлен",
        hiraganaId: "123",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await updateHiraganaWeight(mockHiragana, {
        status: "remember",
      });

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/hiragana/updateweight"),
        expect.objectContaining({
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            symbol: mockHiragana.symbol,
            status: "remember",
          }),
        }),
      );
    });

    it("Сервер вернул !res.ok при изменении веса хираганы", async () => {
      const mockHiragana = {
        symbol: "が",
        romaji: "ga",
        weight: 1,
        _id: "1",
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          message: "Internal Server Error",
        }),
      } as Response);

      await expect(
        updateHiraganaWeight(mockHiragana, { status: "forgot" }),
      ).rejects.toThrow("Internal Server Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateKatakanaWeight", () => {
    it("Ошибка сети при изменении веса катаканы", async () => {
      const mockKatakana = {
        symbol: "ア",
        romaji: "a",
        weight: 1,
        _id: "1",
      };

      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(
        updateKatakanaWeight(mockKatakana, { status: "remember" }),
      ).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное изменение веса катаканы", async () => {
      const mockKatakana = {
        symbol: "ア",
        romaji: "a",
        weight: 1,
        _id: "1",
      };

      const mockResponse: IUpdateKatakanaWeightResponse = {
        message: "Вес обновлен",
        katakanaId: "123",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await updateKatakanaWeight(mockKatakana, {
        status: "remember",
      });

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/katakana/updateweight"),
        expect.objectContaining({
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            symbol: mockKatakana.symbol,
            status: "remember",
          }),
        }),
      );
    });

    it("Сервер вернул !res.ok при изменении веса катаканы", async () => {
      const mockKatakana = {
        symbol: "ア",
        romaji: "a",
        weight: 1,
        _id: "1",
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          message: "Internal Server Error",
        }),
      } as Response);

      await expect(
        updateKatakanaWeight(mockKatakana, { status: "forgot" }),
      ).rejects.toThrow("Internal Server Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
