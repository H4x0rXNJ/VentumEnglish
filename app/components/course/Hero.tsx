import { Button } from "@/components/ui/button";
import { ArrowUpRight, CirclePlay } from "lucide-react";
import React from "react";
import { User } from "@/app/types/authTypes";

export default function Hero({ user }: { user: User | null }) {
  console.log(user);
  return (
    <div className="flex items-center justify-center">
      <div className="max-w-screen-xl w-full mx-auto grid lg:grid-cols-2 gap-12 px-6 py-12">
        <div>
          {user?.email && (
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-black dark:text-neutral-300 tracking-tight">
              Welcome back,&nbsp;
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#e0c3fc] via-[#8ec5fc] via-[#9fd3c7] via-[#a1c4fd] to-[#d9afd9]nimate-gradient-vertical">
                {user?.name || "GUEST"}
              </span>
            </h1>
          )}
          <h1 className="mt-6 max-w-[25ch] text-4xl md:text-5xl lg:text-[2.75rem] xl:text-5xl font-bold !leading-[1.2]">
            Carried by Wind. Guided by Intention.
          </h1>
          <p className="mt-6 max-w-[60ch] text-lg">
            Like the breeze that sweeps across an open sky, every word you learn
            carries purpose. Let English be your wind—quiet, persistent, and
            always moving you forward.
          </p>
          <div className="mt-12 flex items-center gap-4">
            <Button size="lg" className="rounded-full text-base">
              Get Started <ArrowUpRight className="!h-5 !w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full text-base shadow-none"
            >
              <CirclePlay className="!h-5 !w-5" /> Watch Demo
            </Button>
          </div>
        </div>
        <div className="w-full aspect-video rounded-xl overflow-hidden">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/IzOgf2Ww0OQ"
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
