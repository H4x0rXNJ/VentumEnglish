import HomeFeatureList from "@/app/components/course/features/HomeFeatureList";
import Hero from "@/app/components/course/Hero";
import React from "react";
import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
  const user = await getCurrentUser();
  return (
    <div>
      <Hero user={user} />
      <HomeFeatureList />
    </div>
  );
}
