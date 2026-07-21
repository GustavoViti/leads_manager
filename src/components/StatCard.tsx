import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  tone?: "default" | "success" | "warning" | "brand";
}

const toneStyles: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "text-slate-100",
  success: "text-accent-400",
  warning: "text-amber-400",
  brand: "text-brand-400"
};

export function StatCard({ label, value, icon, tone = "default" }: StatCardProps) {
  return (
    <div className="card flex items-center justify-between p-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
        <p className={`mt-1 text-2xl font-semibold ${toneStyles[tone]}`}>{value}</p>
      </div>
      {icon && <div className="text-slate-500">{icon}</div>}
    </div>
  );
}
