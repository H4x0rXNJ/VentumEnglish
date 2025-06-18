"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogOut, Menu } from "lucide-react";
import { Logo } from "./Logo";
import Link from "next/link";
import { User } from "@/app/types/authTypes";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { getAvatarUrl, getFirstLetter } from "./NavMenu";
import { CgProfile } from "react-icons/cg";
import { SlSettings } from "react-icons/sl";
import React, { useMemo } from "react";

const NavigationSheet = ({ user }: { user: User | null }) => {
  console.count("NavigationSheet Rendered");
  console.log("NavigationSheetComponent rendered");

  const userInfo = useMemo(() => {
    if (!user) return null;

    return {
      avatar: getAvatarUrl(user.avatar),
      firstLetter: getFirstLetter(user.name),
      email: user.email,
      name: user.name,
    };
  }, [user?.avatar, user?.name, user?.email]);

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
        <SheetTitle className="sr-only">Sidebar</SheetTitle>
        <SheetDescription className="sr-only">
          Contains user info and navigation links
        </SheetDescription>

        <div className="mb-4">
          <Logo />
        </div>

        {user && (
          <div className="flex items-center gap-3 mb-6">
            <Avatar className="w-10 h-10 rounded-full overflow-hidden shadow-md">
              <Image
                src={getAvatarUrl(userInfo?.avatar)}
                alt="Avatar"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
              <AvatarFallback>{getFirstLetter(userInfo?.name)}</AvatarFallback>
            </Avatar>
            <span className="font-semibold">{userInfo?.email}</span>
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
              {/*<button*/}
              {/*  onClick={handleLogout}*/}
              {/*  className="flex items-center gap-3 text-red-500 hover:text-red-700 transition-colors"*/}
              {/*>*/}
              {/*  <LogOut size={20} />*/}
              {/*  Logout*/}
              {/*</button>*/}
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
export default React.memo(NavigationSheet);
