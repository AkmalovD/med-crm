import { Bell, ChevronDown, Info, Search, User, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownDivider,
} from "@/components/custom-ui/dropdown";
import { useAuthStore } from "@/store/useAuthStore";

export function MedicalDashboardTopBar() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "ME";

  return (
    <div className="dashboard-topbar">
      <div className="dashboard-search">
        <Search size={15} color="#94a3b8" />
        <input placeholder="Search..." />
      </div>
      <div className="dashboard-topbar-actions">
        <button type="button" className="dashboard-icon-button">
          <Bell size={15} />
        </button>
        <button type="button" className="dashboard-icon-button">
          <Info size={15} />
        </button>
        <Dropdown>
          <DropdownTrigger className="dashboard-user-pill">
            <div className="dashboard-avatar">{initials}</div>
            <span>{user?.email ?? "Профиль"}</span>
            <ChevronDown size={14} className="text-slate-400 transition-transform duration-200 group-data-[open=true]:rotate-180" />
          </DropdownTrigger>
          <DropdownContent className="w-56">
            <DropdownItem><User size={14} /> Профиль</DropdownItem>
            <DropdownItem><Settings size={14} /> Настройки</DropdownItem>
            <DropdownDivider />
            <DropdownItem
              onClick={handleLogout}
              className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            >
              <LogOut size={14} /> Выйти
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      </div>
    </div>
  );
}
