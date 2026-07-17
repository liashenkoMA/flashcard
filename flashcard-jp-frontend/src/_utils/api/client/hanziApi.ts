import {
  IHanzi,
  IHanziFormData,
  IUpdateHanziWeightResponse,
  IWeightStatus,
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

export async function addHanzi(
  formData: IHanziFormData,
): Promise<{ data: string }> {
  try {
    const res = await fetch(`${address.baseUrl}/hanzi/add`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hanzi: formData.hanzi,
        pinyin: formData.pinyin,
        category: formData.category,
        translate: formData.translate,
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

export async function deleteHanzi(formData: IHanzi) {
  try {
    const res = await fetch(`${address.baseUrl}/hanzi/${formData._id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return checkResponse<{ data: string }>(res);
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error("Network error");
  }
}

export async function getHanziCategory(): Promise<string[]> {
  try {
    const res = await fetch(`${address.baseUrl}/hanzi/category`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return checkResponse<string[]>(res);
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error("Network error");
  }
}

export async function updateHanziWeight(
  hanzi: IHanzi,
  status: IWeightStatus,
): Promise<IUpdateHanziWeightResponse> {
  try {
    const res = await fetch(`${address.baseUrl}/hanzi/updateweight`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hanziId: hanzi._id,
        status: status.status,
      }),
    });

    return checkResponse<IUpdateHanziWeightResponse>(res);
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error("Network error");
  }
}
