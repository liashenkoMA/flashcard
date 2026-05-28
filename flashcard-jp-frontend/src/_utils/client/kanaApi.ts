"use client"

import { IKana, IUpdateKanaResponse } from "@/_interface/Interface";

const address = {
  CLIENT_API_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
};

async function checkResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json();
    throw new Error(`${error.message}`);
  }

  const result: T = await res.json();
  return result;
}

export async function updateHirakana(
  kana: IKana,
): Promise<IUpdateKanaResponse> {
  try {
    const res = await fetch(`${address.CLIENT_API_URL}/hiragana/update`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
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

export async function updateKatakana(
  kana: IKana,
): Promise<IUpdateKanaResponse> {
  try {
    const res = await fetch(`${address.CLIENT_API_URL}/katakana/update`, {
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
