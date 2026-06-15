import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { MessageCircle, LogOut, CreditCard, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AppHeader() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  async function handleSignOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  }

  const navLink = (to: "/chat" | "/subscription", icon: React.ReactNode, label: string) => (
    <Link
      to={to}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
        pathname === to
          ? "bg-secondary text-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/chat" className="flex items-center gap-2 text-foreground">
          <MessageCircle className="size-5 text-primary" />
          <span className="font-semibold tracking-tight">Lumen</span>
        </Link>
        <nav className="flex items-center gap-1">
          {navLink("/chat", <MessageSquare className="size-4" />, "Chat")}
          {navLink("/subscription", <CreditCard className="size-4" />, "Plan")}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline ml-1.5">Sign out</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
