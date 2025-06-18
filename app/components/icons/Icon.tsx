import React, { useEffect, useState } from "react";

export function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path
        d="M24 12.5C24 5.87258 18.6274 0.5 12 0.5C5.37258 0.5 0 5.87258 0 12.5C0 18.4895 4.3882 23.454 10.125 24.3542V15.9688H7.07812V12.5H10.125V9.85625C10.125 6.84875 11.9166 5.1875 14.6576 5.1875C15.9701 5.1875 17.3438 5.42188 17.3438 5.42188V8.375H15.8306C14.34 8.375 13.875 9.30008 13.875 10.25V12.5H17.2031L16.6711 15.9688H13.875V24.3542C19.6118 23.454 24 18.4895 24 12.5Z"
        fill="#1877F2"
      />
    </svg>
  );
}

interface RepeatWithTextProps extends React.SVGProps<SVGSVGElement> {
  label?: string;
}

export function RepeatWithText({
  label = "1",
  onClick,
  ...props
}: RepeatWithTextProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5 text-black dark:text-white cursor-pointer hover:opacity-80 transition-opacity"
      onClick={onClick}
      {...props}
    >
      <polyline points="17 2 21 6 17 10" />
      <path d="M3 12V10a4 4 0 0 1 4-4h14" />
      <polyline points="7 22 3 18 7 14" />
      <path d="M21 14v2a4 4 0 0 1-4 4H3" />
      <text
        x="15"
        y="15"
        textAnchor="middle"
        fontSize="6"
        fill="currentColor"
        dominantBaseline="middle"
        fontFamily="Arial, sans-serif"
        style={{ userSelect: "none" }}
      >
        {label}
      </text>
    </svg>
  );
}

type RepeatIconProps = {
  count?: number;
  onClick?: () => void;
};

export function RepeatIcon({ count, onClick }: RepeatIconProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="relative cursor-pointer hover:scale-110 transition-transform duration-200"
      onClick={onClick}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="cursor-pointer"
      >
        <polyline points="17 2 21 6 17 10" />
        <path d="M3 12V10a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 2 20 6 14" />
        <path d="M21 14v2a4 4 0 0 1-4 4H3" />
      </svg>
      <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
        {mounted ? count : 0}
      </span>
    </div>
  );
}

export function AdjustIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={props.className}
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
      <path d="M12 3l0 18"></path>
      <path d="M12 9l4.65 -4.65"></path>
      <path d="M12 14.3l7.37 -7.37"></path>
      <path d="M12 19.6l8.85 -8.85"></path>
    </svg>
  );
}

export function GoogleIcon() {
  return (
    <svg viewBox="0 0 533.5 544.3">
      <path
        d="M533.5 278.4c0-18.9-1.5-37-4.3-54.7H272v103.7h147.4c-6.3 34-25.5 62.8-54.4 82v68h87.9c51.4-47.3 81.6-117.1 81.6-199z"
        fill="#4285F4"
      />
      <path
        d="M272 544.3c73.5 0 135.3-24.3 180.3-65.7l-87.9-68c-24.3 16.4-55.4 26-92.4 26-71 0-131-47.9-152.6-112.4h-89.5v70.9c44.5 88.1 135.6 149.2 242.1 149.2z"
        fill="#34A853"
      />
      <path
        d="M119.4 324.5c-10.4-30.9-10.4-64.4 0-95.3v-70.9h-89.5c-37.3 73.7-37.3 161.9 0 235.6l89.5-69.4z"
        fill="#FBBC05"
      />
      <path
        d="M272 107.7c39.9 0 75.6 13.7 103.8 40.3l77.8-77.8C402 24.9 344.1 0 272 0 165.4 0 74.3 61.1 29.8 149.2l89.5 69.4c21.6-64.5 81.6-112.4 152.7-112.4z"
        fill="#EA4335"
      />
    </svg>
  );
}
