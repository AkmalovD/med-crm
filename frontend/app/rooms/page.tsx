import { Suspense } from "react";

import { RoomsDashboardPage } from "@/components/rooms/RoomsDashboardPage";

export default function RoomsPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24, color: "#64748b" }}>Loading rooms…</div>}>
      <RoomsDashboardPage />
    </Suspense>
  );
}
