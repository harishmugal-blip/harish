import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/* Harish Web Agency — single team member
   PATCH  /api/team/[id] → naam/role/color/task update (meeting room avatar card se)
   DELETE /api/team/[id] → member remove (active=false, chair khaali) */

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const mid = Number(id);
    if (!Number.isInteger(mid)) {
      return NextResponse.json({ error: "bad id" }, { status: 400 });
    }

    const body = await req.json().catch(() => null);
    const data: Record<string, string | boolean | number> = {};
    if (typeof body?.name === "string" && body.name.trim()) data.name = body.name.trim().slice(0, 40);
    if (typeof body?.role === "string" && body.role.trim()) data.role = body.role.trim().slice(0, 60);
    if (typeof body?.task === "string") data.task = body.task.trim().slice(0, 80) || "Kaam pe he";
    if (typeof body?.color === "string" && /^#[0-9a-fA-F]{6}$/.test(body.color)) data.color = body.color;
    if (typeof body?.skin === "string" && /^#[0-9a-fA-F]{6}$/.test(body.skin)) data.skin = body.skin;
    if (typeof body?.hair === "string" && /^#[0-9a-fA-F]{6}$/.test(body.hair)) data.hair = body.hair;
    if (Number.isInteger(body?.hairstyle)) data.hairstyle = Math.max(0, Math.min(3, body.hairstyle));

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "kuch change to karo" }, { status: 400 });
    }

    const member = await db.teamMember.update({ where: { id: mid }, data });
    return NextResponse.json({ member });
  } catch (e) {
    console.error("team PATCH failed:", e);
    return NextResponse.json({ error: "db-unavailable" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const mid = Number(id);
    if (!Number.isInteger(mid)) {
      return NextResponse.json({ error: "bad id" }, { status: 400 });
    }
    await db.teamMember.update({ where: { id: mid }, data: { active: false } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("team DELETE failed:", e);
    return NextResponse.json({ error: "db-unavailable" }, { status: 500 });
  }
}
