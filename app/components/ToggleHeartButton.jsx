"use client";
import React from "react";
import { VscHeart } from "react-icons/vsc";

const HeartButton = () => {
  return (
    <div className="relative group rounded-md hover:bg-accent hover:text-accent-foreground transition p-2.5 inline-flex items-center justify-center">
      <VscHeart
        style={{ width: 18, height: 18 }}
        className="text-blackda dark:text-white"
      />
    </div>
  );
};

export default HeartButton;
