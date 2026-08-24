"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BarChart3, Crown, Eye, MousePointer2, QrCode, Share2, Smartphone, UserPlus } from "lucide-react";

type Period = "7D" | "30D" | "90D" | "ALL";

type AnalyticsData = {
  profileViews: number;
  qrScans: number;
  contactSaves: number;
  shares: number;
  linkVisits: number;
  events: AnalyticsEvent[];
};

type AnalyticsEvent = {
  id: string;
  type: "view" | "scan" | "contact" | "share" | "link";
  date: string;
  time: string;
  source?: string;
  device?: string;
};

const defaultAnalytics: AnalyticsData = {
  profileViews: 1248,
  qrScans: 386,
  contactSaves: 94,
  shares: 72,
  linkVisits: 214,
  events: [
    {
      id: "1",
      type: "view",
      date: "Today",
      time: "09:42 AM",
      source: "Direct Link",
      device: "Mobile",
    },
    {
      id: "2",
      type: "scan",
      date: "Today",
      time: "09:18 AM",
      source: "QR Code",
      device: "Mobile",
    },
    {
      id: "3",
      type: "contact",
      date: "Today",
      time: "08:51 AM",
      source: "Profile",
      device: "Mobile",
    },
    {
      id: "4",
      type: "share",
      date: "Yesterday",
      time: "06:32 PM",
      source: "Profile",
      device: "Mobile",
    },
    {
      id: "5",
      type: "view",
      date: "Yesterday",
      time: "04:16 PM",
      source: "NFC",
      device: "Mobile",
    },
    {
      id: "6",
      type: "view",
      date: "Yesterday",
      time: "11:08 AM",
      source: "Direct Link",
      device: "Desktop",
    },
  ],
};

const chartData: Record<Exclude<Period, "ALL">, number[]> = {
  "7D": [42, 68, 54, 91, 73, 108, 126],
  "30D": [32, 45, 39, 58, 64, 51, 73, 82, 76, 94, 88, 103],
  "90D": [28, 42, 37, 55, 61, 48, 69, 75, 71, 88, 96, 104],
};

