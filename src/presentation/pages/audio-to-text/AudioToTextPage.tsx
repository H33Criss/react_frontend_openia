import { useState } from "react";
import {
  GptMessage,
  MyMessage,
  TextMessageBoxFile,
  TypingLoader,
} from "../../components";
import { audioToTextUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGPT: boolean;
}

export const AudioToTextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, audioFile: File) => {
    setIsLoading(true);

    setMessages((prev) => [...prev, { text, isGPT: false }]);

    //TODO: UseCase
    const resp = await audioToTextUseCase(audioFile, text);
    setIsLoading(false);
    if (!resp) return;
    const gptMessage = `
## Transcripcion
__Duración:__ ${Math.round(resp.duration)} segundos
### El Texto es:
${resp.text}
    `;
    setMessages((prev) => [...prev, { text: gptMessage, isGPT: true }]);
    for (const segment of resp.segments) {
      const segmentMessage = `
__De ${Math.round(segment.start)} a ${Math.round(segment.end)} segundos:__
${segment.text}
        `;
      setMessages((prev) => [...prev, { text: segmentMessage, isGPT: true }]);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <GptMessage text="Hola, que AUDIO quieres generar a texto?" />

          {messages.map((message, i) =>
            message.isGPT ? (
              <GptMessage key={i} text={message.text} />
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
      <TextMessageBoxFile
        disableCorrections
        placeholder="Escribe aqui lo que deseas"
        onSendMessage={handlePost}
        accept="audio/*"
      />
    </div>
  );
};
