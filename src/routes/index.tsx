import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Sparkles, Zap, Shield } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumen — AI chat, simplified" },
      { name: "description", content: "A clean, fast AI assistant for everyday work. Sign up free." },
      { property: "og:title", content: "Lumen — AI chat, simplified" },
      { property: "og:description", content: "A clean, fast AI assistant for everyday work." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border/60">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-foreground">
            <MessageCircle className="size-5 text-primary" />
            <span className="font-semibold tracking-tight">Lumen</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/auth">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/auth">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-4 py-20 md:py-32 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground mb-6">
            <Sparkles className="size-3 text-primary" />
            Powered by Lovable AI
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-foreground leading-[1.05]">
            AI chat,
            <br />
            <span className="text-primary">simplified.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mt-6 max-w-2xl mx-auto">
            A fast, clean assistant for writing, ideas, code, and everything in between.
          </p>
          <div className="mt-10 flex items-center justify-center gap-3">
            <Link to="/auth">
              <Button size="lg" className="rounded-full px-6">
                Start chatting <ArrowRight className="size-4 ml-1" />
              </Button>
            </Link>
            <Link to="/subscription">
              <Button size="lg" variant="outline" className="rounded-full px-6">
                See pricing
              </Button>
            </Link>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: "Instant answers", body: "Streaming responses, no waiting." },
            { icon: Shield, title: "Private by default", body: "Your conversations stay yours." },
            { icon: Sparkles, title: "Always improving", body: "Powered by the latest models." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="text-center">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon className="size-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{body}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Lumen
      </footer>
    </div>
  );
}
