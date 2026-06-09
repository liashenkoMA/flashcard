import { IWord, IWordFormData } from "@/_interface/Interface";

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

export async function addWord(
  formData: IWordFormData,
): Promise<{ data: string }> {
  try {
    const res = await fetch(`${address.baseUrl}/words/add`, {
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

export async function deleteWord(formData: IWord) {
  try {
    const res = await fetch(`${address.baseUrl}/words/${formData._id}`, {
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

export async function getWordsCategory(): Promise<string[]> {
  try {
    const res = await fetch(`${address.baseUrl}/words/category`, {
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
