import { useState, useRef, useEffect } from "react";
import { usePatientStore} from "../stores/usePatientStore";
import { formatMarkdown} from "../stores/formatMarkdown";
import { useRouter } from "next/router";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const router = useRouter();
  const { info } = usePatientStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat` , {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          patient_info: {
            age: info.age,
            gender: info.gender,
            height: info.height,
            weight: info.weight,
            dialysisType: info.dialysisType,
            urineOutput: info.urineOutput,
            comorbidities: {
              diabetes: info.comorbidities?.diabetes ?? false,
              hypertension: info.comorbidities?.hypertension ?? false,
            },
          },
        }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (error) {
      console.error("Chat API error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❗죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-screen max-w-2xl mx-auto bg-[#F9FAFB] dark:bg-[#1a1a1a] text-[#333D4B] dark:text-white px-4 pt-6 pb-4">
      {/* Header */}
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-lg sm:text-2xl font-semibold">🍽️ 신장환자 식이 관련 챗봇</h1>
        <button
          onClick={() => router.push("/")}
          className="text-[#3182F6] text-sm font-medium hover:underline"
        >
          홈으로
        </button>
      </header>

      {/* Chat Area */}
      <section className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {messages.length === 0 && (
          <div className="text-center text-[#8B95A1] mt-12">
            <p className="text-base">식이에 대해 물어보세요!</p>
            <p className="text-sm mt-1 italic text-[#A1AAB3]">
              예: &quot;사과와 바나나를 같이 먹어도 될까요?&quot;
            </p>
          </div>
        )}

      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[75%] px-4 py-2 text-sm leading-relaxed shadow-md transition-all
              rounded-2xl ${
                message.role === "user"
                  ? "bg-[#3182F6] text-white rounded-br-none"
                  : "bg-white text-[#333D4B] dark:bg-[#2a2d30] dark:text-white rounded-bl-none"
              }`}
          >
            {message.role === "assistant"
              ? formatMarkdown(message.content)
              : message.content}
          </div>
        </div>
      ))}

        {isLoading && (
          <div className="flex justify-start pl-1">
            <div className="bg-white dark:bg-[#2a2d30] rounded-2xl px-3 py-2 flex items-center space-x-1.5 shadow-sm">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </section>

      {/* Input Area */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 items-center mt-4"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="식이에 대해 물어보세요..."
          className="flex-1 px-4 py-2 rounded-lg border border-[#D1D6DB] dark:border-[#3a3d40] 
                     bg-white dark:bg-[#1a1a1a] text-sm focus:outline-none 
                     focus:ring-2 focus:ring-[#3182F6] focus:border-transparent
                     transition duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || input.trim() === ""}
          className="px-4 py-2 bg-[#3182F6] text-white rounded-lg 
                     hover:bg-[#1e6ae1] disabled:bg-[#A4C2F4] 
                     disabled:cursor-not-allowed transition duration-200 font-semibold"
        >
          전송
        </button>
      </form>
    </main>
  );
}
