import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { sendOtpViaEmail } from "@/lib/email";
import { getUserByEmail } from "@/data/user";
import { RegisterSchema } from "@/types/user";
import { generateOtp } from "@/utils/generate-otp";
import dayjs from "dayjs";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();

    const parsedData = RegisterSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Invalid data", errors: parsedData.error.format() },
        { status: 400 }
      );
    }

    const { name, email, password } = parsedData.data;

    // Check if the user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    if (!newUser.email) {
      return NextResponse.json({ error: "Email not found" }, { status: 400 });
    }

    const otp = generateOtp();
    const expiresAt = dayjs().add(2, "minutes").toDate(); // Expire in 2 minutes

    await prisma.emailOTP.create({
      data: {
        email: newUser.email,
        otp,
        expires: expiresAt,
      },
    });

    await sendOtpViaEmail(newUser.email, otp);

    return NextResponse.json(
      { message: "User registered successfully. Please verify your email." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
