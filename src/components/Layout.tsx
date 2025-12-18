import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useSession } from "@/contexts/SessionProvider";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import DataExporterDialog from "./DataExporterDialog";
import OrganizationGuard from "./OrganizationGuard";

const Layout = () => {
  const { profile } = useSession();
  const isAdmin = profile?.role === 'admin';
  const [isExporterOpen, setIsExporterOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleCollapse = () => setSidebarCollapsed((s) => !s);

  return (
    <OrganizationGuard>
      <div className={cn("min-h-screen relative")}>
        <Sidebar 
          onOpenExporter={() => setIsExporterOpen(true)} 
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleCollapse}
        />
        <main 
          className={cn(
            "flex-1 p-8 bg-background",
            sidebarCollapsed ? "ml-16" : "ml-64"
          )}
          style={{ transition: "margin-left 0.2s" }}
        >
          <Outlet />
        </main>
        
        {/* Diálogo de Exportação */}
        <DataExporterDialog 
          isOpen={isExporterOpen} 
          onOpenChange={setIsExporterOpen} 
        />
      </div>
    </OrganizationGuard>
  );
};

export default Layout;