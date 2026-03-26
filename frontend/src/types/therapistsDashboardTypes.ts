export type TherapistStatus = "active" | "on_leave" | "inactive";
export type EmploymentType = "full_time" | "part_time" | "contractor";
export type Specialization =
  | "articulation"
  | "fluency"
  | "language_development"
  | "voice"
  | "cognitive_communication"
  | "swallowing"
  | "aac"
  | "autism"
  | "early_intervention";

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface WorkingHours {
  day: DayOfWeek;
  isWorking: boolean;
  startTime: string;
  endTime: string;
  maxSessions: number;
}

export interface TherapistClient {
  id: string;
  fullName: string;
  age: number;
  diagnosis: string;
  therapyType: "individual" | "group" | "online";
  totalSessions: number;
  lastSessionDate: string | null;
}

export interface TherapistPerformance {
  sessionsThisMonth: number;
  completedSessions: number;
  cancelledSessions: number;
  revenueThisMonth: number;
  sessionsDeltaVsLastMonth: number;
  revenueDeltaVsLastMonth: number;
}

export interface Therapist {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar: string | null;
  phone: string;
  email: string;
  bio: string | null;
  specializations: Specialization[];
  qualifications: string[];
  certifications: string[];
  yearsOfExperience: number;
  languagesSpoken: string[];
  employmentType: EmploymentType;
  role: "admin" | "therapist" | "receptionist";
  joinDate: string;
  status: TherapistStatus;
  onLeaveUntil: string | null;
  maxClientsCapacity: number;
  currentClientCount: number;
  color: string;
  lastLoginAt: string | null;
  isEmailVerified: boolean;
  clients: TherapistClient[];
  workingHours: WorkingHours[];
  performance: TherapistPerformance;
}

export type TherapistSortBy = "name" | "joinDate" | "clientCount" | "lastLogin";
export type SortDir = "asc" | "desc";

