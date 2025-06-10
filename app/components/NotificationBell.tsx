import React from "react";
import { IoNotificationsOutline } from "react-icons/io5";

export default function NotificationBell() {
  return (
    <div className="relative group rounded-md hover:bg-purple-100 transition p-2 inline-flex items-center justify-center">
      <IoNotificationsOutline
        size={18}
        className="stroke-black dark:stroke-white"
      />
      <span className="absolute top-[5px] right-[8px] w-[10px] h-[10px] rounded-full bg-purple-400" />
    </div>
  );
}
