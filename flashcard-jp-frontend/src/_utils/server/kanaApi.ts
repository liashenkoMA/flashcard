"use server";

import { IKana } from "@/_interface/Interface";
import { cookies } from "next/headers";

const address = {
  SERVER_API_URL: process.env.API_BASE_URL,
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
  const cookieStore = await cookies();

  try {
    const res = await fetch(`${address.SERVER_API_URL}/hiragana`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
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

export async function getKatakana(): Promise<IKana[]> {
  const cookieStore = await cookies();

  try {
    const res = await fetch(`${address.SERVER_API_URL}/katakana`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
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