export default function AnalyticsPage() {
  const router = useRouter();

  const [darkMode, setDarkMode] = useState(true);
  const [period, setPeriod] = useState<Period>("7D");
  const [analytics, setAnalytics] =
    useState<AnalyticsData>(defaultAnalytics);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    try {
      const savedAnalytics =
        localStorage.getItem("identishare_analytics");

      if (savedAnalytics) {
        setAnalytics(JSON.parse(savedAnalytics));
      }

      const savedSubscription =
        localStorage.getItem("identishare_subscription");

      if (savedSubscription === "pro") {
        setIsPro(true);
      }

      const savedTheme =
        localStorage.getItem("identishare_theme");

      if (savedTheme === "light") {
        setDarkMode(false);
      }
    } catch (error) {
      console.error("Unable to load analytics:", error);
    }
  }, []);

  const chartValues = useMemo(() => {
    if (period === "ALL") {
      return [
        35, 48, 43, 62, 58, 74, 69, 82, 77, 91, 86, 104,
      ];
    }

    return chartData[period];
  }, [period]);

  const maxChartValue = Math.max(...chartValues);

  function goBack() {
    router.push("/dashboard");
  }

  function openPricing() {
    router.push("/pricing");
  }

  function toggleTheme() {
    const next = !darkMode;

    setDarkMode(next);

    localStorage.setItem(
      "identishare_theme",
      next ? "dark" : "light"
    );
  }

  function getEventIcon(type: AnalyticsEvent["type"]) {
    switch (type) {
      case "scan":
        return <QrCode size={16} />;
      case "contact":
        return <UserPlus size={16} />;
      case "share":
        return <Share2 size={16} />;
      case "link":
        return <MousePointer2 size={16} />;
      default:
        return <Eye size={16} />;
    }
  }

  function getEventLabel(type: AnalyticsEvent["type"]) {
    switch (type) {
      case "scan":
        return "QR code scanned";
      case "contact":
        return "Contact saved";
      case "share":
        return "Profile shared";
      case "link":
        return "Link visited";
      default:
        return "Profile viewed";
    }
  }

  const dark = darkMode;

  const statCards = [
    {
      label: "Profile Views",
      value: analytics.profileViews.toLocaleString(),
      change: "+18.4%",
      icon: <Eye size={18} />,
    },
    {
      label: "QR Scans",
      value: analytics.qrScans.toLocaleString(),
      change: "+12.7%",
      icon: <QrCode size={18} />,
    },
    {
      label: "Contact Saves",
      value: analytics.contactSaves.toLocaleString(),
      change: "+8.2%",
      icon: <UserPlus size={18} />,
    },
    {
      label: "Shares",
      value: analytics.shares.toLocaleString(),
      change: "+15.1%",
      icon: <Share2 size={18} />,
    },
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
              onClick={goBack}
              className={`w-10 h-10 rounded-full border flex items-center justify-center ${
                dark
                  ? "bg-[#111] border-[#292929]"
                  : "bg-white border-gray-200"
              }`}
            >
              <ArrowLeft size={18} />
            </button>

            <div className="text-center">
              <h1 className="font-semibold">
                Analytics
              </h1>

              <p className="text-[10px] uppercase tracking-[0.18em] text-[#C09018] mt-1">
                Profile Performance
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
            >
              ☼
            </button>
          </div>
        </header>

        <section className="px-5 py-6 space-y-5 pb-28">
          {!isPro && (
            <div
              className={`rounded-3xl p-5 border ${
                dark
                  ? "bg-[#15120a] border-[#4b3b13]"
                  : "bg-[#fffaf0] border-[#ead9a7]"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C09018] text-black flex items-center justify-center shrink-0">
                  <Crown size={18} />
                </div>

                <div className="min-w-0">
                  <h2 className="font-semibold">
                    Analytics is a Pro feature
                  </h2>

                  <p className="text-xs text-gray-500 mt-1 leading-5">
                    Upgrade to Personal Pro to unlock
                    detailed profile performance insights.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={openPricing}
                className="w-full mt-4 py-3 rounded-xl bg-[#C09018] text-black text-sm font-semibold"
              >
                Upgrade to Pro
              </button>
            </div>
          )}

          <div
            className={`rounded-3xl p-5 border ${
              dark
                ? "bg-[#111] border-[#1f1f1f]"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">
                  Profile performance
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  How people interact with your profile.
                </p>
              </div>

              <BarChart3
                size={20}
                className="text-[#C09018]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              {statCards.map((stat) => (
                <div
                  key={stat.label}
                  className={`rounded-2xl p-4 ${
                    dark ? "bg-[#181818]" : "bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[#C09018]">
                      {stat.icon}
                    </span>

                    <span className="text-[10px] text-green-500">
                      {stat.change}
                    </span>
                  </div>

                  <p className="text-xl font-semibold mt-3">
                    {stat.value}
                  </p>

                  <p className="text-[11px] text-gray-500 mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`rounded-3xl p-5 border ${
              dark
                ? "bg-[#111] border-[#1f1f1f]"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold">
                  Profile views
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Views over time
                </p>
              </div>

              <select
                value={period}
                onChange={(event) =>
                  setPeriod(event.target.value as Period)
                }
                className={`text-xs rounded-lg px-2.5 py-2 outline-none ${
                  dark
                    ? "bg-[#181818] border border-[#292929]"
                    : "bg-gray-100 border border-gray-200"
                }`}
              >
                <option value="7D">7 Days</option>
                <option value="30D">30 Days</option>
                <option value="90D">90 Days</option>
                <option value="ALL">All Time</option>
              </select>
            </div>

            <div className="h-48 mt-6 flex items-end gap-2">
              {chartValues.map((value, index) => {
                const height =
                  (value / maxChartValue) * 100;

                return (
                  <div
                    key={`${value}-${index}`}
                    className="flex-1 h-full flex items-end"
                  >
                    <div
                      className="w-full rounded-t-lg bg-[#C09018]/80 transition-all"
                      style={{
                        height: `${height}%`,
                      }}
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between mt-3 text-[9px] text-gray-500">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>

          <div
            className={`rounded-3xl p-5 border ${
              dark
                ? "bg-[#111] border-[#1f1f1f]"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold">
                  Traffic sources
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  How people find you
                </p>
              </div>
            </div>

            <div className="space-y-4 mt-5">
              {[
                ["QR Code", 42],
                ["Direct Link", 31],
                ["NFC", 18],
                ["Social", 9],
              ].map(([label, percentage]) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-2">
                    <span>{label}</span>
                    <span className="text-gray-500">
                      {percentage}%
                    </span>
                  </div>

                  <div
                    className={`h-2 rounded-full overflow-hidden ${
                      dark ? "bg-[#252525]" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className="h-full bg-[#C09018]"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`rounded-3xl p-5 border ${
              dark
                ? "bg-[#111] border-[#1f1f1f]"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold">
                  Devices
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Devices used to view your profile
                </p>
              </div>

              <Smartphone
                size={20}
                className="text-[#C09018]"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5">
              {[
                ["Mobile", "78%"],
                ["Desktop", "17%"],
                ["Tablet", "5%"],
              ].map(([device, value]) => (
                <div
                  key={device}
                  className={`rounded-2xl p-3 text-center ${
                    dark ? "bg-[#181818]" : "bg-gray-50"
                  }`}
                >
                  <p className="font-semibold">
                    {value}
                  </p>

                  <p className="text-[10px] text-gray-500 mt-1">
                    {device}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`rounded-3xl p-5 border ${
              dark
                ? "bg-[#111] border-[#1f1f1f]"
                : "bg-white border-gray-200"
            }`}
          >
            <div>
              <h2 className="font-semibold">
                Recent activity
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Latest interactions with your profile.
              </p>
            </div>

            <div className="mt-5 space-y-1">
              {analytics.events.map((event) => (
                <div
                  key={event.id}
                  className={`flex items-center gap-3 py-3 border-b last:border-0 ${
                    dark
                      ? "border-white/[0.06]"
                      : "border-black/[0.06]"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      dark ? "bg-[#181818]" : "bg-gray-100"
                    } text-[#C09018]`}
                  >
                    {getEventIcon(event.type)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium">
                      {getEventLabel(event.type)}
                    </p>

                    <p className="text-[10px] text-gray-500 mt-1 truncate">
                      {event.source || "Profile"} ·{" "}
                      {event.device || "Unknown device"}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-gray-400">
                      {event.date}
                    </p>

                    <p className="text-[10px] text-gray-500 mt-1">
                      {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={goBack}
            className="w-full py-3 rounded-xl border border-[#C09018] text-[#C09018] text-sm font-medium"
          >
            Back to Dashboard
          </button>
        </section>
      </div>
    </main>
  );
}