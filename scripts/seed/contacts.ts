import { db } from "../../src/server/db";
import { leadProfiles } from "../../src/server/db/schema";
import { ORG_ID } from "./business";

export interface SeededContact {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export async function seedContacts(): Promise<SeededContact[]> {
  console.log("👤 Seeding 100+ contacts (leadProfiles)...");

  // Create solid lists of names to generate highly realistic, non-repeating pairs
  const firstNames = [
    "Emma", "Liam", "Olivia", "Noah", "Ava", "Oliver", "Sophia", "Elijah", "Isabella", "James",
    "Mia", "Benjamin", "Charlotte", "Lucas", "Amelia", "Mason", "Harper", "Ethan", "Evelyn", "Alexander",
    "Abigail", "Henry", "Emily", "Jacob", "Elizabeth", "Michael", "Sofia", "Daniel", "Avery", "Logan",
    "Ella", "Jackson", "Madison", "Sebastian", "Scarlett", "Jack", "Victoria", "Aiden", "Aria", "Owen",
    "Grace", "Samuel", "Chloe", "Matthew", "Camila", "Joseph", "Penelope", "Levi", "Riley", "Mateo",
    "Layla", "David", "Lillian", "John", "Nora", "Wyatt", "Zoey", "Carter", "Mila", "Julian",
    "Aubrey", "Luke", "Hannah", "Grayson", "Lily", "Isaac", "Addison", "Jayden", "Eleanor", "Theodore",
    "Natalie", "Gabriel", "Luna", "Ryan", "Savannah", "Emilio", "Brooklyn", "Connor", "Leah", "Santiago",
    "Zoe", "Christian", "Stella", "Landon", "Hazel", "Aaron", "Ellie", "Hunter", "Paisley", "Jonathan",
    "Audrey", "Nolan", "Skyler", "Adrian", "Claire", "Connor", "Anna", "Ezra", "Bella", "Jeremiah",
    "Naomi", "Carlos", "Alice", "Jose", "Eva", "Ian", "Ruby", "Mateo", "Julia", "Aaron", "Ivy"
  ];

  const lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
    "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
    "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
    "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts",
    "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz", "Edwards", "Collins", "Reyes",
    "Stewart", "Morris", "Morales", "Murphy", "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper",
    "Peterson", "Bailey", "Reed", "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson",
    "Watson", "Brooks", "Chavez", "Wood", "James", "Bennett", "Gray", "Mendoza", "Ruiz", "Hughes",
    "Price", "Alvarez", "Castillo", "Sanders", "Patel", "Myers", "Long", "Ross", "Foster", "Jimenez",
    "Porter", "Wallace", "Dupont", "Russo", "Ferrari", "Kovalenko", "Sato", "Suzuki", "Cohen", "Levy"
  ];

  const statuses = ["New", "Qualified", "Hot", "Booked", "Escalated", "Closed"];
  
  const tagList = [
    ["VIP Client", "Prefers Olivia"],
    ["Sensitive Skin", "Chemical Peel Alert"],
    ["Massage Regular", "Deep Tissue Pref"],
    ["New Client", "Intro Discount Sent"],
    ["Weekend Only", "SMS Contact Pref"],
    ["No-Show History", "Pre-Pay Required"],
    ["Facial Addict", "Hydrafacial Pref"],
    ["Brow Shape Regular"],
    ["Lash Extensions Care"],
    [],
  ];

  const seededContacts: SeededContact[] = [];

  // Generate 110 unique contacts
  for (let i = 0; i < 110; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${i}@gg-salon-seed.com`;
    const phone = `+1555${(1000000 + i).toString().slice(1)}`; // +1 555 000 001, etc.
    const status = statuses[i % statuses.length];
    const score = Math.floor(Math.random() * 85) + 15; // 15 to 99
    const ltv = Math.floor(Math.random() * 8) * 150 + (i % 2 === 0 ? 95 : 0); // up to 1200+
    const tags = tagList[i % tagList.length];
    const notes = i % 3 === 0 
      ? `Customer interested in regular skin treatments. Reported ${firstName} has slight sensitivity to harsh alcohols.` 
      : `Prefers soft ambient music. Usually books online.`;
    
    // We will generate a static UUID pattern for contacts based on index so it is idempotent
    const contactId = `88888888-8888-4888-8888-${(100000000000 + i).toString()}`;

    await db.insert(leadProfiles).values({
      id: contactId,
      organizationId: ORG_ID,
      name,
      email,
      phone,
      status,
      leadScore: score,
      summary: `${name} is a ${status.toLowerCase()} client with a lead score of ${score}.`,
      lifetimeValue: ltv,
      tags,
      notes,
      conversationCount: Math.floor(Math.random() * 4) + 1,
    }).onConflictDoNothing();

    seededContacts.push({
      id: contactId,
      name,
      email,
      phone,
    });
  }

  console.log(`✅ Seeded ${seededContacts.length} Contacts (leadProfiles)`);
  return seededContacts;
}
