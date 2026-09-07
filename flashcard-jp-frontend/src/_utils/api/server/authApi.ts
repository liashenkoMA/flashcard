"use server";

import {
  ILoginFormData,
  ILoginResponse,
  ILoginResult,
} from "@/_interface/Interface";
import { cookies } from "next/headers";

const address = {
  baseUrl: process.env.API_BASE_URL,
};

export async function login(formData: ILoginFormData): Promise<ILoginResult> {
  try {
    const res = await fetch(`${address.baseUrl}/auth/signin`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
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

    const data: ILoginResponse = await res.json();

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    (await cookies()).set("session_flashcard", data.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      domain: ".flashcardsjp.ru",
      path: "/",
      expires: expiresAt,
    });

    return { user: data.user };
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error("Network error");
  }
}

export async function logout() {
  (await cookies()).set("session_flashcard", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    domain: ".flashcardsjp.ru",
    path: "/",
    maxAge: 0,
  });
}

export async function deleteUser() {
  try {
    const session = (await cookies()).get("session_flashcard")?.value;

    const res = await fetch(`${address.baseUrl}/user`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...{ Cookie: `session_flashcard=${session}` },
      },
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(`${err.message}`);
    }

    (await cookies()).set("session_flashcard", "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      domain: ".flashcardsjp.ru",
      path: "/",
      maxAge: 0,
    });
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error("Network error");
  }
}
