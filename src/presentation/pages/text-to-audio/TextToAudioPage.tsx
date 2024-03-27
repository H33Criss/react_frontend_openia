import { useState } from "react";
import {
  GptMessage,
  GptMessageAudio,
  MyMessage,
  TextMessageBoxSelect,
  TypingLoader,
} from "../../components";
import { textToAudioUseCase } from "../../../core/use-cases";

interface TextMessage {
  text: string;
  isGPT: boolean;
  type: "text";
}
interface AudioMessage {
  text: string;
  isGPT: boolean;
  audioUrl: string;
  type: "audio";
}
type Message = TextMessage | AudioMessage;

const voices = [
  { id: "nova", text: "Nova" },
  { id: "alloy", text: "Alloy" },
  { id: "echo", text: "Echo" },
  { id: "fable", text: "Fable" },
  { id: "onyx", text: "Onyx" },
  { id: "shimmer", text: "Shimmer" },
];

export const TextToAudioPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, selectedVoice: string) => {
    setIsLoading(true);

    setMessages((prev) => [...prev, { text, isGPT: false, type: "text" }]);

    //TODO: UseCase
    const { ok, message, audioUrl } = await textToAudioUseCase(
      text,
      selectedVoice
    );
    setIsLoading(false);
    if (!ok) return;
    //TODO: Añadir el mensaje de isGPT en true
    setMessages((prev) => [
      ...prev,
      {
        text: `Voz: ${selectedVoice} \n\n  "${message}"`,
        isGPT: true,
        type: "audio",
        audioUrl: audioUrl!,
      },
    ]);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <GptMessage text="¿Que palabras quieres convertir a audio?" />

          {messages.map((message, i) =>
            message.isGPT ? (
              message.type === "audio" ? (
                <GptMessageAudio
                  key={i}
                  text={message.text}
                  audioUrl={message.audioUrl}
                />
              ) : (
                <GptMessage key={i} text={message.text} />
              )
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
      <TextMessageBoxSelect
        options={voices}
        placeholder="Escribe aqui lo que deseas"
        onSendMessage={handlePost}
      />
    </div>
  );
};
