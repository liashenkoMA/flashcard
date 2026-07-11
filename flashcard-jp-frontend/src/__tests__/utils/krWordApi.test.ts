import { IWord, IWordFormData } from "@/_interface/Interface";
import { addKrWord, deleteKrWord, getKrWordsCategory, updateKrWordWeight } from "@/_utils/api/client/krWordsApi";
import { getKrWord } from "@/_utils/api/server/krWordApi";

global.fetch = jest.fn();

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    toString: () => "mock-cookie",
  })),
}));

describe("Kr Words API", () => {
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getKrWord", () => {
    it("Ошибка сети при получении слов", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(getKrWord()).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное получение слов", async () => {
      const mockResponse: IWord[] = [
        {
          _id: "1",
          word: "안녕",
          translate: "привет",
          category: "greeting",
          weight: 1,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data: IWord[] = await getKrWord();

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/words-ko"),
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

      await expect(getKrWord()).rejects.toThrow("Internal Server Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("addKrWord", () => {
    const mockFormData: IWordFormData = {
      word: "안녕",
      translate: "привет",
      category: "greeting",
    };

    it("Ошибка сети при добавлении слова", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(addKrWord(mockFormData)).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное добавление слова", async () => {
      const mockResponse = {
        data: "안녕 - добавлено",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data = await addKrWord(mockFormData);

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/words-ko/add"),
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

      await expect(addKrWord(mockFormData)).rejects.toThrow("Bad Request");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("deleteKrWord", () => {
    const mockWord: IWord = {
      _id: "1",
      word: "안녕",
      translate: "привет",
      category: "greeting",
      weight: 1,
    };

    it("Ошибка сети при удалении слова", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(deleteKrWord(mockWord)).rejects.toThrow("Network Error");
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

      const data = await deleteKrWord(mockWord);

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/words-ko/${mockWord._id}`),
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

      await expect(deleteKrWord(mockWord)).rejects.toThrow("Bad Request");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("getKrWordsCategory", () => {
    it("Ошибка сети при получении категорий", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(getKrWordsCategory()).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное получение категорий", async () => {
      const mockResponse = ["greeting", "food"];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data = await getKrWordsCategory();

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/words-ko/category"),
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

      await expect(getKrWordsCategory()).rejects.toThrow("Internal Server Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateKrWordWeight", () => {
    const mockWord: IWord = {
      _id: "1",
      word: "안녕",
      translate: "привет",
      category: "greeting",
      weight: 1,
    };

    it("Ошибка сети при изменении веса слова", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(
        updateKrWordWeight(mockWord, { status: "remember" }),
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

      const data = await updateKrWordWeight(mockWord, {
        status: "remember",
      });

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/words-ko/updateweight"),
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
        updateKrWordWeight(mockWord, {
          status: "remember",
        }),
      ).rejects.toThrow("Internal Server Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
