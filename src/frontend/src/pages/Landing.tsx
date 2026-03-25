import { Link } from "@tanstack/react-router";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const features = [
  {
    icon: "🎨",
    title: "Beautiful Templates",
    desc: "Choose from Minimal, Modern, and Creative designs crafted by professionals.",
  },
  {
    icon: "⚡",
    title: "Live Preview",
    desc: "See your resume update in real-time as you type — no guessing required.",
  },
  {
    icon: "📄",
    title: "PDF Export",
    desc: "Download a print-ready PDF of your resume with a single click.",
  },
  {
    icon: "📝",
    title: "All Sections",
    desc: "Personal info, summary, skills, experience, education, and projects.",
  },
  {
    icon: "💾",
    title: "Auto-Save",
    desc: "Your progress is saved automatically so you never lose your work.",
  },
  {
    icon: "📱",
    title: "Fully Responsive",
    desc: "Build and preview your resume on any device, anywhere.",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    quote:
      "ResumeForge helped me land my dream job at a top tech company. The templates are stunning!",
  },
  {
    name: "Marcus Williams",
    role: "Product Manager",
    quote:
      "I updated my resume in under 30 minutes. The live preview made everything so easy.",
  },
];

export function Landing() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0B1220] via-[#111827] to-[#1a0a2e] text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-orange-400 bg-orange-400/10 border border-orange-400/20 px-3 py-1 rounded-full mb-6">
                🚀 Resume Builder
              </span>
              <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-5">
                Build Your{" "}
                <span className="bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
                  Perfect Resume
                </span>
              </h1>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Create a professional, eye-catching resume in minutes. Choose
                from beautiful templates, fill in your details, and download a
                polished PDF — no design skills needed.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={login}
                  disabled={isLoggingIn}
                  className="px-7 py-3.5 bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold rounded-full hover:opacity-90 transition-all shadow-lg shadow-purple-900/30 disabled:opacity-60"
                >
                  {isLoggingIn ? "Connecting..." : "Start Building Now"}
                </button>
                <Link
                  to="/pricing"
                  className="px-7 py-3.5 border border-white/20 text-gray-300 font-medium rounded-full hover:bg-white/5 transition-all"
                >
                  View Pricing
                </Link>
              </div>
              <p className="mt-5 text-sm text-gray-500">
                Free plan available. No credit card required.
              </p>
            </div>

            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-purple-600/20 rounded-2xl blur-xl" />
                <div className="relative bg-[#1a2235] rounded-2xl border border-white/10 p-4 shadow-2xl">
                  <div className="flex gap-1.5 mb-3">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    <div className="col-span-2 space-y-2">
                      {[
                        "Personal Info",
                        "Summary",
                        "Skills",
                        "Experience",
                        "Education",
                        "Projects",
                      ].map((step, i) => (
                        <div
                          key={step}
                          className={`px-2 py-1.5 rounded text-xs font-medium ${i === 0 ? "bg-gradient-to-r from-orange-500 to-purple-600 text-white" : "bg-white/5 text-gray-400"}`}
                        >
                          {step}
                        </div>
                      ))}
                    </div>
                    <div className="col-span-3 bg-white rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-sm">
                          L
                        </div>
                        <div>
                          <div className="text-gray-900 font-bold text-xs">
                            Liam Chen
                          </div>
                          <div className="text-purple-600 text-xs">
                            Software Engineer
                          </div>
                        </div>
                      </div>
                      {[70, 90, 55, 80].map((w) => (
                        <div
                          key={w}
                          className="h-1.5 bg-gray-100 rounded-full mb-1.5"
                        >
                          <div
                            className="h-full bg-gradient-to-r from-orange-400 to-purple-500 rounded-full"
                            style={{ width: `${w}%` }}
                          />
                        </div>
                      ))}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {["React", "TypeScript", "Node.js"].map((s) => (
                          <span
                            key={s}
                            className="text-xs bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
              Features
            </span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              Unlock Your Career Potential
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">
              Everything you need to craft a resume that gets noticed.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400/20 to-purple-500/20 flex items-center justify-center text-xl mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
            Pricing
          </span>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-md mx-auto">
            Start free, upgrade when you need more power.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                name: "Lite",
                price: "$20",
                desc: "Perfect for getting started",
                features: ["3 resumes", "2 templates", "PDF export"],
              },
              {
                name: "Pro",
                price: "$100",
                desc: "Most popular choice",
                features: [
                  "Unlimited resumes",
                  "All templates",
                  "Priority support",
                  "Custom branding",
                ],
                popular: true,
              },
              {
                name: "Plus",
                price: "$150",
                desc: "For power users",
                features: [
                  "Everything in Pro",
                  "Team sharing",
                  "Advanced analytics",
                  "API access",
                ],
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 border ${plan.popular ? "border-purple-500 shadow-lg shadow-purple-500/10" : "border-gray-200 dark:border-gray-700"} bg-white dark:bg-gray-800`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-orange-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Popular
                    </span>
                  </div>
                )}
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                  {plan.name}
                </h3>
                <div className="mt-2 mb-1">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-400 text-sm">/mo</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  {plan.desc}
                </p>
                <ul className="space-y-1.5 mb-5">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2"
                    >
                      <span className="text-green-500">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/pricing"
                  className={`block text-center py-2.5 rounded-xl text-sm font-semibold transition-all ${plan.popular ? "bg-gradient-to-r from-orange-500 to-purple-600 text-white hover:opacity-90" : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {t.name}
                    </p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#0B1220] to-[#1a0a2e] text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-4xl font-extrabold mb-4">
            Ready to forge your future?
          </h2>
          <p className="text-gray-300 mb-8">
            Join thousands of professionals who’ve landed their dream job with
            ResumeForge.
          </p>
          <button
            type="button"
            onClick={login}
            disabled={isLoggingIn}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-purple-600 text-white font-bold rounded-full text-lg hover:opacity-90 transition-all shadow-xl shadow-purple-900/40 disabled:opacity-60"
          >
            {isLoggingIn ? "Connecting..." : "Build Your Resume — Free"}
          </button>
        </div>
      </section>
    </div>
  );
}
