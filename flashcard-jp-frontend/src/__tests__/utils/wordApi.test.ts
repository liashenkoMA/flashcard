import { IWord, IWordFormData } from "@/_interface/Interface";
import { addWord, deleteWord } from "@/_utils/api/client/wordApi";
import { getWord } from "@/_utils/api/server/wordApi";
import { getWordsCategory } from "@/_utils/api/client/wordApi";

global.fetch = jest.fn();

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    toString: () => "mock-cookie",
  })),
}));

describe("Words API", () => {
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getWord", () => {
    it("Ошибка сети при получении слов", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(getWord()).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное получение слов", async () => {
      const mockResponse: IWord[] = [
        {
          _id: "1",
          word: "こんにちは",
          translate: "привет",
          category: "greeting",
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data: IWord[] = await getWord();

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/words"),
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

      await expect(getWord()).rejects.toThrow("Internal Server Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("addWord", () => {
    const mockFormData: IWordFormData = {
      word: "こんにちは",
      translate: "привет",
      category: "greeting",
    };

    it("Ошибка сети при добавлении слова", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(addWord(mockFormData)).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное добавление слова", async () => {
      const mockResponse = {
        data: "こんにちは - добавлено",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data = await addWord(mockFormData);

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/words/add"),
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            word: mockFormData.word,
            translate: mockFormData.translate,
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

      await expect(addWord(mockFormData)).rejects.toThrow("Bad Request");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("deleteWord", () => {
    const mockWord: IWord = {
      _id: "1",
      word: "こんにちは",
      translate: "привет",
      category: "greeting",
    };

    it("Ошибка сети при удалении слова", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(deleteWord(mockWord)).rejects.toThrow("Network Error");
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

      const data = await deleteWord(mockWord);

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/words/${mockWord._id}`),
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

      await expect(deleteWord(mockWord)).rejects.toThrow("Bad Request");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("getWordsCategory", () => {
    it("Ошибка сети при получении категорий", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(getWordsCategory()).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное получение категорий", async () => {
      const mockResponse = ["greeting", "food"];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data = await getWordsCategory();

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/words/category"),
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

      await expect(getWordsCategory()).rejects.toThrow("Internal Server Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
