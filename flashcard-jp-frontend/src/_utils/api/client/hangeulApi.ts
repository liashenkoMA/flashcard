"use client";

import {
  IHangeul,
  IUpdateHangeulResponse,
  IUpdateHangeulWeightResponse,
  IWeightStatus,
} from "@/_interface/Interface";

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

export async function updateHangeul(
  hangeul: IHangeul,
): Promise<IUpdateHangeulResponse> {
  try {
    const res = await fetch(`${address.CLIENT_API_URL}/hangeul/update`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        symbol: hangeul.symbol,
      }),
    });

    return checkResponse<IUpdateHangeulResponse>(res);
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error("Network error");
  }
}

export async function updateHangeulWeight(
  hangeul: IHangeul,
  status: IWeightStatus,
): Promise<IUpdateHangeulWeightResponse> {
  try {
    const res = await fetch(`${address.CLIENT_API_URL}/hangeul/updateweight`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symbol: hangeul.symbol,
        status: status.status,
      }),
    });

    return checkResponse<IUpdateHangeulWeightResponse>(res);
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error("Network error");
  }
}
