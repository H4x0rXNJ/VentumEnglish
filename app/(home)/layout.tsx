import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/navbar/Navbar";
import { getCurrentUser } from "@/lib/auth";
import React from "react";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar user={user} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
