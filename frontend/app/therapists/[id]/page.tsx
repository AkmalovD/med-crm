import { TherapistDetailPage } from "@/components/therapists/TherapistDetailPage";

interface TherapistDetailRouteProps {
  params: Promise<{ id: string }>;
}

export default async function TherapistDetailRoute({ params }: TherapistDetailRouteProps) {
  const { id } = await params;
  return <TherapistDetailPage therapistId={id} />;
}
