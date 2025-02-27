import { prisma } from "@/lib/db";
import { generateOtp } from "@/utils/generate-otp";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const verificationSchema = z.object({
  identifier: z.string().min(3),
});

export const POST = async (request: Request) => {
  try {
    const body = await request.json(); // ✅ Properly parse request body
    const validation = verificationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input format" },
        { status: 400 }
      );
    }

    const { identifier } = validation.data;
    const sanitizedIdentifier = identifier.trim().toLowerCase(); // ✅ Normalize input

    const otp = generateOtp();
    const expiresAt = dayjs().add(10, "minutes").toDate(); // Expire in 2 minutes

    // ✅ Check if identifier is an email
    if (/^\S+@\S+\.\S+$/.test(sanitizedIdentifier)) {
      await prisma.emailOTP.deleteMany({
        where: { email: sanitizedIdentifier },
      });

      await prisma.emailOTP.create({
        data: { email: sanitizedIdentifier, otp, expires: expiresAt },
      });

      console.log(`OTP for ${sanitizedIdentifier}: ${otp}`); // ✅ For debugging only
    }
    // ✅ Check if identifier is a phone number
    else if (/^\d{10,15}$/.test(sanitizedIdentifier)) {
      await prisma.phoneOTP.deleteMany({
        where: { phone: sanitizedIdentifier },
      });

      await prisma.phoneOTP.create({
        data: { phone: sanitizedIdentifier, otp, expires: expiresAt },
      });

      console.log(`OTP for ${sanitizedIdentifier}: ${otp}`); // ✅ For debugging only
    }
    // ❌ Invalid input
    else {
      return NextResponse.json(
        { error: "Please enter a valid email or phone number" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "OTP sent successfully", otp }, // ❌ Removed OTP from response
      { status: 200 }
    );
  } catch (error) {
    console.error("OTP Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
