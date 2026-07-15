import { ICnWord, ICnWordFormData } from "@/_interface/Interface";
import {
  addCnWord,
  deleteCnWord,
  getCnWordsCategory,
  updateCnWordWeight,
} from "@/_utils/api/client/cnWordsApi";
import { getCnWord } from "@/_utils/api/server/cnWordsApi";

global.fetch = jest.fn();

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    toString: () => "mock-cookie",
  })),
}));

describe("Cn Words API", () => {
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getCnWord", () => {
    it("Ошибка сети при получении слов", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(getCnWord()).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное получение слов", async () => {
      const mockResponse: ICnWord[] = [
        {
          _id: "1",
          word: "你好",
          pinyin: "nǐ hǎo",
          translate: "привет",
          category: "greeting",
          weight: 1,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data: ICnWord[] = await getCnWord();

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/words-zh"),
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

      await expect(getCnWord()).rejects.toThrow("Internal Server Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("addCnWord", () => {
    const mockFormData: ICnWordFormData = {
      word: "你好",
      pinyin: "nǐ hǎo",
      translate: "привет",
      category: "greeting",
    };

    it("Ошибка сети при добавлении слова", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(addCnWord(mockFormData)).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное добавление слова", async () => {
      const mockResponse = {
        data: "你好 - добавлено",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data = await addCnWord(mockFormData);

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/words-zh/add"),
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            word: mockFormData.word,
            translate: mockFormData.translate,
            pinyin: mockFormData.pinyin,
            category: mockFormData.category,
          }),
        },
      );
    });

    it("Сервер вернул !res.ok", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: "Bad Request" }),
      } as Response);

      await expect(addCnWord(mockFormData)).rejects.toThrow("Bad Request");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("deleteCnWord", () => {
    const mockWord: ICnWord = {
      _id: "1",
      word: "你好",
      pinyin: "nǐ hǎo",
      translate: "привет",
      category: "greeting",
      weight: 1,
    };

    it("Ошибка сети при удалении слова", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(deleteCnWord(mockWord)).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное удаление слова", async () => {
      const mockResponse = {
        data: "Слово удалено",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data = await deleteCnWord(mockWord);

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/words-zh/${mockWord._id}`),
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
        json: async () => ({ message: "Bad Request" }),
      } as Response);

      await expect(deleteCnWord(mockWord)).rejects.toThrow("Bad Request");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("getCnWordsCategory", () => {
    it("Ошибка сети при получении категорий", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(getCnWordsCategory()).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное получение категорий", async () => {
      const mockResponse = ["greeting", "food"];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data = await getCnWordsCategory();

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/words-zh/category"),
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

      await expect(getCnWordsCategory()).rejects.toThrow(
        "Internal Server Error",
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateCnWordWeight", () => {
    const mockWord: ICnWord = {
      _id: "1",
      word: "你好",
      pinyin: "nǐ hǎo",
      translate: "привет",
      category: "greeting",
      weight: 1,
    };

    it("Ошибка сети при изменении веса слова", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(
        updateCnWordWeight(mockWord, { status: "remember" }),
      ).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное изменение веса слова", async () => {
      const mockResponse = {
        message: "Вес успешно изменён",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data = await updateCnWordWeight(mockWord, {
        status: "remember",
      });

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/words-zh/updateweight"),
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            wordId: mockWord._id,
            status: "remember",
          }),
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

      await expect(
        updateCnWordWeight(mockWord, {
          status: "remember",
        }),
      ).rejects.toThrow("Internal Server Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
