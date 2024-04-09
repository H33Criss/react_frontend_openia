import { ProsConsResponse } from "../../../interfaces";

export const prosConsUseCase = async (prompt: string) => {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_GPT_URL}/pros-cons-discusser`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      }
    );
    if (!resp.ok) throw new Error("No se pudo realizar la discusión");

    const data = (await resp.json()) as ProsConsResponse;
    return {
      ok: true,
      message: data.content,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "No se puede realizar la discusión",
    };
  }
};
