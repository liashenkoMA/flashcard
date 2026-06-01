"use server";

import { IKandji } from "@/_interface/Interface";
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

export async function getKanji(): Promise<IKandji[]> {
  const cookiesStore = await cookies();

  try {
    const res = await fetch(`${address.SERVER_API_URL}/kanji`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookiesStore.toString(),
      },
    });

    return checkResponse<IKandji[]>(res);
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error("Network error");
  }
}
