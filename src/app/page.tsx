import Link from "next/link";
import { ArrowRight, QrCode, Share2, UserCircle2 } from "lucide-react";
import { MockProfileCard } from "@/components/shared/mock-profile-card";

const steps = [
  {
    number: "01",
    icon: UserCircle2,
    title: "Create your profile",
    description:
      "Add your details, contact info, links and portfolio once — as an individual or a business.",
  },
  {
    number: "02",
    icon: QrCode,
    title: "Get your QR and link",
    description:
      "Every profile comes with a public URL and a QR code, ready to share instantly.",
  },
  {
    number: "03",
    icon: Share2,
    title: "Share everywhere",
    description:
      "Scan, tap NFC, or send your link. People land on one polished identity page.",
  },
];

export default function Home() {
  return (
    <main className="bg-paper">
      {/* Hero */}
      <section className="px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <span className="font-mono text-base md:text-lg font-bold tracking-[0.2em] uppercase text-gold">
              IdentiShare
            </span>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl md:text-6xl leading-[1.05] text-ink">
              Your identity,
              <br />
              shared instantly.
            </h1>
            <p className="mt-5 text-ink-soft text-base max-w-md">
              One profile for your contact details, work and social presence
              — shared through a link, a QR code, or a tap. Create once,
              share everywhere.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-ink text-paper px-6 py-3 text-sm font-medium hover:bg-ink/90 transition-colors"
              >
                Create Your Profile
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/signin"
                className="text-sm text-ink-soft hover:text-ink transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>

          <div className="flex justify-center">
            <MockProfileCard />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 md:py-24 bg-ivory">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-ink text-center">
            How it works
          </h2>
          <div className="mt-12 grid md:grid-cols-3 gap-10">
            {steps.map((step) => (
              <div key={step.number} className="text-center md:text-left">
                <div className="inline-flex items-center gap-2">
                  <span className="font-mono text-xs text-gold">
                    {step.number}
                  </span>
                  <step.icon className="w-4 h-4 text-gold" />
                </div>
                <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-ink-soft">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-6 py-20 text-center">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-ink">
          Ready to create yours?
        </h2>
        <Link
          href="/signup"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink text-paper px-6 py-3 text-sm font-medium hover:bg-ink/90 transition-colors"
        >
          Create Your Profile
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </main>
  );
}