'use client'

import { DashboardScaffold } from "@/components/dashboard/DashboardScaffold";
import { useClientById } from "@/hooks/useClients";
import { formatDate } from "@/utils/clientsDashboardUtils";
import { useParams } from "next/navigation";
import { ArrowLeft, Building2, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default function ClientProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { data: client, isLoading, isError } = useClientById(id);

  return (
    <DashboardScaffold>
      <div className="flex flex-col gap-5">
        <Link
          href="/clients"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors w-fit"
        >
          <ArrowLeft size={15} />
          Back to Clients
        </Link>

        {isLoading && (
          <p className="text-sm text-slate-500 py-6">Loading client…</p>
        )}

        {isError && (
          <p className="text-sm text-red-500 py-6">Failed to load client. Make sure the backend is running.</p>
        )}

        {client && (
          <section className="rounded-xl border border-(--border) bg-white p-6">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-base font-bold text-slate-700">
                  {client.fullName
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((w) => w[0].toUpperCase())
                    .join("")}
                </span>
                <div>
                  <h1 className="text-2xl font-bold text-[#1a1a2e]">{client.fullName}</h1>
                  {client.organization && (
                    <p className="text-sm text-slate-500">{client.organization}</p>
                  )}
                </div>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  client.status === "active"
                    ? "bg-[#e8fbf4] text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {client.status === "active" ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <article className="flex items-start gap-3 rounded-lg border border-(--border) p-4">
                <Mail size={16} className="mt-0.5 shrink-0 text-slate-400" />
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Email</h2>
                  <a
                    href={`mailto:${client.email}`}
                    className="mt-1 block text-sm text-[#1a1a2e] hover:underline"
                  >
                    {client.email}
                  </a>
                </div>
              </article>

              <article className="flex items-start gap-3 rounded-lg border border-(--border) p-4">
                <Phone size={16} className="mt-0.5 shrink-0 text-slate-400" />
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Phone</h2>
                  <a
                    href={`tel:${client.number}`}
                    className="mt-1 block text-sm text-[#1a1a2e] hover:underline"
                  >
                    {client.number}
                  </a>
                </div>
              </article>

              {client.organization && (
                <article className="flex items-start gap-3 rounded-lg border border-(--border) p-4">
                  <Building2 size={16} className="mt-0.5 shrink-0 text-slate-400" />
                  <div>
                    <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Organization</h2>
                    <p className="mt-1 text-sm text-[#1a1a2e]">{client.organization}</p>
                  </div>
                </article>
              )}

              {client.address && (
                <article className="flex items-start gap-3 rounded-lg border border-(--border) p-4">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-slate-400" />
                  <div>
                    <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Address</h2>
                    <p className="mt-1 text-sm text-[#1a1a2e]">{client.address}</p>
                  </div>
                </article>
              )}

              <article className="flex items-start gap-3 rounded-lg border border-(--border) p-4">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Added On</h2>
                  <p className="mt-1 text-sm text-[#1a1a2e]">{formatDate(client.createdAt)}</p>
                </div>
              </article>

              <article className="flex items-start gap-3 rounded-lg border border-(--border) p-4">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Last Updated</h2>
                  <p className="mt-1 text-sm text-[#1a1a2e]">{formatDate(client.updatedAt)}</p>
                </div>
              </article>
            </div>
          </section>
        )}
      </div>
    </DashboardScaffold>
  );
}
