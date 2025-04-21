"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  // Rutas donde no se debe mostrar el Sidebar
  const hiddenSidebarRoutes = ["/login", "/register"];
  const hideSidebar = hiddenSidebarRoutes.includes(pathname);

  return (
    <div className="flex min-h-screen">
      {!hideSidebar && <Sidebar />}
      <main className={`flex-1 ${!hideSidebar ? "ml-64" : ""} p-8`}>
        {children}
      </main>
    </div>
  );
}
