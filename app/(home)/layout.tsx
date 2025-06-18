import "../globals.css";
import React, { cache } from "react";
import Navbar from "@/app/components/navbar/Navbar";
import Footer from "@/app/components/Footer";
import { getCurrentUser } from "@/lib/auth";

const getCachedCurrentUser = cache(getCurrentUser);

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCachedCurrentUser();

  console.count("RootLayout Rendered");

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
