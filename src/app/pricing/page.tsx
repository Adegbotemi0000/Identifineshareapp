"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Crown,
  Lock,
  Sparkles,
} from "lucide-react";

type BillingCycle = "monthly" | "yearly";

export default function PricingPage() {
  const router = useRouter();

  const [darkMode, setDarkMode] = useState(true);
  const [billingCycle, setBillingCycle] =
    useState<BillingCycle>("yearly");
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    try {
      const savedTheme =
        localStorage.getItem("identishare_theme");

      if (savedTheme === "light") {
        setDarkMode(false);
      }

      const savedSubscription =
        localStorage.getItem("identishare_subscription");

      if (savedSubscription === "pro") {
        setIsPro(true);
      }
    } catch (error) {
      console.error("Unable to load pricing state:", error);
    }
  }, []);

  function toggleTheme() {
    const next = !darkMode;

    setDarkMode(next);

    localStorage.setItem(
      "identishare_theme",
      next ? "dark" : "light"
    );
  }

  function handleUpgrade() {
    /*
      Payment integration will be connected later.

      When Paystack is ready, this button will:
      1. Create the payment request
      2. Open Paystack checkout
      3. Verify the payment
      4. Activate Personal Pro
    */

    alert(
      "Payments are coming soon. Paystack will be connected before launch."
    );
  }

  function handleManagePlan() {
    alert(
      "Subscription management will be available when payments are connected."
    );
  }

  const dark = darkMode;

  const freeFeatures = [
    "Personal profile",
    "Custom username",
    "QR code",
    "Shareable profile link",
    "Save Contact",
    "Basic contact information",
    "Social media links",
    "Basic profile customization",
    "Limited work gallery",
  ];

  const proFeatures = [
    "Everything in Free",
    "Advanced profile customization",
    "Unlimited work gallery",
    "Portfolio / CV",
    "Portfolio video",
    "Profile analytics",
    "QR scan insights",
    "Profile view statistics",
    "Advanced sharing tools",
    "More custom links",
    "Priority access to new features",
  ];

  return (
    <main
      className={`min-h-screen transition-colors ${
        dark
          ? "bg-[#070707] text-white"
          : "bg-[#f6f6f4] text-[#111]"
      }`}
    >
      <div className="mx-auto w-full max-w-[430px] min-h-screen">
        <header
          className={`sticky top-0 z-40 border-b backdrop-blur-xl ${
            dark
              ? "bg-[#070707]/90 border-white/[0.07]"
              : "bg-white/90 border-black/[0.07]"
          }`}
        >
          <div className="px-5 py-5 flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className={`w-10 h-10 rounded-full border flex items-center justify-center ${
                dark
                  ? "bg-[#111] border-[#292929]"
                  : "bg-white border-gray-200"
              }`}
              aria-label="Back to dashboard"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="text-center">
              <h1 className="font-semibold">
                Pricing
              </h1>

              <p className="text-[10px] uppercase tracking-[0.18em] text-[#C09018] mt-1">
                Choose Your Plan
              </p>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className={`w-10 h-10 rounded-full border flex items-center justify-center ${
                dark
                  ? "bg-[#111] border-[#292929]"
                  : "bg-white border-gray-200"
              }`}
              aria-label="Toggle theme"
            >
              ☼
            </button>
          </div>
        </header>

        <section className="px-5 pt-7 pb-28">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-[#C09018] text-black flex items-center justify-center">
              <Sparkles size={22} />
            </div>

            <h2 className="text-2xl font-semibold mt-5">
              Simple, transparent pricing
            </h2>

            <p className="text-sm text-gray-500 mt-2 leading-6">
              Start free. Upgrade when you need more
              from your professional profile.
            </p>
          </div>

          <div
            className={`mt-7 p-1 rounded-2xl flex ${
              dark
                ? "bg-[#151515]"
                : "bg-gray-200"
            }`}
          >
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`flex-1 py-3 rounded-xl text-xs font-medium transition ${
                billingCycle === "monthly"
                  ? "bg-[#C09018] text-black"
                  : "text-gray-500"
              }`}
            >
              Monthly
            </button>

            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`flex-1 py-3 rounded-xl text-xs font-medium transition relative ${
                billingCycle === "yearly"
                  ? "bg-[#C09018] text-black"
                  : "text-gray-500"
              }`}
            >
              Yearly

              <span
                className={`absolute -top-2 right-2 text-[8px] px-2 py-0.5 rounded-full ${
                  billingCycle === "yearly"
                    ? "bg-black text-[#C09018]"
                    : "bg-[#C09018] text-black"
                }`}
              >
                SAVE ₦2K
              </span>
            </button>
          </div>

          <div
            className={`mt-5 rounded-3xl border p-6 ${
              dark
                ? "bg-[#111] border-[#242424]"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                  Free
                </p>

                <h3 className="text-xl font-semibold mt-1">
                  Personal
                </h3>
              </div>

              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  dark
                    ? "bg-[#1b1b1b]"
                    : "bg-gray-100"
                }`}
              >
                <Check
                  size={19}
                  className="text-[#C09018]"
                />
              </div>
            </div>

            <div className="mt-6">
              <span className="text-3xl font-semibold">
                ₦0
              </span>

              <span className="text-xs text-gray-500 ml-2">
                forever
              </span>
            </div>

            <p className="text-xs text-gray-500 mt-2 leading-5">
              Everything you need to create and share
              a professional digital profile.
            </p>

            <div className="mt-6 space-y-3">
              {freeFeatures.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-3"
                >
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-[#C09018]/15 flex items-center justify-center shrink-0">
                    <Check
                      size={12}
                      className="text-[#C09018]"
                    />
                  </div>

                  <span className="text-xs text-gray-500 leading-5">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              disabled
              className={`w-full mt-7 py-3.5 rounded-xl text-sm font-medium ${
                dark
                  ? "bg-[#202020] text-gray-400"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              Current Plan
            </button>
          </div>

          <div
            className={`mt-5 rounded-3xl border p-6 relative overflow-hidden ${
              dark
                ? "bg-[#12100b] border-[#C09018]/50"
                : "bg-[#fffaf0] border-[#d9bd6a]"
            }`}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#C09018]" />

            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs uppercase tracking-[0.15em] text-[#C09018]">
                    Personal Pro
                  </p>

                  <span className="text-[8px] px-2 py-1 rounded-full bg-[#C09018] text-black font-semibold">
                    RECOMMENDED
                  </span>
                </div>

                <h3 className="text-xl font-semibold mt-2">
                  Pro
                </h3>
              </div>

              <div className="w-10 h-10 rounded-xl bg-[#C09018] text-black flex items-center justify-center">
                <Crown size={19} />
              </div>
            </div>

            <div className="mt-6">
              {billingCycle === "yearly" ? (
                <>
                  <span className="text-3xl font-semibold">
                    ₦10,000
                  </span>

                  <span className="text-xs text-gray-500 ml-2">
                    / year
                  </span>

                  <p className="text-[11px] text-green-500 mt-2">
                    Save ₦2,000 compared with monthly
                    billing
                  </p>
                </>
              ) : (
                <>
                  <span className="text-3xl font-semibold">
                    ₦1,000
                  </span>

                  <span className="text-xs text-gray-500 ml-2">
                    / month
                  </span>

                  <p className="text-[11px] text-gray-500 mt-2">
                    Cancel whenever you choose
                  </p>
                </>
              )}
            </div>

            <p className="text-xs text-gray-500 mt-4 leading-5">
              Unlock the complete professional
              IdentiShare experience and get deeper
              insights into your profile.
            </p>

            <div className="mt-6 space-y-3">
              {proFeatures.map((feature, index) => (
                <div
                  key={feature}
                  className="flex items-start gap-3"
                >
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-[#C09018]/15 flex items-center justify-center shrink-0">
                    {index === 0 ? (
                      <Sparkles
                        size={11}
                        className="text-[#C09018]"
                      />
                    ) : (
                      <Check
                        size={12}
                        className="text-[#C09018]"
                      />
                    )}
                  </div>

                  <span className="text-xs text-gray-500 leading-5">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {isPro ? (
              <button
                type="button"
                onClick={handleManagePlan}
                className="w-full mt-7 py-3.5 rounded-xl bg-[#C09018] text-black text-sm font-semibold"
              >
                Manage Pro
              </button>
            ) : (
              <button
                type="button"
                onClick={handleUpgrade}
                className="w-full mt-7 py-3.5 rounded-xl bg-[#C09018] text-black text-sm font-semibold"
              >
                Upgrade to Pro
              </button>
            )}

            <p className="text-center text-[10px] text-gray-500 mt-3">
              Secure payment via Paystack coming soon
            </p>
          </div>

          <div
            className={`mt-5 rounded-2xl border p-4 ${
              dark
                ? "bg-[#111] border-[#202020]"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#C09018]/10 flex items-center justify-center shrink-0">
                <Lock
                  size={16}
                  className="text-[#C09018]"
                />
              </div>

              <div>
                <h4 className="text-xs font-semibold">
                  Payments are coming soon
                </h4>

                <p className="text-[10px] text-gray-500 mt-1 leading-5">
                  You can explore all Pro features now.
                  Payment processing and subscription
                  activation will be connected through
                  Paystack before launch.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="w-full mt-5 py-3 rounded-xl border border-[#C09018] text-[#C09018] text-sm font-medium"
          >
            Back to Dashboard
          </button>
        </section>
      </div>
    </main>
  );
}