import { ITelegramFormData } from "@/_interface/Interface";

async function checkResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`${err.message}`);
  }
  const result: T = await res.json();
  return result;
}

export async function telegramMessage(formData: ITelegramFormData) {
  const messageData = `
    Новое сообщение:
    Имя: ${formData.name}
    Сообщение: ${formData.text}
    `;

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${process.env.NEXT_PUBLIC_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.NEXT_PUBLIC_CHAT_ID,
          text: messageData,
          parse_mode: "HTML",
        }),
      },
    );

    return checkResponse(res);
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error("Network error");
  }
}
