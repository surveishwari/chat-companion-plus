import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Loader2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/app-header";

export const Route = createFileRoute("/_authenticated/chat")({
  head: () => ({
    meta: [
      { title: "Chat — Lumen" },
      { name: "description", content: "Chat with Lumen, your AI assistant." },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const transport = new DefaultChatTransport({ api: "/api/chat" });
  const { messages, sendMessage, status } = useChat({
    transport,
    onError: (err) => toast.error(err.message || "Chat failed"),
  });
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const text = input.trim();
    setInput("");
    await sendMessage({ text });
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 pb-4">
        <div ref={scrollRef} className="flex-1 overflow-y-auto py-6 space-y-6">
          {messages.length === 0 ? (
            <EmptyState />
          ) : (
            messages.map((m) => <Message key={m.id} message={m} />)
          )}
          {status === "submitted" && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Thinking…
            </div>
          )}
        </div>
        <form
          onSubmit={handleSubmit}
          className="sticky bottom-0 bg-background pt-2 pb-3"
        >
          <div className="relative rounded-2xl border border-border bg-card shadow-sm focus-within:border-primary/60 transition-colors">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Message Lumen…"
              rows={1}
              className="min-h-[56px] max-h-48 resize-none border-0 bg-transparent pr-14 py-4 focus-visible:ring-0 shadow-none"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 bottom-2 size-9 rounded-full"
            >
              <ArrowUp className="size-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Lumen can make mistakes. Verify important info.
          </p>
        </form>
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center py-16">
      <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <MessageCircle className="size-6 text-primary" />
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
        How can I help today?
      </h2>
      <p className="text-muted-foreground mt-1.5 text-sm">
        Ask anything — ideas, writing, code, explanations.
      </p>
    </div>
  );
}

function Message({ message }: { message: UIMessage }) {
  const text = message.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("");
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl bg-primary text-primary-foreground px-4 py-2.5 text-sm whitespace-pre-wrap">
          {text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-3">
      <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
        <MessageCircle className="size-4 text-primary" />
      </div>
      <div className="flex-1 text-sm leading-relaxed text-foreground whitespace-pre-wrap pt-1">
        {text}
      </div>
    </div>
  );
}
