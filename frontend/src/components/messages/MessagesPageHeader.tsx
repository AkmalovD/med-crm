import { Plus } from "lucide-react";

interface MessagesPageHeaderProps {
  totalConversations: string;
  onNewConversation: () => void;
}

export function MessagesPageHeader({
  totalConversations,
  onNewConversation,
}: MessagesPageHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 max-[1080px]:items-start">
      <div className="flex items-center gap-3">
        <h1 className="text-4xl font-bold text-[#1a1a2e]">Messages</h1>
        <span className="inline-flex items-center rounded-full bg-[#eef7ff] px-[10px] py-1 text-xs font-bold text-[#31689e]">
          {totalConversations} chats
        </span>
      </div>

      <button
        type="button"
        className="inline-flex h-9 items-center gap-2 rounded-lg border-0 bg-(--primary) px-3 text-[13px] font-semibold text-white"
        onClick={onNewConversation}
      >
        <Plus size={16} />
        New Conversation
      </button>
    </header>
  );
}
