"use server";

import {
  IAuthUser,
  IAuthUserResult,
  IUserUsage,
  IUserUsageResult,
} from "@/_interface/Interface";
import { cookies } from "next/headers";

const address = {
  SERVER_API_URL: process.env.API_BASE_URL,
};

export async function getUser(): Promise<IAuthUserResult> {
  const cookiesStore = await cookies();

  try {
    const res = await fetch(`${address.SERVER_API_URL}/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookiesStore.toString(),
      },
    });

    if (!res.ok) {
      const err = await res.json();

      if (res.status >= 500) {
        throw new Error(err.message);
      }

      return {
        message: err.message,
      };
    }

    const user: IAuthUser = await res.json();

    return {
      user,
    };
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error("Network error");
  }
}

export async function getUserUsage(): Promise<IUserUsageResult> {
  const cookiesStore = await cookies();

  try {
    const res = await fetch(`${address.SERVER_API_URL}/user/usage`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookiesStore.toString(),
      },
    });

    if (!res.ok) {
      const err = await res.json();

      if (res.status >= 500) {
        throw new Error(err.message);
      }

      return {
        message: err.message,
      };
    }

    const usage: IUserUsage = await res.json();

    return {
      usage,
    };
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error("Network error");
  }
}
