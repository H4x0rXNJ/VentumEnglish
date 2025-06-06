import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import Head from "next/head";
import {Toaster} from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Ventum Mastery',
  description: 'English Fast as Ventum Mastery!',
  icons:{
    icon:'/public/icon.ico'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="top-center"/>
    </body>
    </html>
  );
}
