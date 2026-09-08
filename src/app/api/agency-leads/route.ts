import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/* Harish Web Agency — Virtual Office CRM leads
   GET  /api/agency-leads  → latest 30 leads (CRM pipeline me render hote he)
   POST /api/agency-leads  → naya lead save (enquiry form → stamp token bhi isi se aata he) */

const DEMO_START_TOKEN = 129; // mockup ke demo chips ke aage se real token count

export async function GET() {
  try {
    const leads = await db.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
    });
    return NextResponse.json({ leads });
  } catch (e) {
    console.error("agency-leads GET failed:", e);
    return NextResponse.json({ leads: [], error: "db-unavailable" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const naam = String(body?.naam ?? "").trim().slice(0, 60);
    const kaam = String(body?.kaam ?? "").trim().slice(0, 80) || "Website Banwana He";
    const phone = String(body?.phone ?? "").trim().slice(0, 20) || null;
    const msg = String(body?.msg ?? "").trim().slice(0, 500) || null;

    if (!naam) {
      return NextResponse.json({ error: "Naam to batao bhai! (Rule 1)" }, { status: 400 });
    }

    const last = await db.lead.aggregate({ _max: { token: true } });
    const token = Math.max(DEMO_START_TOKEN, last._max.token ?? DEMO_START_TOKEN) + 1;

    const lead = await db.lead.create({
      data: { naam, kaam, phone, msg, token, stage: 0 },
    });

    return NextResponse.json({ lead }, { status: 201 });
  } catch (e) {
    console.error("agency-leads POST failed:", e);
    return NextResponse.json({ error: "db-unavailable" }, { status: 500 });
  }
}
