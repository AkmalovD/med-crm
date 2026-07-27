"use client";

import { Suspense } from "react";
import { DashboardScaffold } from "../dashboard/DashboardScaffold";
import { MessagesLayout } from "./MessagesLayout";

export function MessagesDashboardPage() {
  return (
    <DashboardScaffold>
      <Suspense>
        <MessagesLayout />
      </Suspense>
    </DashboardScaffold>
  );
}
