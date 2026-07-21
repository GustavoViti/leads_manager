import { StatusConversao } from "@/types/config";

export function StatusBadge({ status }: { status: StatusConversao }) {
  if (status === "entrou") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-500/10 px-2.5 py-1 text-xs font-medium text-accent-400">
        <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
        Entrou no grupo
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
      Ainda não entrou
    </span>
  );
}
