import { useState } from "react";
import {
  GptMessage,
  GptMessageImage,
  MyMessage,
  TextMessageBox,
  TypingLoader,
} from "../../components";
import { imageGenerationUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGPT: boolean;
  info?: {
    imageUrl: string;
    alt: string;
  };
}

export const ImageGenerationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);

    setMessages((prev) => [...prev, { text, isGPT: false }]);

    const imageInfo = await imageGenerationUseCase(text);
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
    <div className="chat-container ">
      <div className="chat-messages overflow-auto ">
        {" "}
        <div className="grid grid-cols-12 gap-y-2 ">
          <GptMessage text="Hola, ¿que imagen quieres generar hoy?" />

          {messages.map((message, i) =>
            message.isGPT ? (
              <GptMessageImage
                key={i}
                text={message.text}
                imageUrl={message.info?.imageUrl!}
                alt={message.info?.alt!}
              />
            ) : (
              <MyMessage key={i} text={message.text} />
            )
          )}
          {isLoading && (
            <div className="fade-in">
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
  );
};
