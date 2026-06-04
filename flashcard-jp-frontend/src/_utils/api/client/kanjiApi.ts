import { IKanjiFormData } from "@/_interface/Interface";

const address = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

async function checkResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`${err.message}`);
  }
  const result: T = await res.json();
  return result;
}

export async function addKanji(
  formData: IKanjiFormData,
): Promise<{ data: string }> {
  try {
    const res = await fetch(`${address.baseUrl}/user`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        kanji: formData.kanji,
        jpRead: formData.jpRead,
        chinaRead: formData.chinaRead,
        translate: formData.translate,
      }),
    });

    return checkResponse<{ data: string }>(res);
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error("Network error");
  }
}
