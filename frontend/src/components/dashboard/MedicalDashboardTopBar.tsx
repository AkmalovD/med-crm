import { Bell, ChevronDown, Info, Search, User, Settings, LogOut } from "lucide-react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownDivider,
} from "@/components/custom-ui/dropdown";

export function MedicalDashboardTopBar() {
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
            <div className="dashboard-avatar">EB</div>
            <span>Erik Brown</span>
            <ChevronDown size={14} className="text-slate-400 transition-transform duration-200 group-data-[open=true]:rotate-180" />
          </DropdownTrigger>
          <DropdownContent className="w-56">
            <DropdownItem><User size={14} /> Profile</DropdownItem>
            <DropdownItem><Settings size={14} /> Settings</DropdownItem>
            <DropdownDivider />
            <DropdownItem className="text-rose-600 hover:bg-rose-50 hover:text-rose-700">
              <LogOut size={14} /> Logout
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      </div>
    </div>
  );
}
