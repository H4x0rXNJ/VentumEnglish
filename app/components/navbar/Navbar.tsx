"use client";
import { Logo } from "./Logo";
import { NavMenu } from "./NavMenu";
import { NavigationSheet } from "./NavigationSheet";
import React from "react";
import { User } from "@/app/types/authTypes";

export default function Navbar({ user }: { user: User | null }) {
  return (
    <nav className="h-16 bg-background border-b shadow-sm text-foreground">
      <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Logo />
        </div>
        <div className="flex items-center gap-x-2">
          <div className="hidden md:flex items-center gap-x-2">
            <NavMenu user={user} />
          </div>
        </div>
        <div className="flex items-center gap-x-2">
          <div className="md:hidden">
            <NavigationSheet user={user} />
          </div>
        </div>
      </div>
    </nav>
  );
}
