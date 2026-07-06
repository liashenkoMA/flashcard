import {
  IKanji,
  IKanjiFormData,
  IUpdateKanjiWeightResponse,
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

export async function addKanji(
  formData: IKanjiFormData,
): Promise<{ data: string }> {
  try {
    const res = await fetch(`${address.baseUrl}/kanji/add`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        kanji: formData.kanji,
        level: formData.level,
        jpRead: formData.jpRead,
        chinaRead: formData.chinaRead,
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

export async function deleteKanji(formData: IKanji) {
  try {
    const res = await fetch(`${address.baseUrl}/kanji/${formData._id}`, {
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

export async function updateKanjiWeight(
  kanji: IKanji,
  status: IWeightStatus,
): Promise<IUpdateKanjiWeightResponse> {
  try {
    const res = await fetch(`${address.baseUrl}/kanji/updateweight`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kanjiId: kanji._id,
        status: status.status,
      }),
    });

    return checkResponse<IUpdateKanjiWeightResponse>(res);
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error("Network error");
  }
}
