import { AppSidebar } from "@/app/components/slidebar/app-sidebar";
import { DataTable } from "@/app/components/slidebar/data-table";
import { SiteHeader } from "@/app/components/slidebar/site-header";
import { getCurrentUser } from "@/lib/auth";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { getAllUsers } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/sign-in");

  const users = await getAllUsers();
  return (
    <>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar user={currentUser} variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-4 lg:px-6"></div>
                <DataTable data={users} />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
