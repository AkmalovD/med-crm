"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardScaffold } from "../dashboard/DashboardScaffold";
import styles from "./TherapistsDashboardPage.module.css";
import { EMPLOYMENT_LABELS, SPECIALIZATION_LABELS, STATUS_LABELS, THERAPISTS } from "@/data/therapistsData/therapistsDashboardData";
import { formatDate, formatDateTime } from "@/utils/therapistsDashboardUtils";

const TABS = ["profile", "availability", "clients", "performance", "account"] as const;
type DetailTab = (typeof TABS)[number];

interface TherapistDetailPageProps {
  therapistId: string;
}

export function TherapistDetailPage({ therapistId }: TherapistDetailPageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DetailTab>("profile");
  const therapist = useMemo(() => THERAPISTS.find((item) => item.id === therapistId), [therapistId]);

  if (!therapist) {
    return (
      <DashboardScaffold>
        <div className={styles.page}>
          <button type="button" className={styles.ghostButton} onClick={() => router.push("/therapists")}>
            <ArrowLeft size={14} />
            Back to therapists
          </button>
          <div className={styles.detailCard}>
            <h2 className="text-xl font-bold text-[#1a1a2e]">Therapist not found</h2>
          </div>
        </div>
      </DashboardScaffold>
    );
  }

  const completionRate =
    therapist.performance.sessionsThisMonth > 0
      ? Math.round((therapist.performance.completedSessions / therapist.performance.sessionsThisMonth) * 100)
      : 0;

  return (
    <DashboardScaffold>
      <div className={styles.page}>
        <button type="button" className={styles.ghostButton} onClick={() => router.push("/therapists")}>
          <ArrowLeft size={14} />
          Back to therapists
        </button>

        <section className={styles.detailHeader}>
          <div className={styles.therapistCell}>
            <span className={styles.avatarLarge}>
              {therapist.firstName[0]}
              {therapist.lastName[0]}
            </span>
            <div>
              <h1 className="text-3xl font-bold text-[#1a1a2e]">{therapist.fullName}</h1>
              <div className={styles.specializationsWrap}>
                {therapist.specializations.map((specialization) => (
                  <span key={specialization} className={styles.specializationBadge}>
                    {SPECIALIZATION_LABELS[specialization]}
                  </span>
                ))}
              </div>
              <div className={styles.metaRow}>
                <span className={styles.statusBadge}>{STATUS_LABELS[therapist.status]}</span>
                <span className={styles.employmentBadge}>
                  {EMPLOYMENT_LABELS[therapist.employmentType]}
                </span>
                <span>Joined {formatDate(therapist.joinDate)}</span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.tabsBar}>
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`${styles.tabButton} ${activeTab === tab ? styles.tabButtonActive : ""}`}
            >
              {tab[0].toUpperCase()}
              {tab.slice(1)}
            </button>
          ))}
        </section>

        {activeTab === "profile" && (
          <section className={styles.detailGrid}>
            <article className={styles.detailCard}>
              <h2 className={styles.detailCardTitle}>Personal Information</h2>
              <p className={styles.mutedText}>{therapist.email}</p>
              <p className={styles.mutedText}>{therapist.phone}</p>
              <p className="mt-3 text-sm text-slate-600">{therapist.bio ?? "No biography available."}</p>
              <h3 className={styles.subTitle}>Languages</h3>
              <div className={styles.tagWrap}>
                {therapist.languagesSpoken.map((item) => (
                  <span key={item} className={styles.specializationBadge}>
                    {item}
                  </span>
                ))}
              </div>
            </article>

            <article className={styles.detailCard}>
              <h2 className={styles.detailCardTitle}>Professional Information</h2>
              <p className={styles.mutedText}>{therapist.yearsOfExperience} years experience</p>
              <h3 className={styles.subTitle}>Qualifications</h3>
              <ul className={styles.list}>
                {therapist.qualifications.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <h3 className={styles.subTitle}>Certifications</h3>
              <ul className={styles.list}>
                {therapist.certifications.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className={styles.detailCard}>
              <h2 className={styles.detailCardTitle}>Capacity</h2>
              <p className={styles.mutedText}>
                {therapist.currentClientCount} / {therapist.maxClientsCapacity} client slots used
              </p>
              <div className={styles.capacityBarLarge}>
                <span
                  style={{
                    width: `${Math.round(
                      (therapist.currentClientCount / Math.max(1, therapist.maxClientsCapacity)) * 100,
                    )}%`,
                  }}
                />
              </div>
            </article>
          </section>
        )}

        {activeTab === "availability" && (
          <section className={styles.detailCard}>
            <h2 className={styles.detailCardTitle}>Availability</h2>
            <table className={styles.availabilityTable}>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Working?</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Max Sessions</th>
                </tr>
              </thead>
              <tbody>
                {therapist.workingHours.map((slot) => (
                  <tr key={slot.day} className={!slot.isWorking ? styles.disabledRow : ""}>
                    <td>{slot.day[0].toUpperCase() + slot.day.slice(1)}</td>
                    <td>{slot.isWorking ? "Yes" : "No"}</td>
                    <td>{slot.isWorking ? slot.startTime : "--:--"}</td>
                    <td>{slot.isWorking ? slot.endTime : "--:--"}</td>
                    <td>{slot.isWorking ? slot.maxSessions : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {activeTab === "clients" && (
          <section className={styles.detailCard}>
            <h2 className={styles.detailCardTitle}>Assigned Clients</h2>
            <p className={styles.mutedText}>No client records are linked in this dashboard mock yet.</p>
          </section>
        )}

        {activeTab === "performance" && (
          <section className={styles.detailCard}>
            <h2 className={styles.detailCardTitle}>Performance Snapshot</h2>
            <div className={styles.performanceGrid}>
              <article className={styles.performanceCell}>
                <p className={styles.mutedText}>Sessions This Month</p>
                <p className={styles.bigNumber}>{therapist.performance.sessionsThisMonth}</p>
              </article>
              <article className={styles.performanceCell}>
                <p className={styles.mutedText}>Completed</p>
                <p className={styles.bigNumber}>{therapist.performance.completedSessions}</p>
              </article>
              <article className={styles.performanceCell}>
                <p className={styles.mutedText}>Cancelled</p>
                <p className={styles.bigNumber}>{therapist.performance.cancelledSessions}</p>
              </article>
              <article className={styles.performanceCell}>
                <p className={styles.mutedText}>Revenue This Month</p>
                <p className={styles.bigNumber}>${therapist.performance.revenueThisMonth}</p>
              </article>
            </div>
            <div className={styles.capacityBarLarge}>
              <span style={{ width: `${completionRate}%` }} />
            </div>
            <p className={styles.mutedText}>Completion rate: {completionRate}%</p>
            <button type="button" className={styles.ghostButton} onClick={() => router.push(`/analytics?therapist=${therapist.id}`)}>
              View Full Analytics
              <ArrowRight size={14} />
            </button>
          </section>
        )}

        {activeTab === "account" && (
          <section className={styles.detailCard}>
            <h2 className={styles.detailCardTitle}>Account</h2>
            <div className={styles.infoRows}>
              <p>
                <strong>Email:</strong> {therapist.email} ({therapist.isEmailVerified ? "Verified" : "Unverified"})
              </p>
              <p>
                <strong>Role:</strong> {therapist.role}
              </p>
              <p>
                <strong>Last Login:</strong> {formatDateTime(therapist.lastLoginAt)}
              </p>
              <p>
                <strong>Status:</strong> {STATUS_LABELS[therapist.status]}
              </p>
            </div>
          </section>
        )}
      </div>
    </DashboardScaffold>
  );
}

