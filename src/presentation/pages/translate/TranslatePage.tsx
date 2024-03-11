import { useState } from "react";
import {
  MyMessage,
  TextMessageBox,
  TypingLoader,
  GptMessage,
  TextMessageBoxSelect,
} from "../../components";
import { translateTextUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGPT: boolean;
}
const languages = [
  { id: "alemán", text: "Alemán" },
  { id: "árabe", text: "Árabe" },
  { id: "bengalí", text: "Bengalí" },
  { id: "francés", text: "Francés" },
  { id: "hindi", text: "Hindi" },
  { id: "inglés", text: "Inglés" },
  { id: "japonés", text: "Japonés" },
  { id: "mandarín", text: "Mandarín" },
  { id: "portugués", text: "Portugués" },
  { id: "ruso", text: "Ruso" },
];

export const TranslatePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, selectedOption: string) => {
    setIsLoading(true);
    const newMessage = `Traduce : "${text}" al idioma ${selectedOption}`;
    setMessages((prev) => [...prev, { text: newMessage, isGPT: false }]);

    const { ok, message } = await translateTextUseCase(text, selectedOption);

    setIsLoading(false);
    if (!ok) {
      return alert(message);
    }

    setMessages((prev) => [...prev, { text: message, isGPT: true }]);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <GptMessage text="Hola, ¿Qué quieres que traduzca hoy?" />

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
      <TextMessageBoxSelect
        options={languages}
        placeholder="Escribe aqui lo que deseas"
        onSendMessage={handlePost}
      />
    </div>
  );
};
