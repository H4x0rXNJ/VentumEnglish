export const dynamic = "force-dynamic";
import "../globals.css";
import React from "react";
import Navbar from "@/app/components/navbar/Navbar";
import Footer from "@/app/components/Footer";
import { getCurrentUser } from "@/lib/auth";
import Hero from "@/app/components/course/Hero";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Navbar user={user} />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </>
  );
}
