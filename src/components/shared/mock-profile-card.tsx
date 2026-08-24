import { Mail, Phone, Globe, MapPin } from "lucide-react";

export function MockProfileCard() {
  return (
    <div className="w-full max-w-[280px] rounded-[1.75rem] border border-black/5 bg-paper shadow-[0_30px_60px_-15px_rgba(27,26,23,0.25)] overflow-hidden">
      <div className="h-20 bg-gradient-to-br from-ivory to-gold-soft/40 relative">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent" />
      </div>

      <div className="px-6 pb-6 -mt-8">
        <div className="w-16 h-16 rounded-full bg-ink text-paper flex items-center justify-center font-[family-name:var(--font-display)] text-xl border-4 border-paper">
          AK
        </div>

        <h3 className="mt-3 font-[family-name:var(--font-display)] text-lg text-ink">
          Amara Kofi
        </h3>
        <p className="text-xs text-ink-soft">Creative Director</p>
        <p className="text-xs font-mono text-gold mt-0.5">
          identishare.com/amara
        </p>

        <div className="mt-4 flex gap-2">
          <div className="w-8 h-8 rounded-full bg-ivory flex items-center justify-center">
            <Phone className="w-3.5 h-3.5 text-ink-soft" />
          </div>
          <div className="w-8 h-8 rounded-full bg-ivory flex items-center justify-center">
            <Mail className="w-3.5 h-3.5 text-ink-soft" />
          </div>
          <div className="w-8 h-8 rounded-full bg-ivory flex items-center justify-center">
            <Globe className="w-3.5 h-3.5 text-ink-soft" />
          </div>
          <div className="w-8 h-8 rounded-full bg-ivory flex items-center justify-center">
            <MapPin className="w-3.5 h-3.5 text-ink-soft" />
          </div>
        </div>
      </div>
    </div>
  );
}