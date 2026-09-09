import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/* Harish Web Agency — Admin panel ke liye per-lead operations
   PATCH  /api/agency-leads/[id] → stage move (0=NEW 1=CONTACTED 2=MEETING 3=WEBSITE_BUILT 4=GOOGLE_PE_1)
   DELETE /api/agency-leads/[id] → lead delete (galat/test entries) */

const STAGE_MAX = 4;

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const leadId = Number(id);
    if (!Number.isInteger(leadId) || leadId <= 0) {
      return NextResponse.json({ error: "id galat he" }, { status: 400 });
    }

    const body = await req.json().catch(() => null);
    const stage = Number(body?.stage);
    if (!Number.isInteger(stage) || stage < 0 || stage > STAGE_MAX) {
      return NextResponse.json({ error: "stage 0 se 4 ke beech do" }, { status: 400 });
    }

    const lead = await db.lead.update({ where: { id: leadId }, data: { stage } });
    return NextResponse.json({ lead });
  } catch (e) {
    console.error("agency-leads PATCH failed:", e);
    return NextResponse.json({ error: "update fail — lead exist nahi karta ya DB down" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const leadId = Number(id);
    if (!Number.isInteger(leadId) || leadId <= 0) {
      return NextResponse.json({ error: "id galat he" }, { status: 400 });
    }

    await db.lead.delete({ where: { id: leadId } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("agency-leads DELETE failed:", e);
    return NextResponse.json({ error: "delete fail — lead exist nahi karta ya DB down" }, { status: 500 });
  }
}
