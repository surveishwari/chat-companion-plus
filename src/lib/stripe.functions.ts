import { createServerFn } from "@tanstack/react-start";
import { getRequestHost, getRequestHeader } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const createCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("Stripe is not configured. Add STRIPE_SECRET_KEY.");

    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(key);

    const proto = getRequestHeader("x-forwarded-proto") ?? "https";
    const host = getRequestHost();
    const origin = `${proto}://${host}`;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: context.claims?.email as string | undefined,
      client_reference_id: context.userId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            recurring: { interval: "month" },
            product_data: {
              name: "OpenVerb AI Pro",
              description: "Unlimited messages, advanced model, priority support.",
            },
            unit_amount: 1500,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/subscription?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/subscription?status=canceled`,
    });

    if (!session.url) throw new Error("Failed to create checkout session.");
    return { url: session.url };
  });
