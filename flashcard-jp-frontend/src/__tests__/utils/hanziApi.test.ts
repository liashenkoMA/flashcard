import { IHanzi, IHanziFormData } from "@/_interface/Interface";
import {
  addHanzi,
  deleteHanzi,
  getHanziCategory,
  updateHanziWeight,
} from "@/_utils/api/client/hanziApi";
import { getHanzi } from "@/_utils/api/server/hanziApi";

global.fetch = jest.fn();

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    toString: () => "mock-cookie",
  })),
}));

describe("Hanzi API", () => {
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getHanzi", () => {
    it("Ошибка сети при получении ханзи", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(getHanzi()).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное получение ханзи", async () => {
      const mockResponse: IHanzi[] = [
        {
          _id: "1",
          category: "自然",
          hanzi: "日",
          translate: "день, солнце",
          pinyin: "rì",
          weight: 1,
        },
        {
          _id: "2",
          category: "自然",
          hanzi: "月",
          translate: "луна, месяц",
          pinyin: "yuè",
          weight: 1,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data: IHanzi[] = await getHanzi();

      await expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/hanzi"),
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

      await expect(getHanzi()).rejects.toThrow("Internal Server Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("addHanzi", () => {
    const mockFormData: IHanziFormData = {
      category: "自然",
      hanzi: "日",
      translate: "день, солнце",
      pinyin: "rì",
    };

    it("Ошибка сети при добавлении ханзи", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(addHanzi(mockFormData)).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное добавление ханзи", async () => {
      const mockResponse = {
        data: "Ханзи успешно загружены",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data = await addHanzi(mockFormData);

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/hanzi"),
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            hanzi: mockFormData.hanzi,
            pinyin: mockFormData.pinyin,
            category: mockFormData.category,
            translate: mockFormData.translate,
          }),
        }),
      );
    });

    it("Сервер вернул !res.ok", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          message: "Internal Server Error",
        }),
      } as Response);

      await expect(addHanzi(mockFormData)).rejects.toThrow(
        "Internal Server Error",
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("deleteHanzi", () => {
    const mockHanzi: IHanzi = {
      _id: "1",
      category: "自然",
      hanzi: "日",
      translate: "день, солнце",
      pinyin: "rì",
      weight: 1,
    };

    it("Ошибка сети при удалении ханзи", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(deleteHanzi(mockHanzi)).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное удаление ханзи", async () => {
      const mockResponse = {
        data: "ханзи успешно удалён",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data = await deleteHanzi(mockHanzi);

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/hanzi/${mockHanzi._id}`),
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    });

    it("Сервер вернул !res.ok", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          message: "Internal Server Error",
        }),
      } as Response);

      await expect(deleteHanzi(mockHanzi)).rejects.toThrow(
        "Internal Server Error",
      );

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("getHanziCategory", () => {
    it("Ошибка сети при получении категорий", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(getHanziCategory()).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное получение категорий", async () => {
      const mockResponse = ["greeting", "food"];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data = await getHanziCategory();

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/hanzi/category"),
        expect.objectContaining({
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
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

      await expect(getHanziCategory()).rejects.toThrow("Internal Server Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateHanziWeight", () => {
    const mockHanziData: IHanzi = {
      _id: "1",
      category: "自然",
      hanzi: "日",
      translate: "день, солнце",
      pinyin: "rì",
      weight: 1,
    };

    it("Ошибка сети при изменении веса ханзи", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(
        updateHanziWeight(mockHanziData, { status: "remember" }),
      ).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное изменение веса ханзи", async () => {
      const mockResponse = {
        message: "Вес успешно изменили",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      } as Response);

      const data = await updateHanziWeight(mockHanziData, {
        status: "remember",
      });

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/hanzi/updateweight"),
        expect.objectContaining({
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            hanziId: mockHanziData._id,
            status: "remember",
          }),
        }),
      );
    });

    it("Сервер вернул !res.ok", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: "Internal Server Error" }),
      } as Response);

      await expect(
        updateHanziWeight(mockHanziData, { status: "remember" }),
      ).rejects.toThrow("Internal Server Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
