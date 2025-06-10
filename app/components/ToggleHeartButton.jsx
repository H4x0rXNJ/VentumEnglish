"use client";
import React from "react";
import { VscHeart } from "react-icons/vsc";

const HeartButton = () => {
  return (
    <div className="p-2 rounded-md hover:bg-purple-100 transition inline-flex items-center justify-center">
      <VscHeart
        style={{ width: 18, height: 18 }}
        className="text-blackda dark:text-white"
      />
    </div>
  );
};

export default HeartButton;
