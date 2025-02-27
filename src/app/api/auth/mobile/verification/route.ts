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
    const body = await request.json();
    const validation = verificationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input format" },
        { status: 400 }
      );
    }

    const { identifier } = validation.data;
    const sanitizedIdentifier = identifier.trim().toLowerCase();

    const otp = generateOtp();
    const expiresAt = dayjs().add(10, "minutes").toDate();

    await prisma.$transaction(async (tx) => {
      if (/^\S+@\S+\.\S+$/.test(sanitizedIdentifier)) {
        await tx.emailOTP.deleteMany({ where: { email: sanitizedIdentifier } });
        await tx.emailOTP.create({
          data: { email: sanitizedIdentifier, otp, expires: expiresAt },
        });
      } else if (/^\d{10,15}$/.test(sanitizedIdentifier)) {
        await tx.phoneOTP.deleteMany({ where: { phone: sanitizedIdentifier } });
        await tx.phoneOTP.create({
          data: { phone: sanitizedIdentifier, otp, expires: expiresAt },
        });
      } else {
        throw new Error("Invalid email or phone number");
      }
    });

    return NextResponse.json(
      { message: "OTP sent successfully", otp }, // ✅ No OTP in response
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
