import { Plus } from "lucide-react";

interface ClientsPageHeaderProps {
  totalClients: string;
  onAddClient: () => void
}

export function ClientsPageHeader({ totalClients, onAddClient }: ClientsPageHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 max-[1080px]:items-start">
      <div className="flex items-center gap-3">
        <h1 className="text-4xl font-bold text-[#1a1a2e]">Clients</h1>
        <span className="inline-flex items-center rounded-full bg-[#eef7ff] px-[10px] py-1 text-xs font-bold text-[#31689e]">
          {totalClients} clients
        </span>
      </div>

      <button 
        type="button" 
        className="inline-flex h-9 items-center gap-2 rounded-lg border-0 bg-(--primary) px-3 text-[13px] font-semibold text-white"
        onClick={onAddClient}
      >
        <Plus size={16} />
        Add Client
      </button>
    </header>
  );
}
