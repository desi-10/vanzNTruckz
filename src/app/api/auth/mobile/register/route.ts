import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";

// Define validation schema
const registerSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(6),
  name: z.string().min(2),
  otp: z.string().length(4), // Ensure OTP is exactly 4 digits
  role: z.enum(["CUSTOMER", "DRIVER"]).default("CUSTOMER"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input format" },
        { status: 400 }
      );
    }

    const { identifier, password, name, otp, role } = validation.data;
    const sanitizedIdentifier = identifier.trim().toLowerCase();

    let isEmail = false;
    let user = null;

    // Identify email or phone
    if (/^\S+@\S+\.\S+$/.test(sanitizedIdentifier)) {
      isEmail = true;
      user = await prisma.user.findUnique({
        where: { email: sanitizedIdentifier },
      });
    } else if (/^\d{10,15}$/.test(sanitizedIdentifier)) {
      user = await prisma.user.findUnique({
        where: { phone: sanitizedIdentifier },
      });
    } else {
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

    // Verify OTP
    const otpRecord = isEmail
      ? await prisma.emailOTP.findFirst({
          where: { email: sanitizedIdentifier, otp },
        })
      : await prisma.phoneOTP.findFirst({
          where: { phone: sanitizedIdentifier, otp },
        });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "Invalid OTP or OTP expired" },
        { status: 401 }
      );
    }

    // Delete OTP after successful verification
    if (isEmail) {
      await prisma.emailOTP.deleteMany({
        where: { email: sanitizedIdentifier },
      });
    } else {
      await prisma.phoneOTP.deleteMany({
        where: { phone: sanitizedIdentifier },
      });
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        password: hashedPassword,
        role: role,
        ...(isEmail
          ? { emailVerified: new Date() }
          : { phoneVerified: new Date() }),
        ...(isEmail
          ? { email: sanitizedIdentifier }
          : { phone: sanitizedIdentifier }),
      },
    });

    return NextResponse.json(
      {
        message: "User registered successfully.",
        user: { id: newUser.id, name: newUser.name },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
