import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AppHeader } from "@/components/app-header";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/subscription")({
  head: () => ({
    meta: [
      { title: "Subscription — Lumen" },
      { name: "description", content: "Choose your Lumen plan." },
    ],
  }),
  component: SubscriptionPage,
});

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/forever",
    description: "Get started and explore Lumen.",
    features: ["30 messages per day", "Standard model", "Chat history (7 days)"],
    cta: "Current plan",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$15",
    period: "/month",
    description: "For power users who chat all day.",
    features: [
      "Unlimited messages",
      "Priority response speed",
      "Advanced model access",
      "Unlimited chat history",
      "Email support",
    ],
    cta: "Upgrade to Pro",
    highlight: true,
  },
];

function SubscriptionPage() {
  function handleUpgrade(plan: string) {
    if (plan === "Free") return;
    toast.info("Stripe checkout coming soon — payments not yet enabled.");
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <AppHeader />
      <main className="max-w-5xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
            Simple, transparent pricing
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">
            Start free. Upgrade when you need more.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`p-8 relative ${
                plan.highlight
                  ? "border-primary border-2 shadow-lg"
                  : "border-border/60"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                  Most popular
                </span>
              )}
              <h2 className="text-xl font-semibold text-foreground">{plan.name}</h2>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight text-foreground">
                  {plan.price}
                </span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
              <Button
                onClick={() => handleUpgrade(plan.name)}
                variant={plan.highlight ? "default" : "outline"}
                className="w-full mt-6"
                disabled={plan.name === "Free"}
              >
                {plan.cta}
              </Button>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="size-4 text-primary mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
