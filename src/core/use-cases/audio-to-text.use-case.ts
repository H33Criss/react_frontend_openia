import { AudioToTextResponse } from "../../interfaces";

export const audioToTextUseCase = async (audioFile: File, prompt?: string) => {
  try {
    const formData = new FormData();
    formData.append("file", audioFile);
    if (prompt) formData.append("prompt", prompt);
    const resp = await fetch(`${import.meta.env.VITE_GPT_URL}/audio-to-text`, {
      method: "POST",

      body: formData,
    });
    if (!resp.ok) throw new Error("No se pudo realizar la conversion a texto");

    const data = (await resp.json()) as AudioToTextResponse;
    return data;
  } catch (error) {
    console.log({ error });
    return;
  }
};
