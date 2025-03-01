import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { Driver, User } from "@prisma/client";
import { generateTokens } from "@/utils/jwt";

// Define the validation schema
const loginSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json();

    // Validate input using Zod
    const validation = loginSchema.safeParse({ identifier, password });
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input format" },
        { status: 400 }
      );
    }

    let user: (User & { driverProfile: Driver | null }) | null = null;

    // Check if identifier is an email
    if (/^\S+@\S+\.\S+$/.test(identifier)) {
      user = await prisma.user.findUnique({
        where: { email: identifier },
        include: { driverProfile: true },
      });
    }
    // Check if identifier is a phone number
    else if (/^\d{10,15}$/.test(identifier)) {
      user = await prisma.user.findUnique({
        where: { phone: identifier },
        include: { driverProfile: true },
      });
    }
    // Invalid input
    else {
      return NextResponse.json(
        { error: "Please enter a valid email or phone number" },
        { status: 400 }
      );
    }

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateTokens(user.id);

    return NextResponse.json(
      {
        message: "Login successful",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
          image: user.image,
          ...(user.role === "DRIVER"
            ? { driverProfile: user.driverProfile }
            : {}),
          ...token,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
