import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/* Harish Web Agency — Workrooms Meeting Room TEAM
   GET  /api/team  → saare active members (empty ho to Harish auto-seed)
   POST /api/team  → NAYA MEMBER ADD (name + role + color... meeting room ke ADD MEMBER form se) */

const SHIRTS = ["#2563eb", "#16a34a", "#dc2626", "#9333ea", "#ea580c", "#0891b2", "#be185d", "#65a30d"];

async function seedBossOnce() {
  const count = await db.teamMember.count();
  if (count > 0) return;
  await db.teamMember.create({
    data: {
      name: "Harish Mugal",
      role: "Founder & Service Manager",
      color: "#2563eb",
      task: "Meeting chala raha he",
      sortOrder: 0,
    },
  });
}

export async function GET() {
  try {
    await seedBossOnce();
    const team = await db.teamMember.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    });
    return NextResponse.json({ team });
  } catch (e) {
    console.error("team GET failed:", e);
    return NextResponse.json({ team: [], error: "db-unavailable" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const name = String(body?.name ?? "").trim().slice(0, 40);
    const role = String(body?.role ?? "Full-Stack Developer").trim().slice(0, 60) || "Full-Stack Developer";
    const task = String(body?.task ?? "Kaam pe he").trim().slice(0, 80) || "Kaam pe he";

    if (!name) {
      return NextResponse.json({ error: "Member ka naam to batao bhai! (Rule 1)" }, { status: 400 });
    }

    const last = await db.teamMember.aggregate({ _max: { sortOrder: true } });
    const idx = await db.teamMember.count();

    const member = await db.teamMember.create({
      data: {
        name,
        role,
        task,
        color: SHIRTS[idx % SHIRTS.length],
        skin: ["#e8b98a", "#c98d5f", "#8d5a3a", "#f2c9a0"][idx % 4],
        hair: ["#2b2b2b", "#4a2f1d", "#111111", "#5c3a21"][idx % 4],
        hairstyle: idx % 4,
        sortOrder: (last._max.sortOrder ?? -1) + 1,
      },
    });

    return NextResponse.json({ member }, { status: 201 });
  } catch (e) {
    console.error("team POST failed:", e);
    return NextResponse.json({ error: "db-unavailable" }, { status: 500 });
  }
}
