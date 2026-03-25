import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const plans = [
  {
    name: "Lite",
    key: "lite",
    monthlyPrice: 20,
    yearlyPrice: 200,
    desc: "Great for individuals just starting out",
    features: ["3 resumes", "2 templates", "PDF export", "Email support"],
    popular: false,
  },
  {
    name: "Pro",
    key: "pro",
    monthlyPrice: 100,
    yearlyPrice: 1000,
    desc: "Best for active job seekers",
    features: [
      "Unlimited resumes",
      "All 3 templates",
      "PDF export",
      "Priority support",
      "Custom branding",
      "Resume analytics",
    ],
    popular: true,
  },
  {
    name: "Plus",
    key: "plus",
    monthlyPrice: 150,
    yearlyPrice: 1500,
    desc: "For power users and teams",
    features: [
      "Everything in Pro",
      "Team sharing",
      "Advanced analytics",
      "API access",
      "Dedicated manager",
      "White-label export",
    ],
    popular: false,
  },
];

export function Pricing() {
  const [yearly, setYearly] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const { identity, login } = useInternetIdentity();
  const { actor } = useActor();
  const isAuthenticated = identity && !identity.getPrincipal().isAnonymous();

  const handleSubscribe = async (plan: (typeof plans)[0]) => {
    if (!isAuthenticated) {
      login();
      return;
    }
    if (!actor) return;
    setLoading(plan.key);
    try {
      const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;
      const origin = window.location.origin;
      const url = await actor.createCheckoutSession(
        [
          {
            productName: `ResumeForge ${plan.name} ${yearly ? "Yearly" : "Monthly"}`,
            productDescription: plan.desc,
            priceInCents: BigInt(price * 100),
            quantity: BigInt(1),
            currency: "usd",
          },
        ],
        `${origin}/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan.key}&cycle=${yearly ? "yearly" : "monthly"}`,
        `${origin}/cancel`,
      );
      window.location.href = url;
    } catch {
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
            Pricing
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2 mb-3">
            Choose Your Plan
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Start free, upgrade anytime. All plans include a 7-day free trial.
          </p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <span
              className={`text-sm font-medium ${!yearly ? "text-gray-900 dark:text-white" : "text-gray-400"}`}
            >
              Monthly
            </span>
            <button
              type="button"
              onClick={() => setYearly(!yearly)}
              className={`relative w-12 h-6 rounded-full transition-colors ${yearly ? "bg-gradient-to-r from-orange-500 to-purple-600" : "bg-gray-300 dark:bg-gray-600"}`}
              aria-label="Toggle billing period"
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${yearly ? "translate-x-7" : "translate-x-1"}`}
              />
            </button>
            <span
              className={`text-sm font-medium ${yearly ? "text-gray-900 dark:text-white" : "text-gray-400"}`}
            >
              Yearly
              <span className="ml-2 text-xs text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded-full">
                Save 17%
              </span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={`relative rounded-2xl p-7 bg-white dark:bg-gray-800 border transition-shadow hover:shadow-lg ${plan.popular ? "border-purple-500 shadow-xl shadow-purple-500/10 scale-105" : "border-gray-200 dark:border-gray-700"}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-orange-500 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    ⭐ Most Popular
                  </span>
                </div>
              )}
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {plan.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-4">
                {plan.desc}
              </p>
              <div className="mb-6">
                <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
                  ${yearly ? plan.yearlyPrice : plan.monthlyPrice}
                </span>
                <span className="text-gray-400 text-sm ml-1">
                  /{yearly ? "yr" : "mo"}
                </span>
                {yearly && (
                  <p className="text-xs text-green-600 mt-1">
                    (${(plan.yearlyPrice / 12).toFixed(0)}/mo billed annually)
                  </p>
                )}
              </div>
              <ul className="space-y-3 mb-7">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                  >
                    <span className="text-green-500 mt-0.5 flex-shrink-0">
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => handleSubscribe(plan)}
                disabled={loading === plan.key}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${plan.popular ? "bg-gradient-to-r from-orange-500 to-purple-600 text-white hover:opacity-90 shadow-lg" : "border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"} disabled:opacity-50`}
              >
                {loading === plan.key
                  ? "Redirecting..."
                  : isAuthenticated
                    ? "Subscribe Now"
                    : "Sign In to Subscribe"}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            All plans use Stripe for secure payments. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
