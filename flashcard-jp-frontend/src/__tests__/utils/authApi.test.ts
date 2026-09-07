import { ILoginFormData } from "@/_interface/Interface";
import { deleteUser, login, logout } from "@/_utils/api/server/authApi";
import * as headers from "next/headers";

global.fetch = jest.fn();

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    set: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  })),
}));

describe("Auth Api", () => {
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    let mockFormData: ILoginFormData;

    beforeEach(() => {
      mockFormData = {
        email: "test@test.ru",
        password: "test",
        duplicate: "test",
      };
    });

    it("Ошибка сети при авторизации", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(login(mockFormData)).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешная авторизация, запись в cookies", async () => {
      const setMock = jest.fn();
      (headers.cookies as jest.Mock).mockReturnValue({ set: setMock });

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
        json: async () => ({
          access_token: "Token",
          user,
        }),
      } as Response);

      const result = await login(mockFormData);

      expect(result).toEqual({ user });
      expect(setMock).toHaveBeenCalledWith(
        "session_flashcard",
        "Token",
        expect.objectContaining({
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          domain: ".flashcardsjp.ru",
          path: "/",
        }),
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/auth\/signin$/),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Accept: "application/json",
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({
            email: mockFormData.email,
            password: mockFormData.password,
          }),
        }),
      );
    });

    it("Сервер вернул !res.ok и status < 500", async () => {
      const setMock = jest.fn();

      (headers.cookies as jest.Mock).mockReturnValue({ set: setMock });

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: "Почта или пароль неверные" }),
      } as Response);

      const result = await login(mockFormData);

      expect(result).toEqual({ message: "Почта или пароль неверные" });
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(setMock).not.toHaveBeenCalled();
    });

    it("Сервер вернул !res.ok и status >= 500", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: async () => ({ message: "Internal Server Error" }),
      } as Response);

      await expect(login(mockFormData)).rejects.toThrow(
        "Internal Server Error",
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("logout", () => {
    it("Успешное удаление cookies", async () => {
      const setMock = jest.fn();
      (headers.cookies as jest.Mock).mockReturnValue({ set: setMock });

      await logout();

      expect(setMock).toHaveBeenCalledWith(
        "session_flashcard",
        "",
        expect.objectContaining({
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          domain: ".flashcardsjp.ru",
          path: "/",
          maxAge: 0,
        }),
      );
    });
  });

  describe("deleteUser", () => {
    beforeEach(() => {
      (headers.cookies as jest.Mock).mockResolvedValue({
        get: jest.fn().mockReturnValue({ value: "test_token" }),
        set: jest.fn(),
      });
    });

    it("Ошибка сети при удалении пользователя", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(deleteUser()).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное удаление пользователя", async () => {
      const setMock = jest.fn();
      const getMock = jest.fn().mockReturnValue({ value: "test_token" });

      (headers.cookies as jest.Mock).mockResolvedValue({
        get: getMock,
        set: setMock,
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response);

      await expect(deleteUser()).resolves.not.toThrow();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(setMock).toHaveBeenCalledWith(
        "session_flashcard",
        "",
        expect.objectContaining({
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          domain: ".flashcardsjp.ru",
          path: "/",
          maxAge: 0,
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

      await expect(deleteUser()).rejects.toThrow("Internal Server Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
