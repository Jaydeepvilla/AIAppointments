import { streamText, tool } from 'ai'
import { z } from 'zod'
import { db } from '@/lib/db'
import { services, availability } from '@/lib/db/schema'

const MODEL = 'anthropic/claude-sonnet-4.6'

const tools = {
  getServices: tool({
    description: 'Get available dental services',
    inputSchema: z.object({}),
    execute: async () => {
      const allServices = await db.select().from(services)
      return allServices.map((s) => ({
        id: s.id,
        name: s.name,
        duration: s.durationMinutes,
        price: s.price,
      }))
    },
  }),

  getAvailability: tool({
    description: 'Get clinic availability for a specific day of week (0-6, where 0 is Sunday)',
    inputSchema: z.object({
      dayOfWeek: z.number().min(0).max(6),
    }),
    execute: async ({ dayOfWeek }) => {
      const slots = await db
        .select()
        .from(availability)
        .where((t) => t.dayOfWeek === dayOfWeek)
      return slots.map((s) => ({
        start: s.startTime,
        end: s.endTime,
      }))
    },
  }),

  suggestTimeSlot: tool({
    description: 'Suggest optimal appointment time slots based on service duration',
    inputSchema: z.object({
      serviceDuration: z.number().describe('Duration of service in minutes'),
      dayOfWeek: z.number().min(0).max(6).describe('Day of week (0=Sunday, 6=Saturday)'),
    }),
    execute: async ({ serviceDuration, dayOfWeek }) => {
      const availability_slots = await db
        .select()
        .from(availability)
        .where((t) => t.dayOfWeek === dayOfWeek)

      if (!availability_slots.length) return { slots: [] }

      const slots = []
      for (const slot of availability_slots) {
        const startHour = parseInt(slot.startTime)
        const endHour = parseInt(slot.endTime)
        const requiredHours = serviceDuration / 60

        for (let hour = startHour; hour < endHour - requiredHours; hour++) {
          slots.push({
            time: `${String(hour).padStart(2, '0')}:00`,
            available: true,
          })
        }
      }

      return { slots: slots.slice(0, 5) }
    },
  }),
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const result = streamText({
      model: MODEL,
      system: `You are a friendly dental clinic booking assistant. Help patients schedule appointments by:
1. Understanding their needs (which service they need)
2. Suggesting available time slots
3. Collecting their contact information
4. Confirming the appointment details

Always be professional, friendly, and helpful. When suggesting appointments, use the tools to check available services and time slots.`,
      messages,
      tools,
      maxSteps: 10,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to process chat request',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
