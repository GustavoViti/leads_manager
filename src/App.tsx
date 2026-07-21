import { useState } from "react";
import { usePaths } from "@/context/PathsContext";
import { Sidebar, PageId } from "@/components/Sidebar";
import { SetupWizard } from "@/components/SetupWizard";
import { LeadsPage } from "@/pages/LeadsPage";
import { ComparativoPage } from "@/pages/ComparativoPage";
import { Loading } from "@/components/Loading";
import { LeadsDataProvider, useLeadsDataContext } from "@/context/LeadsDataContext";

function DashboardContent() {
  const [page, setPage] = useState<PageId>("leads");
  const { totalPendentes } = useLeadsDataContext();

  return (
    <div className="flex h-screen w-full bg-base-950">
      <Sidebar current={page} onChange={setPage} totalLeadsPendentes={totalPendentes} />
      {page === "leads" ? <LeadsPage /> : <ComparativoPage />}
    </div>
  );
}

function DashboardShell() {
  return (
    <LeadsDataProvider>
      <DashboardContent />
    </LeadsDataProvider>
  );
}

export default function App() {
  const { paths, loading } = usePaths();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-base-950">
        <Loading label="Carregando configuração..." />
      </div>
    );
  }

  if (!paths.leadsPath || !paths.membrosPath) {
    return <SetupWizard />;
  }

  return <DashboardShell />;
}
