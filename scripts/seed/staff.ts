import { db } from "../../src/server/db";
import { staffMembers, staffSchedules } from "../../src/server/db/schema";
import { ORG_ID } from "./business";

export interface SeededStaff {
  id: string;
  name: string;
  email: string;
  role: string;
}

export async function seedStaff(): Promise<SeededStaff[]> {
  console.log("👥 Seeding staff members...");

  // Static UUIDs to maintain idempotency
  const staffData = [
    {
      id: "77777777-1111-1111-1111-111111111111",
      name: "Olivia Vane",
      role: "admin", // Master Esthetician & Manager
      email: "olivia.v@glowandgrace.com",
      phone: "+15551112222",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
      bufferTime: 10,
    },
    {
      id: "77777777-2222-2222-2222-222222222222",
      name: "Marcus Vance",
      role: "staff", // Senior Massage Therapist
      email: "marcus.v@glowandgrace.com",
      phone: "+15552223333",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      bufferTime: 15,
    },
    {
      id: "77777777-3333-3333-3333-333333333333",
      name: "Sophia Martinez",
      role: "staff", // Advanced Skin Therapist
      email: "sophia.m@glowandgrace.com",
      phone: "+15553334444",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      bufferTime: 5,
    },
    {
      id: "77777777-4444-4444-4444-444444444444",
      name: "Chloe Dubois",
      role: "staff", // Nail Artist & Brow Specialist
      email: "chloe.d@glowandgrace.com",
      phone: "+15554445555",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      bufferTime: 10,
    },
    {
      id: "77777777-5555-5555-5555-555555555555",
      name: "Liam O'Connor",
      role: "staff", // Licensed Massage Practitioner
      email: "liam.o@glowandgrace.com",
      phone: "+15555556666",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      bufferTime: 15,
    },
    {
      id: "77777777-6666-6666-6666-666666666666",
      name: "Elena Rostova",
      role: "staff", // Clinical Dermal Specialist
      email: "elena.r@glowandgrace.com",
      phone: "+15556667777",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop",
      bufferTime: 5,
    }
  ];

  for (const staff of staffData) {
    await db.insert(staffMembers).values({
      id: staff.id,
      organizationId: ORG_ID,
      name: staff.name,
      role: staff.role,
      email: staff.email,
      phone: staff.phone,
      avatarUrl: staff.avatarUrl,
      bufferTime: staff.bufferTime,
      isActive: true,
    }).onConflictDoNothing();

    // Seed Schedules (Tuesday to Sunday, Monday closed)
    // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
    for (let day = 0; day <= 6; day++) {
      if (day === 1) continue; // Skip Monday (closed)

      let shifts = [{ start: "09:00", end: "17:00" }];
      if (day === 0) { // Sunday shifts are shorter
        shifts = [{ start: "10:00", end: "16:00" }];
      } else if (day === 4 || day === 5) { // Thursday/Friday shifts are longer
        shifts = [{ start: "09:00", end: "20:00" }];
      }

      await db.insert(staffSchedules).values({
        organizationId: ORG_ID,
        staffMemberId: staff.id,
        dayOfWeek: day,
        shifts: shifts,
      }).onConflictDoNothing();
    }
  }

  console.log(`✅ Seeded ${staffData.length} Staff members with schedules`);
  return staffData.map(s => ({ id: s.id, name: s.name, email: s.email, role: s.role }));
}
