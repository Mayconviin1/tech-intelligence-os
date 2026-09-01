"use client";

import { Layout } from "@/components/layout/layout";
import { Send, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResearching, setIsResearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (content: string, action: "chat" | "deep-research") => {
    if (action === "chat" && !content.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: action === "deep-research" ? `Research: ${content}` : content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError(null);

    const setLoader = action === "deep-research" ? setIsResearching : setIsLoading;
    setLoader(true);

    try {
      const body =
        action === "deep-research"
          ? { action: "deep-research", topic: content }
          : { action: "chat", message: content };

      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      const data = await res.json();

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.response ?? data.result ?? JSON.stringify(data),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoader(false);
    }
  };

  const handleSubmit = () => sendMessage(input, "chat");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-12 h-full flex flex-col">
        <h1 className="text-4xl font-light tracking-tight text-text-primary mb-2">
          Tech Copilot
        </h1>
        <p className="text-sm text-text-secondary mb-8">
          Ask anything about tech, careers, or trends.
        </p>

        {/* Deep research button */}
        <div className="mb-8">
          <button
            disabled={isResearching}
            onClick={() => {
              const topic = input.trim() || "latest technology trends";
              sendMessage(topic, "deep-research");
            }}
            className="h-10 px-5 text-sm font-medium bg-bg-surface border border-border-subtle text-text-secondary rounded-pill hover:border-border-active hover:text-text-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResearching ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Researching...
              </span>
            ) : (
              "Deep Research"
            )}
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24">
              <p className="text-sm text-text-muted text-center max-w-sm">
                Ask me about technologies, career advice, market trends, or
                anything else on your mind.
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed rounded-2xl ${
                  msg.role === "user"
                    ? "bg-text-primary text-bg-primary rounded-br-md"
                    : "bg-bg-surface border border-border-subtle text-text-primary rounded-bl-md"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-bg-surface border border-border-subtle px-4 py-3 rounded-2xl rounded-bl-md">
                <Loader2 className="w-4 h-4 text-text-muted animate-spin" />
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center">
              <p className="text-xs text-red-500 bg-bg-surface border border-border-subtle px-4 py-2 rounded-pill">
                {error}
              </p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            disabled={isLoading}
            className="w-full h-12 pl-5 pr-12 text-sm text-text-primary bg-bg-surface border border-border-subtle rounded-pill focus:outline-none focus:border-border-active transition-colors placeholder:text-text-muted disabled:opacity-50"
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors disabled:opacity-30"
          >
            <Send className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </Layout>
  );
}
