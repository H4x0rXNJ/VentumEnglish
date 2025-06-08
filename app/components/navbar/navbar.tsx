"use client";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import Link from "next/link";
import { ModeToggle } from "@/app/components/mode-toggle";
import { useLogoutRequest } from "@/app/components/authentication/use-logout-request";
import { LogOut } from "lucide-react";

type User = {
  name?: string;
  email?: string;
  avatar?: string;
};

type NavbarProps = {
  user: User | null;
};
export default function Navbar({ user }: NavbarProps) {
  const { handleLogout } = useLogoutRequest();
  return (
    <nav className="h-16 bg-background border-b shadow-sm text-foreground">
      <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <Logo />
        <NavMenu className="hidden md:block" />
        <div className="flex items-center gap-3">
          <>
            {user?.email ? (
              <>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Welcome, {user.email}
                </span>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white px-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:underline"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:underline"
                >
                  Sign Up
                </Link>
              </>
            )}
          </>

          <ModeToggle />
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
}
