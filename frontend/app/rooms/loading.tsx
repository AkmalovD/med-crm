import { DashboardScaffold } from "@/components/dashboard/DashboardScaffold";

export default function RoomsLoading() {
  return (
    <DashboardScaffold>
      <div style={{ padding: 24, background: "#f8fafc", minHeight: "100%" }}>
        <div
          style={{
            height: 32,
            width: 200,
            background: "#e2e8f0",
            borderRadius: 8,
            marginBottom: 16,
          }}
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ height: 88, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12 }} />
          ))}
        </div>
        <div style={{ height: 48, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, marginBottom: 12 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ height: 220, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12 }} />
          ))}
        </div>
      </div>
    </DashboardScaffold>
  );
}
