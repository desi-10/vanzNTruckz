import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";

// Define validation schema
const registerSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(6),
  name: z.string().min(2),
});

export async function POST(req: Request) {
  try {
    const { identifier, password, name } = await req.json();

    // Validate input using Zod
    const validation = registerSchema.safeParse({ identifier, password, name });
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input format" },
        { status: 400 }
      );
    }

    let user;
    let isEmail = false;
    const sanitizedIdentifier = identifier.trim().toLowerCase(); // Normalize input

    // Check if identifier is an email
    if (/^\S+@\S+\.\S+$/.test(sanitizedIdentifier)) {
      isEmail = true;
      user = await prisma.user.findUnique({
        where: { email: sanitizedIdentifier },
      });
    }
    // Check if identifier is a phone number
    else if (/^\d{10,15}$/.test(sanitizedIdentifier)) {
      user = await prisma.user.findUnique({
        where: { phone: sanitizedIdentifier },
      });
    }
    // Invalid input
    else {
      return NextResponse.json(
        { error: "Please enter a valid email or phone number" },
        { status: 400 }
      );
    }

    // Check if user already exists
    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        name,
        password: hashedPassword,
        ...(isEmail
          ? { email: sanitizedIdentifier }
          : { phone: sanitizedIdentifier }),
      },
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: { id: newUser.id, name: newUser.name },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
