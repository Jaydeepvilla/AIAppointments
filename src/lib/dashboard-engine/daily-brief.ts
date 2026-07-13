import { conversationsRepository } from "@/server/repositories/conversations";
import { appointmentsRepository } from "@/server/repositories/appointments";
import { escalationsRepository } from "@/server/repositories/escalations";
import { activityRepository } from "@/server/repositories/activity";

export interface DailyBriefData {
  conversationsHandled: number;
  appointmentsBooked: number;
  appointmentsCancelled: number;
  appointmentsNoShow: number;
  escalations: number;
  missedOpportunities: number;
  estimatedTimeSavedMinutes: number;
  revenueGenerated: number;
  aiSuccessRate: number;
  date: string;
}

function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export async function getDailyBrief(organizationId: string): Promise<DailyBriefData> {
  const todayStart = startOfToday();
  const now = new Date();

  const [allConversations, allAppointments, allEscalations] = await Promise.all([
    conversationsRepository.list(organizationId),
    appointmentsRepository.list(organizationId, {
      startDate: todayStart,
      endDate: now,
    }),
    escalationsRepository.list(organizationId),
  ]);

  // Filter conversations to today
  const todayConversations = allConversations.filter(
    (c) => new Date(c.createdAt) >= todayStart
  );

  // Filter escalations to today
  const todayEscalations = allEscalations.filter(
    (e) => new Date(e.createdAt) >= todayStart
  );

  const conversationsHandled = todayConversations.length;
  const escalations = todayEscalations.length;

  // Appointments metrics from joined results
  const todayAppointments = allAppointments;
  const appointmentsBooked = todayAppointments.filter(
    (a) => a.appointment.status === "confirmed" || a.appointment.status === "completed"
  ).length;
  const appointmentsCancelled = todayAppointments.filter(
    (a) => a.appointment.status === "cancelled"
  ).length;
  const appointmentsNoShow = todayAppointments.filter(
    (a) => a.appointment.status === "no_show"
  ).length;

  // Revenue: sum pricePaid from today's confirmed/completed appointments
  const revenueGenerated = todayAppointments.reduce((sum, a) => {
    if (
      (a.appointment.status === "confirmed" || a.appointment.status === "completed") &&
      a.appointment.pricePaid
    ) {
      return sum + parseFloat(a.appointment.pricePaid);
    }
    return sum;
  }, 0);

  // Time saved: avg 3.2 minutes per AI-handled conversation (industry benchmark)
  const aiHandled = Math.max(0, conversationsHandled - escalations);
  const estimatedTimeSavedMinutes = Math.round(aiHandled * 3.2);

  // AI success rate: conversations resolved without escalation
  const aiSuccessRate =
    conversationsHandled > 0
      ? Math.round(((conversationsHandled - escalations) / conversationsHandled) * 100)
      : 100;

  // Missed opportunities: escalations + cancelled + no-shows
  const missedOpportunities = escalations + appointmentsCancelled + appointmentsNoShow;

  return {
    conversationsHandled,
    appointmentsBooked,
    appointmentsCancelled,
    appointmentsNoShow,
    escalations,
    missedOpportunities,
    estimatedTimeSavedMinutes,
    revenueGenerated,
    aiSuccessRate,
    date: new Date().toISOString(),
  };
}
