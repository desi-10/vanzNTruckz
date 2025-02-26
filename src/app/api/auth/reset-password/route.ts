import { getUserByEmail } from "@/data/user";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";

// Define schema for token validation
const VerifyTokenSchema = z.object({
  password: z
    .string()
    .min(6, "New password must be at least 6 characters long"),
  otp: z.string().min(4, "OTP is required").max(4, "OTP must be 4 digits"),
});

export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    // Validate request body
    const parsedData = VerifyTokenSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Invalid token data", errors: parsedData.error.format() },
        { status: 400 }
      );
    }

    const { otp, password } = parsedData.data;

    // Find OTP in database
    const verifiedToken = await prisma.passwordResetToken.findUnique({
      where: {  otp },
    });

    // Check if OTP exists and is still valid
    if (!verifiedToken || dayjs().isAfter(verifiedToken.expires)) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Fetch user details
    const user = await getUserByEmail(verifiedToken.email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Hash the new password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Delete OTP after successful password reset
    await prisma.passwordResetToken.deleteMany({
      where: { email: verifiedToken.email },
    });

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
};
