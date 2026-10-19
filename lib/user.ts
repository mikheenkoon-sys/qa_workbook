import { clerkClient } from "@clerk/nextjs/server";
import { Prisma, type User } from "@prisma/client";
import prisma from "@/lib/prisma";

// Resolves the DB user for a Clerk session, backfilling it if the `user.created`
// webhook hasn't synced yet (e.g. no local webhook listener configured).
export async function getOrCreateUser(clerkId: string): Promise<User> {
  const existing = await prisma.user.findUnique({ where: { clerkId } });
  if (existing) return existing;

  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(clerkId);
  const email =
    clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress ??
    "";
  const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null;

  try {
    return await prisma.user.create({ data: { clerkId, email, name } });
  } catch (error) {
    // Webhook may have created the row concurrently - fall back to it instead of erroring.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const user = await prisma.user.findUnique({ where: { clerkId } });
      if (user) return user;
    }
    throw error;
  }
}
