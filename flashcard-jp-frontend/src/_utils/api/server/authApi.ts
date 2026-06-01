"use server";

import { ILoginFormData, ILoginResponse } from "@/_interface/Interface";
import { cookies } from "next/headers";

const address = {
  baseUrl: process.env.API_BASE_URL,
};

export async function login(formData: ILoginFormData) {
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
      throw new Error(`${err.message}`);
    }

    const data: ILoginResponse = await res.json();

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    (await cookies()).set("session_flashcard", data.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      expires: expiresAt,
    });

    return { name: data.name };
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error("Network error");
  }
}

export async function logout() {
  (await cookies()).delete("session_flashcard");
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

    (await cookies()).delete("session_flashcard");
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error("Network error");
  }
}
