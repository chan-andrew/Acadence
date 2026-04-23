import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const firstName = String(body.firstName ?? "").trim();
    const username = String(body.username ?? "").trim().toLowerCase();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!firstName || !username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }
    if (firstName.length > 50) {
      return NextResponse.json(
        { error: "First name is too long." },
        { status: 400 }
      );
    }
    if (!USERNAME_RE.test(username)) {
      return NextResponse.json(
        {
          error:
            "Username must be 3–20 characters using letters, numbers, or underscores.",
        },
        { status: 400 }
      );
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
      select: { email: true, username: true },
    });
    if (existing) {
      const conflict = existing.email === email ? "email" : "username";
      return NextResponse.json(
        { error: `That ${conflict} is already in use.` },
        { status: 409 }
      );
    }

    const hashed = await hash(password, 12);
    await prisma.user.create({
      data: {
        firstName,
        name: firstName,
        username,
        email,
        password: hashed,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("signup error", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
