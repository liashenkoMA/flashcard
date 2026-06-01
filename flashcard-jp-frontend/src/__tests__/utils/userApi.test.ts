import { IProfileFormData, IRegisterFormData } from "@/_interface/Interface";
import { createUser, getUser, updateUser } from "@/_utils/api/client/userApi";

global.fetch = jest.fn();

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
        })
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
        "Internal Server Error"
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("getUser", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("Ошибка сети при получении данных пользователя", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(getUser()).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное получение данных пользователя", async () => {
      const mockResponse = {
        name: "Иван",
        email: "test@test.ru",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data = await getUser();

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/user$/),
        expect.objectContaining({
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        })
      );
    });

    it("Сервер вернул !res.ok", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: async () => ({ message: "Internal Server Error" }),
      } as Response);

      await expect(getUser()).rejects.toThrow("Internal Server Error");
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
        })
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
        "Internal Server Error"
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
