import { usePaths } from "@/context/PathsContext";
import { pickLeadsFile, pickMembrosFile } from "@/services/dataService";

export type PageId = "leads" | "comparativo";

interface SidebarProps {
  current: PageId;
  onChange: (page: PageId) => void;
  totalLeadsPendentes: number;
}

const items: { id: PageId; label: string; icon: JSX.Element }[] = [
  {
    id: "leads",
    label: "Leads",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
      </svg>
    )
  },
  {
    id: "comparativo",
    label: "Comparativo",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19V6l7 6-7 7zM4 5v14" />
      </svg>
    )
  }
];

export function Sidebar({ current, onChange, totalLeadsPendentes }: SidebarProps) {
  const { paths, updatePaths } = usePaths();

  const fileNameOf = (p: string | null) => (p ? p.split(/[\\/]/).pop() ?? p : null);

  async function trocarLeads() {
    const filePath = await pickLeadsFile();
    if (filePath) await updatePaths({ leadsPath: filePath });
  }

  async function trocarMembros() {
    const filePath = await pickMembrosFile();
    if (filePath) await updatePaths({ membrosPath: filePath });
  }

  return (
    <aside className="flex w-60 flex-col border-r border-base-border bg-base-900 p-4">
      <div className="mb-6 flex items-center gap-2 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500/15 text-accent-400">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.52 3.48A11.86 11.86 0 0012.01 0C5.45 0 .13 5.32.13 11.87c0 2.09.55 4.13 1.6 5.93L0 24l6.35-1.66a11.87 11.87 0 005.66 1.44h.01c6.56 0 11.88-5.32 11.88-11.88 0-3.17-1.24-6.15-3.38-8.42zm-8.51 18.3h-.01a9.9 9.9 0 01-5.04-1.38l-.36-.21-3.76.99 1-3.67-.24-.38a9.9 9.9 0 01-1.52-5.26c0-5.46 4.45-9.9 9.93-9.9a9.86 9.86 0 017 2.9 9.83 9.83 0 012.9 7c0 5.46-4.45 9.91-9.9 9.91z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight text-slate-100">Leads Manager</p>
          <p className="text-[11px] leading-tight text-slate-500">WhatsApp Groups</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const active = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-brand-600/15 text-brand-400" : "text-slate-400 hover:bg-base-800 hover:text-slate-200"
              }`}
            >
              <span className="flex items-center gap-2.5">
                {item.icon}
                {item.label}
              </span>
              {item.id === "leads" && totalLeadsPendentes > 0 && (
                <span className="rounded-full bg-base-700 px-2 py-0.5 text-[11px] font-semibold text-slate-200">
                  {totalLeadsPendentes}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-2">
        <p className="px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Arquivos de dados</p>

        <div className="rounded-lg border border-base-border bg-base-850 p-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-slate-300">Leads</span>
            <button className="text-[11px] font-medium text-brand-400 hover:text-brand-300" onClick={trocarLeads}>
              Trocar
            </button>
          </div>
          <p className="mt-0.5 truncate text-[11px] text-slate-500" title={paths.leadsPath ?? ""}>
            {fileNameOf(paths.leadsPath) ?? "Nenhum arquivo"}
          </p>
        </div>

        <div className="rounded-lg border border-base-border bg-base-850 p-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-slate-300">Membros do grupo</span>
            <button className="text-[11px] font-medium text-brand-400 hover:text-brand-300" onClick={trocarMembros}>
              Trocar
            </button>
          </div>
          <p className="mt-0.5 truncate text-[11px] text-slate-500" title={paths.membrosPath ?? ""}>
            {fileNameOf(paths.membrosPath) ?? "Nenhum arquivo"}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-base-850 p-3 text-[11px] leading-relaxed text-slate-500">
        Todos os dados ficam salvos localmente nos seus arquivos JSON. Nenhuma informação é enviada para fora do seu
        computador.
      </div>
    </aside>
  );
}
