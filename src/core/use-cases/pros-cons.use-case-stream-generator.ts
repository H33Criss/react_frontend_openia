export async function* prosConsStreamGeneratorUseCase(
  prompt: string,
  abortSignal: AbortSignal
) {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_GPT_URL}/pros-cons-discusser-stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
        signal: abortSignal,
      }
    );
    if (!resp.ok)
      throw new Error("No se pudo cargar la siguiente pieza de la discusión");
    const reader = resp.body?.getReader();
    if (!reader) {
      console.log("Reader no creado");
      return null;
    }
    const decoder = new TextDecoder();
    let text = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const decodedChunk = decoder.decode(value, { stream: true });
      text += decodedChunk;
      yield text;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}
