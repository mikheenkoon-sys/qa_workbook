import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import prisma from "@/lib/prisma";

type ClerkUserEvent = {
  type: "user.created" | "user.updated" | "user.deleted";
  data: { id: string; email_addresses: { email_address: string }[]; first_name?: string; last_name?: string };
};

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Missing webhook secret" }, { status: 500 });

  const headersList = await headers();
  const svixHeaders = {
    "svix-id":        headersList.get("svix-id") ?? "",
    "svix-timestamp": headersList.get("svix-timestamp") ?? "",
    "svix-signature": headersList.get("svix-signature") ?? "",
  };

  const body = await req.text();

  let event: ClerkUserEvent;
  try {
    event = new Webhook(secret).verify(body, svixHeaders) as unknown as ClerkUserEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const { id: clerkId, email_addresses, first_name, last_name } = event.data;
  const email = email_addresses[0]?.email_address ?? "";
  const name = [first_name, last_name].filter(Boolean).join(" ") || null;

  if (event.type === "user.created") {
    await prisma.user.create({ data: { clerkId, email, name } });
  } else if (event.type === "user.updated") {
    await prisma.user.update({ where: { clerkId }, data: { email, name } });
  } else if (event.type === "user.deleted") {
    await prisma.user.delete({ where: { clerkId } });
  }

  return NextResponse.json({ received: true });
}
