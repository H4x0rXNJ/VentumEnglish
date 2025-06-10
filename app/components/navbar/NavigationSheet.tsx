"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogOut, Menu } from "lucide-react";
import { Logo } from "./Logo";
import Link from "next/link";
import { User } from "@/app/types/authTypes";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { getAvatarUrl, getFirstLetter } from "./NavMenu";
import { useLogoutRequest } from "@/app/components/authentication/useLogoutRequest";
import { CgProfile } from "react-icons/cg";
import { SlSettings } from "react-icons/sl";

export const NavigationSheet = ({ user }: { user: User | null }) => {
  const { handleLogout } = useLogoutRequest({ authType: user?.authType });

  console.log();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex flex-col p-4 w-full sm:max-w-xs"
      >
        <div className="mb-4">
          <Logo />
        </div>

        {user && (
          <div className="flex items-center gap-3 mb-6">
            <Avatar className="w-10 h-10 rounded-full overflow-hidden shadow-md">
              <Image
                src={getAvatarUrl(user?.avatar)}
                alt="Avatar"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
              <AvatarFallback>{getFirstLetter(user?.name)}</AvatarFallback>
            </Avatar>
            <span className="font-semibold">{user?.email}</span>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex flex-col gap-6 text-lg font-medium flex-grow">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <Link href="/components" className="hover:text-primary">
            Components
          </Link>
          <Link href="/docs" className="hover:text-primary">
            Docs
          </Link>
        </nav>

        {/* User Options / Auth Actions */}
        <div className="mt-auto border-t pt-6 flex flex-col gap-4 text-sm">
          {user ? (
            <>
              <Link
                href="#"
                className="flex items-center gap-3 hover:text-primary"
              >
                <CgProfile size={20} />
                My Profile
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 hover:text-primary"
              >
                <SlSettings size={20} />
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 text-red-500 hover:text-red-700 transition-colors"
              >
                <LogOut size={20} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="hover:underline font-medium">
                Sign In
              </Link>
              <Link href="/sign-up" className="hover:underline font-medium">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
