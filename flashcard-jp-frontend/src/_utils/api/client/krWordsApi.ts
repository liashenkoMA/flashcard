import { IUpdateWordWeightResponse, IWeightStatus, IWord, IWordFormData } from "@/_interface/Interface";

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

export async function addKrWord(
  formData: IWordFormData,
): Promise<{ data: string }> {
  try {
    const res = await fetch(`${address.baseUrl}/words-ko/add`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        word: formData.word,
        translate: formData.translate,
        category: formData.category,
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

export async function deleteKrWord(formData: IWord) {
  try {
    const res = await fetch(`${address.baseUrl}/words-ko/${formData._id}`, {
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

export async function getKrWordsCategory(): Promise<string[]> {
  try {
    const res = await fetch(`${address.baseUrl}/words-ko/category`, {
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

export async function updateKrWordWeight(
  word: IWord,
  status: IWeightStatus,
): Promise<IUpdateWordWeightResponse> {
  try {
    const res = await fetch(`${address.baseUrl}/words-ko/updateweight`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wordId: word._id,
        status: status.status,
      }),
    });

    return checkResponse<IUpdateWordWeightResponse>(res);
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error("Network error");
  }
}
