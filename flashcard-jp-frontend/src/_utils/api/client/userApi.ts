import {
  IAuthUser,
  IProfileFormData,
  IProfileResponse,
  IRegisterFormData,
} from "@/_interface/Interface";

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

export async function createUser(
  formData: IRegisterFormData,
): Promise<{ data: string }> {
  try {
    const res = await fetch(`${address.baseUrl}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
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

export async function getUser(): Promise<IAuthUser> {
  try {
    const res = await fetch(`${address.baseUrl}/user`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return checkResponse<IAuthUser>(res);
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error("Network error");
  }
}

export async function updateUser(
  formData: IProfileFormData,
): Promise<IProfileResponse> {
  try {
    const res = await fetch(`${address.baseUrl}/user/update`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        newPassword: formData.newPassword,
        currentPassword: formData.currentPassword,
      }),
    });

    return checkResponse<IProfileResponse>(res);
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error("Network error");
  }
}
