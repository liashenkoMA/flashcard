import { IKana, IUpdateKanaResponse } from "@/_interface/Interface";

const address = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

async function checkResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json();
    throw new Error(`${error.message}`);
  }

  const result: T = await res.json();
  return result;
}

export async function getHiragana(): Promise<IKana[]> {
  try {
    const res = await fetch(`${address.baseUrl}/hiragana`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return checkResponse<IKana[]>(res);
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error("Network error");
  }
}

export async function updateHiragana(
  kana: IKana,
): Promise<IUpdateKanaResponse> {
  try {
    const res = await fetch(`${address.baseUrl}/hiragana/update`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symbol: kana.symbol,
      }),
    });

    return checkResponse<IUpdateKanaResponse>(res);
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error("Network error");
  }
}
