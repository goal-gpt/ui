import type { ReactNode } from "react";

import { Sidebar } from "../Sidebar/Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex overflow-y-auto dark:bg-slate-900">
      <Sidebar />
      <div className="min-h-screen grow sm:ml-64">{children}</div>
    </div>
  );
}
