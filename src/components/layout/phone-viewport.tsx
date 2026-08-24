import { cn } from "@/lib/utils";

export function PhoneViewport({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="min-h-screen w-full bg-ivory flex items-center justify-center md:py-10">
      <div
        className={cn(
          "relative w-full h-screen md:h-[844px] md:w-[390px]",
          "md:rounded-[2.75rem] md:border md:border-black/5 md:shadow-[0_30px_60px_-15px_rgba(27,26,23,0.25)]",
          "bg-paper overflow-hidden flex flex-col",
          className
        )}
      >
        <div className="hidden md:block absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent" />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}