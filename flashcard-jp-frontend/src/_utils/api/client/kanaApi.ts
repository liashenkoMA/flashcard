"use client";

import {
  IKana,
  IUpdateHiraganaWeightResponse,
  IUpdateHirakanaResponse,
  IUpdateKatakanaResponse,
  IUpdateKatakanaWeightResponse,
  IWeightStatus,
} from "@/_interface/Interface";
import { symbol } from "zod";

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

export async function updateHiragana(
  kana: IKana,
): Promise<IUpdateHirakanaResponse> {
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

    return checkResponse<IUpdateHirakanaResponse>(res);
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error("Network error");
  }
}

export async function updateKatakana(
  kana: IKana,
): Promise<IUpdateKatakanaResponse> {
  try {
    const res = await fetch(`${address.CLIENT_API_URL}/katakana/update`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symbol: kana.symbol,
      }),
    });

    return checkResponse<IUpdateKatakanaResponse>(res);
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error("Network error");
  }
}

export async function updateHiraganaWeight(
  kana: IKana,
  status: IWeightStatus,
): Promise<IUpdateHiraganaWeightResponse> {
  try {
    const res = await fetch(`${address.CLIENT_API_URL}/hiragana/updateweight`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symbol: kana.symbol,
        status: status.status,
      }),
    });

    return checkResponse<IUpdateHiraganaWeightResponse>(res);
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error("Network error");
  }
}

export async function updateKatakanaWeight(
  kana: IKana,
  status: IWeightStatus,
): Promise<IUpdateKatakanaWeightResponse> {
  try {
    const res = await fetch(`${address.CLIENT_API_URL}/katakana/updateweight`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symbol: kana.symbol,
        status: status.status,
      }),
    });

    return checkResponse<IUpdateKatakanaWeightResponse>(res);
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error("Network error");
  }
}
