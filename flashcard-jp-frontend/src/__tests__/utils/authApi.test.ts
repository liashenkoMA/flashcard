import { ILoginFormData } from "@/_interface/Interface";
import { deleteUser, login, logout } from "@/_utils/server/authApi";
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

  describe("login", () => {
    let mockFormData: ILoginFormData;

    beforeEach(() => {
      jest.clearAllMocks();

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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: "Token" }),
      } as Response);

      await login(mockFormData);

      expect(setMock).toHaveBeenCalledWith(
        "session_flashcard",
        "Token",
        expect.objectContaining({
          httpOnly: true,
          secure: true,
          sameSite: "lax",
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

    it("Сервер вернул !res.ok", async () => {
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
      const deleteMock = jest.fn();

      (headers.cookies as jest.Mock).mockReturnValue({ delete: deleteMock });

      await logout();

      expect(deleteMock).toHaveBeenCalledWith("session_flashcard");
    });
  });

  describe("deleteUser", () => {
    beforeEach(() => {
      jest.clearAllMocks();

      (headers.cookies as jest.Mock).mockResolvedValue({
        get: jest.fn().mockReturnValue({ value: "test_token" }),
        delete: jest.fn(),
      });
    });

    it("Ошибка сети при удалении пользователя", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(deleteUser()).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное удаление пользователя", async () => {
  const deleteMock = jest.fn();
  const getMock = jest.fn().mockReturnValue({ value: "test_token" });

  (headers.cookies as jest.Mock).mockResolvedValue({
    get: getMock,
    delete: deleteMock,
  });

  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({}),
  } as Response);

  await expect(deleteUser()).resolves.not.toThrow();

  expect(mockFetch).toHaveBeenCalledTimes(1);
  expect(deleteMock).toHaveBeenCalledWith("session_flashcard");
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
