"use server";

import { currentUser } from "@clerk/nextjs/server";
import { userRepository } from "../repositories/user";
import { User } from "../../lib/types";

export async function syncClerkUser(): Promise<User | null> {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return null;
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) {
    throw new Error("Clerk user must have an email address");
  }

  const fullName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ");

  return userRepository.upsert({
    id: clerkUser.id,
    email,
    name: fullName || null,
    avatar: clerkUser.imageUrl || null,
  });
}
