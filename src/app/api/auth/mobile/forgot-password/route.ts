import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";

const forgotPasswordSchema = z.object({
  identifier: z.string().min(3),
  otp: z.string().length(4), // Ensure OTP is exactly 4 digits
  password: z.string().min(6),
});

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const validation = forgotPasswordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input format" },
        { status: 400 }
      );
    }

    const { identifier, otp, password } = validation.data;
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

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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

    // Hash the new password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json(
      { message: "Password reset successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
