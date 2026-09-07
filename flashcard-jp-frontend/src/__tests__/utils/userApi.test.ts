import { IProfileFormData, IRegisterFormData } from "@/_interface/Interface";
import { createUser, updateUser } from "@/_utils/api/client/userApi";
import { getUser, getUserUsage } from "@/_utils/api/server/userApi";
import * as headers from "next/headers";

global.fetch = jest.fn();

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    toString: jest.fn(),
  })),
}));

describe("User Api", () => {
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  describe("createUser", () => {
    let mockFormData: IRegisterFormData;

    beforeEach(() => {
      jest.clearAllMocks();

      mockFormData = {
        name: "Иван",
        email: "test@test.ru",
        password: "12345",
        duplicate: "12345",
      };
    });

    it("Ошибка сети при создании пользователя", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(createUser(mockFormData)).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное создание пользователя", async () => {
      const mockResponse = {
        data: "Пользователь создан",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data = await createUser(mockFormData);

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/user$/),
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: mockFormData.name,
            email: mockFormData.email,
            password: mockFormData.password,
          }),
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

      await expect(createUser(mockFormData)).rejects.toThrow(
        "Internal Server Error",
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("getUser", () => {
    beforeEach(() => {
      jest.clearAllMocks();

      (headers.cookies as jest.Mock).mockResolvedValue({
        toString: jest.fn().mockReturnValue("session_flashcard=token"),
      });
    });

    it("Ошибка сети при получении данных пользователя", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(getUser()).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное получение данных пользователя", async () => {
      const user = {
        name: "Иван",
        email: "test@test.ru",
        subscription: {
          active: true,
          expiresAt: "2026-12-31T00:00:00.000Z",
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => user,
      } as Response);

      const result = await getUser();

      expect(result).toEqual({ user });
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/user$/),
        expect.objectContaining({
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: "session_flashcard=token",
          },
        }),
      );
    });

    it("Сервер вернул !res.ok и status < 500", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          message: "Пользователь не авторизован",
        }),
      } as Response);

      const result = await getUser();

      expect(result).toEqual({
        message: "Пользователь не авторизован",
      });
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Сервер вернул !res.ok и status >= 500", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: async () => ({
          message: "Internal Server Error",
        }),
      } as Response);

      await expect(getUser()).rejects.toThrow("Internal Server Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("getUserUsage", () => {
    beforeEach(() => {
      jest.clearAllMocks();

      (headers.cookies as jest.Mock).mockResolvedValue({
        toString: jest.fn().mockReturnValue("session_flashcard=token"),
      });
    });

    it("Ошибка сети при получении количества загруженных данных", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(getUserUsage()).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное получение количества загруженных данных", async () => {
      const usage = {
        hanzi: 10,
        wordCn: 20,
        kanji: 30,
        wordJp: 40,
        wordKr: 50,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => usage,
      } as Response);

      const result = await getUserUsage();

      expect(result).toEqual({ usage });
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/user\/usage$/),
        expect.objectContaining({
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: "session_flashcard=token",
          },
        }),
      );
    });

    it("Сервер вернул !res.ok и status < 500", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          message: "Пользователь не авторизован",
        }),
      } as Response);

      const result = await getUserUsage();

      expect(result).toEqual({
        message: "Пользователь не авторизован",
      });
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Сервер вернул !res.ok и status >= 500", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: async () => ({
          message: "Internal Server Error",
        }),
      } as Response);

      await expect(getUserUsage()).rejects.toThrow("Internal Server Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateUser", () => {
    let mockFormData: IProfileFormData;

    beforeEach(() => {
      jest.clearAllMocks();

      mockFormData = {
        name: "Новое имя",
        email: "test@test.ru",
        newPassword: "1234",
        currentPassword: "12345",
      };
    });

    it("Ошибка сервера при обновлении данных пользователя", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(updateUser(mockFormData)).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное обновление данных пользователя", async () => {
      const mockResponse = {
        name: "Новое имя",
        email: "test@test.ru",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data = await updateUser(mockFormData);

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/user\/update$/),
        expect.objectContaining({
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: mockFormData.name,
            email: mockFormData.email,
            newPassword: mockFormData.newPassword,
            currentPassword: mockFormData.currentPassword,
          }),
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

      await expect(updateUser(mockFormData)).rejects.toThrow(
        "Internal Server Error",
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
