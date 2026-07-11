import {
  IHangeul,
  IUpdateHangeulResponse,
  IUpdateHangeulWeightResponse,
} from "@/_interface/Interface";
import {
  updateHangeul,
  updateHangeulWeight,
} from "@/_utils/api/client/hangeulApi";
import { getHangeul } from "@/_utils/api/server/hangeulApi";

global.fetch = jest.fn();

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    toString: () => "mock-cookie",
  })),
}));

describe("Hangeul Api", () => {
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getHangeul", () => {
    it("Ошибка сети при получении хангеул", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(getHangeul()).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное получение хангеул", async () => {
      const mockResponse: IHangeul[] = [
        {
          symbol: "가",
          romaji: "ga",
          group: "basic-consonant",
          learned: false,
          weight: 1,
          _id: "1",
        },
        {
          symbol: "나",
          romaji: "na",
          group: "basic-consonant",
          learned: false,
          weight: 1,
          _id: "1",
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data: IHangeul[] = await getHangeul();

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/hangeul"),
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

      await expect(getHangeul()).rejects.toThrow("Internal Server Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateHangeul", () => {
    it("Ошибка сети при изучении хангеул", async () => {
      const mockHangeul = {
        symbol: "가",
        romaji: "ga",
        weight: 1,
        _id: "1",
      };

      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(updateHangeul(mockHangeul)).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное изучение хангеул", async () => {
      const mockHangeul = {
        symbol: "가",
        romaji: "ga",
        weight: 1,
        _id: "1",
      };

      const mockResponse: IUpdateHangeulResponse = {
        message: "Выучена",
        hangeulId: "123",
        learned: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result: IUpdateHangeulResponse = await updateHangeul(mockHangeul);

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/hangeul/update"),
        expect.objectContaining({
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            symbol: mockHangeul.symbol,
          }),
        }),
      );
    });

    it("Сервер вернул !res.ok", async () => {
      const mockHangeul = {
        symbol: "가",
        romaji: "ga",
        weight: 1,
        _id: "1",
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "Internal Server Error" }),
      } as Response);

      await expect(updateHangeul(mockHangeul)).rejects.toThrow(
        "Internal Server Error",
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateHangeulWeight", () => {
    it("Ошибка сети при изменении веса хангеул", async () => {
      const mockHangeul = {
        symbol: "가",
        romaji: "ga",
        weight: 1,
        _id: "1",
      };

      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(
        updateHangeulWeight(mockHangeul, { status: "remember" }),
      ).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное изменение веса хангеул", async () => {
      const mockHangeul = {
        symbol: "가",
        romaji: "ga",
        weight: 1,
        _id: "1",
      };

      const mockResponse: IUpdateHangeulWeightResponse = {
        message: "Вес обновлен",
        hangeulId: "123",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await updateHangeulWeight(mockHangeul, {
        status: "remember",
      });

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/hangeul/updateweight"),
        expect.objectContaining({
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            symbol: mockHangeul.symbol,
            status: "remember",
          }),
        }),
      );
    });

    it("Сервер вернул !res.ok", async () => {
      const mockHangeul = {
        symbol: "가",
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
        updateHangeulWeight(mockHangeul, { status: "forgot" }),
      ).rejects.toThrow("Internal Server Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
