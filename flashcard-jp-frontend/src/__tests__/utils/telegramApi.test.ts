import { ITelegramFormData } from "@/_interface/Interface";
import { telegramMessage } from "@/_utils/api/client/telegramApi";

global.fetch = jest.fn();

describe("Telegram Api", () => {
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_BOT_TOKEN = "test-token";
    process.env.NEXT_PUBLIC_CHAT_ID = "test-chat-id";
  });

  describe("telegramMessage", () => {
    it("Ошибка сети при отправке сообщения в Telegram", async () => {
      const mockFormData: ITelegramFormData = {
        name: "Иван",
        text: "Тестовое сообщение",
      };

      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(telegramMessage(mockFormData)).rejects.toThrow(
        "Network Error",
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешная отправка сообщения в Telegram", async () => {
      const mockFormData: ITelegramFormData = {
        name: "Иван",
        text: "Тестовое сообщение",
      };

      const mockResponse = {
        ok: true,
        result: {
          message_id: 123,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await telegramMessage(mockFormData);

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/sendMessage"),
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: "test-chat-id",
            text: `
    Новое сообщение:
    Имя: ${mockFormData.name}
    Сообщение: ${mockFormData.text}
    `,
            parse_mode: "HTML",
          }),
        }),
      );
    });

    it("Сервер вернул !res.ok", async () => {
      const mockFormData: ITelegramFormData = {
        name: "Иван",
        text: "Тестовое сообщение",
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          message: "Bad Request: chat not found",
        }),
      } as Response);

      await expect(telegramMessage(mockFormData)).rejects.toThrow(
        "Bad Request: chat not found",
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
