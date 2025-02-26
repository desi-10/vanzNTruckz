import { getUserByEmail } from "@/data/user";
import { prisma } from "@/lib/db";
import { sendOtpViaEmail } from "@/lib/email";
import { LoginSchema } from "@/types/user";
import { generateOtp } from "@/utils/generate-otp";
import { generateTokens } from "@/utils/jwt";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();

    // Validate request body with Zod
    const parsedData = LoginSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Invalid data", errors: parsedData.error.format() },
        { status: 400 }
      );
    }

    const { email, password } = parsedData.data;

    // Check if the user exists
    const user = await getUserByEmail(email);
    if (!user || !user.password || !user.email) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    // Check if the user is verified
    if (!user.emailVerified) {
      // Delete any existing OTP for this email
      await prisma.emailOTP.deleteMany({
        where: { email },
      });

      const otp = generateOtp();
      const expiresAt = dayjs().add(2, "minutes").toDate(); // Expire in 2 minutes

      await prisma.emailOTP.create({
        data: {
          email,
          otp,
          expires: expiresAt,
        },
      });
      // Send verification email
      await sendOtpViaEmail(user.email, otp);
      return NextResponse.json(
        { error: "OTP has been sent to your email" },
        { status: 400 }
      );
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    // Generate JWT token
    const token = generateTokens(user.id);

    return NextResponse.json(
      { data: { id: user.id, name: user.name, email: user.email, ...token } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
