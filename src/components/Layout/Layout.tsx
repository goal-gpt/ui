import type { ReactNode } from "react";

import { Sidebar } from "../Sidebar/Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="dark:bg-slate-900">
      <div className="fixed left-0 top-0 z-40">
        <Sidebar />
      </div>
      <div className="fixed left-0 top-12 h-[calc(100vh-3rem)] max-h-screen w-full sm:top-0 sm:h-screen sm:pl-64">
        {children}
      </div>
    </div>
  );
}
