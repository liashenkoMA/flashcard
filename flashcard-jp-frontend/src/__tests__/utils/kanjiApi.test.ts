import { IKanji } from "@/_interface/Interface";
import { addKanji, deleteKanji } from "@/_utils/api/client/kanjiApi";
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
          learned: false,
        },
        {
          _id: "2",
          kanji: "月",
          translate: "месяц, луна",
          jpRead: "つき",
          chinaRead: "ゲツ、ガツ",
          learned: true,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data: IKanji[] = await getKanji();

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

  describe("addKanji", () => {
    const mockFormData = {
      kanji: "日",
      jpRead: "ひ、び、か",
      chinaRead: "ニチ、ジツ",
      translate: "день, солнце",
    };

    it("Ошибка сети при добавлении кандзи", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(addKanji(mockFormData)).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное добавление кандзи", async () => {
      const mockResponse = {
        data: "Кандзи успешно загружены",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data = await addKanji(mockFormData);

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/kanji"),
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            kanji: mockFormData.kanji,
            jpRead: mockFormData.jpRead,
            chinaRead: mockFormData.chinaRead,
            translate: mockFormData.translate,
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

      await expect(addKanji(mockFormData)).rejects.toThrow(
        "Internal Server Error",
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("deleteKanji", () => {
    const mockKanji: IKanji = {
      _id: "1",
      kanji: "日",
      translate: "день, солнце",
      jpRead: "ひ、び、か",
      chinaRead: "ニチ、ジツ",
      learned: false,
    };

    it("Ошибка сети при удалении кандзи", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(deleteKanji(mockKanji)).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное удаление кандзи", async () => {
      const mockResponse = {
        data: "Кандзи успешно удалён",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data = await deleteKanji(mockKanji);

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/kanji/${mockKanji._id}`),
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

      await expect(deleteKanji(mockKanji)).rejects.toThrow(
        "Internal Server Error",
      );

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
