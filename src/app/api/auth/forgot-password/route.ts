import { getUserByEmail } from "@/data/user";
import { prisma } from "@/lib/db";
import { sendOtpViaEmail } from "@/lib/email";
import { ForgotPasswordSchema } from "@/types/user";
import { generateOtp } from "@/utils/generate-otp";
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs"; // For handling timestamps

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();

    // Validate request body
    const parsedData = ForgotPasswordSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Invalid data", errors: parsedData.error.format().email },
        { status: 400 }
      );
    }

    const { email } = parsedData.data;

    // Check if user exists
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or user does not exist" },
        { status: 400 }
      );
    }

    // Delete any existing OTP for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email },
    });

    // Generate new OTP
    const otp = generateOtp();
    const expiresAt = dayjs().add(10, "minutes").toDate(); // Expire in 10 minutes

    // Store OTP in database
    await prisma.passwordResetToken.create({
      data: {
        email,
        otp,
        expires: expiresAt,
      },
    });

    // Send OTP via email
    await sendOtpViaEmail(user.email || "", otp);

    return NextResponse.json(
      { message: "OTP has been sent to your email" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
};
