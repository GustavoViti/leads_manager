import { usePaths } from "@/context/PathsContext";
import { pickLeadsFile, pickMembrosFile } from "@/services/dataService";

interface FileSlotProps {
  label: string;
  description: string;
  fileName: string | null;
  onSelect: () => void;
}

function FileSlot({ label, description, fileName, onSelect }: FileSlotProps) {
  return (
    <div className="card flex items-center justify-between gap-4 p-4">
      <div>
        <p className="text-sm font-medium text-slate-100">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
        {fileName && <p className="mt-1 truncate text-xs font-mono text-accent-400">{fileName}</p>}
      </div>
      <button className="btn-secondary shrink-0" onClick={onSelect}>
        {fileName ? "Trocar arquivo" : "Selecionar arquivo"}
      </button>
    </div>
  );
}

export function SetupWizard() {
  const { paths, updatePaths } = usePaths();

  async function handleSelectLeads() {
    const filePath = await pickLeadsFile();
    if (filePath) await updatePaths({ leadsPath: filePath });
  }

  async function handleSelectMembros() {
    const filePath = await pickMembrosFile();
    if (filePath) await updatePaths({ membrosPath: filePath });
  }

  const fileNameOf = (p: string | null) => (p ? p.split(/[\\/]/).pop() ?? p : null);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-base-950 p-8">
      <div className="w-full max-w-lg">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-slate-100">Configuração inicial</h1>
          <p className="mt-1 text-sm text-slate-400">
            Selecione os arquivos JSON de leads e de membros atuais do grupo para começar.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <FileSlot
            label="Leads extraídos"
            description="Arquivo com os contatos extraídos de outros grupos (ex: fontenossa.json)."
            fileName={fileNameOf(paths.leadsPath)}
            onSelect={handleSelectLeads}
          />
          <FileSlot
            label="Membros atuais do grupo"
            description="Arquivo com os membros atuais do seu grupo de WhatsApp."
            fileName={fileNameOf(paths.membrosPath)}
            onSelect={handleSelectMembros}
          />
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          O controle de enviados (enviados.json) será localizado ou criado automaticamente na próxima etapa.
        </p>
      </div>
    </div>
  );
}
