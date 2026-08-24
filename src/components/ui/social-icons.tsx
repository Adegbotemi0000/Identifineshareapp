import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function LinkedinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TwitterXIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.9 3H22l-7.4 8.46L23.3 21H16.9l-5-6.53L6.1 21H3l7.9-9.03L2.9 3h6.6l4.5 5.96L18.9 3zm-1.1 16.1h1.7L7.3 4.8H5.5l12.3 14.3z" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-7.2h2.4l.36-2.8h-2.76V9.2c0-.81.22-1.36 1.39-1.36h1.48V5.34C15.9 5.24 14.98 5.16 13.9 5.16c-2.24 0-3.77 1.37-3.77 3.88v2.16H7.7v2.8h2.43V21h3.37z" />
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.02 2.5c-5.24 0-9.5 4.26-9.5 9.5 0 1.68.44 3.25 1.2 4.62L2.5 21.5l5.02-1.18a9.46 9.46 0 0 0 4.5 1.15h.01c5.24 0 9.5-4.26 9.5-9.5s-4.26-9.47-9.51-9.47zm5.6 13.4c-.24.67-1.38 1.28-1.9 1.34-.5.06-1.02.1-3.26-.68-2.76-.97-4.53-3.77-4.67-3.95-.14-.18-1.12-1.5-1.12-2.86s.7-2.03.95-2.3c.24-.28.53-.35.7-.35.18 0 .35 0 .5.01.16.01.38-.06.6.46.24.56.8 1.95.87 2.09.07.14.12.31.02.5-.1.18-.14.29-.28.45-.14.16-.3.35-.42.47-.14.14-.29.29-.13.57.17.28.75 1.24 1.6 2 1.1.98 2.03 1.29 2.31 1.43.28.14.44.12.6-.07.17-.19.71-.83.9-1.11.19-.28.38-.23.63-.14.26.1 1.63.77 1.9.91.28.14.46.21.53.33.07.12.07.68-.17 1.35z" />
    </svg>
  );
}