import { useState } from "react";
import {
  GptMessage,
  GptMessageImage,
  MyMessage,
  TextMessageBox,
  TypingLoader,
} from "../../components";
import {
  imageGenerationUseCase,
  imageVariationUseCase,
} from "../../../core/use-cases";
import { GptMessageSelectableImage } from "../../components/chat-bubbles/GptMessageSelectableImage";

interface Message {
  text: string;
  isGPT: boolean;
  info?: {
    imageUrl: string;
    alt: string;
  };
}

export const ImageTunningPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      isGPT: true,
      text: "Imagen Base",
      info: {
        alt: "Imagen base",
        imageUrl:
          "http://localhost:3000/gpt/image-generation/1712025742985.png",
      },
    },
  ]);
  const [originalImageAndMask, setOriginalImageAndMask] = useState({
    original: undefined as string | undefined,
    mask: undefined as string | undefined,
  });
  const handleVariation = async () => {
    setIsLoading(true);
    const resp = await imageVariationUseCase(originalImageAndMask.original!);
    setIsLoading(false);
    if (!resp) return;

    setMessages((prev) => [
      ...prev,
      {
        text: "Variacion",
        isGPT: true,
        info: {
          imageUrl: resp.url[0],
          alt: resp.alt ?? "",
        },
      },
    ]);
  };

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text, isGPT: false }]);

    const { original, mask } = originalImageAndMask;

    const imageInfo = await imageGenerationUseCase(text, original, mask);
    setIsLoading(false);

    if (!imageInfo) {
      return setMessages((prev) => [
        ...prev,
        { text: "No se puedo genenerar la imagen", isGPT: true },
      ]);
    }

    setMessages((prev) => [
      ...prev,
      {
        text: text,
        isGPT: true,
        info: {
          imageUrl: imageInfo.url[0],
          alt: imageInfo.alt ?? "",
        },
      },
    ]);
  };

  return (
    <>
      {originalImageAndMask.original && (
        <div className="fixed flex flex-col items-center top-10 right-10 z-10 fade-in">
          <span>Editando</span>
          <img
            src={originalImageAndMask.mask ?? originalImageAndMask.original}
            alt="Imagen original"
            className="border rounded-xl w-36 h-36 object-contain"
          />
          <button onClick={handleVariation} className="btn-primary mt-2">
            Generar variación
          </button>
        </div>
      )}
      <div className="chat-container ">
        <div className="chat-messages  ">
          {" "}
          <div className="grid grid-cols-12 gap-y-2 ">
            <GptMessage text="Hola, ¿que imagen quieres generar hoy?" />

            {messages.map((message, i) =>
              message.isGPT ? (
                <GptMessageSelectableImage
                  // <GptMessageImage
                  key={i}
                  text={message.text}
                  imageUrl={message.info?.imageUrl!}
                  alt={message.info?.alt!}
                  onImageSelect={(maskImageUrl) =>
                    setOriginalImageAndMask({
                      original: message.info?.imageUrl,
                      mask: maskImageUrl,
                    })
                  }
                />
              ) : (
                <MyMessage key={i} text={message.text} />
              )
            )}
            {isLoading && (
              <div className="col-start-1 col-end-12 fade-in">
                <TypingLoader />
              </div>
            )}
          </div>
        </div>
        <TextMessageBox
          disableCorrections
          placeholder="Escribe aqui lo que deseas"
          onSendMessage={(message) => handlePost(message)}
        />
      </div>
    </>
  );
};
