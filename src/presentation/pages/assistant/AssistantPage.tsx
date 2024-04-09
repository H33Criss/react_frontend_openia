import { useEffect, useState } from "react";
import {
  GptMessage,
  MyMessage,
  TextMessageBox,
  TypingLoader,
} from "../../components";
import { createThreadUseCase } from "../../../core/use-cases";
import { postQuestionUseCase } from "../../../core/use-cases/assistant/post-question.use-case";

interface Message {
  text: string;
  isGPT: boolean;
}

export const AssistantPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const [threadId, setThreadId] = useState<string>();

  useEffect(() => {
    const threadId = localStorage.getItem("threadId");
    if (threadId) {
      setThreadId(threadId);
    } else {
      createThreadUseCase().then((id) => {
        setThreadId(id);
        localStorage.setItem("threadId", id);
      });
    }
  }, []);

  //   useEffect(() => {
  //     if (threadId) {
  //       setMessages((prev) => [
  //         ...prev,
  //         { text: `Numero de thread ${threadId}`, isGPT: true },
  //       ]);
  //     }
  //   }, [threadId]);

  const handlePost = async (text: string) => {
    if (!threadId) return;
    setIsLoading(true);

    setMessages((prev) => [...prev, { text, isGPT: false }]);

    const replies = await postQuestionUseCase(threadId, text);
    setIsLoading(false);
    setMessages([]);
    for (const reply of replies) {
      for (const msg of reply.content) {
        setMessages((prev) => [
          ...prev,
          { text: msg, isGPT: reply.role === "assistant" },
        ]);
      }
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <GptMessage text="Buen día, soy Joe, en qué puedo ayudarte?" />

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
      <TextMessageBox
        disableCorrections
        placeholder="Escribe aqui lo que deseas"
        onSendMessage={(message) => handlePost(message)}
      />
    </div>
  );
};
