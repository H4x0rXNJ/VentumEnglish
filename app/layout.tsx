import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import React from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ventum Mastery",
  description: "English Fast as Ventum Mastery!",
  icons: {
    icon: "/icon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-col min-h-screen bg-background text-foreground">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={true}
          >
            {children}
          </ThemeProvider>
        </div>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
