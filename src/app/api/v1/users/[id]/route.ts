import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { deleteFile, uploadFile } from "@/utils/cloudinary";
import { validateJWT } from "@/utils/jwt";
import { NextResponse } from "next/server";
import { z } from "zod";

const UpdateUserSchema = z.object({
  email: z.string().email().optional().nullish(),
  phone: z.string().min(10).max(10).optional().nullish(),
  name: z.string().min(2).max(50).optional().nullish(),
  address: z.string().min(2).max(50).optional().nullish(),
  otp: z.string().length(4).optional().nullish(),
  image: z
    .union([z.string().base64(), z.instanceof(File)])
    .optional()
    .nullish(),
});

export const GET = async (request: Request) => {
  try {
    // Web authentication (session) & Mobile authentication (JWT)
    const session = await auth(); // Web
    const userId = session?.user.id || validateJWT(request); // Mobile

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        role: true,
        driverProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User retrieved successfully", data: user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const PATCH = async (request: Request) => {
  try {
    // Web authentication (session) & Mobile authentication (JWT)
    const session = await auth();
    const userId = session?.user?.id || validateJWT(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse form data
    const body = await request.formData();
    const updateFields: Record<string, string | File | null> = {};

    // Validate only provided fields
    if (body.has("email")) updateFields.email = body.get("email") as string;
    if (body.has("name")) updateFields.name = body.get("name") as string;
    if (body.has("phone")) updateFields.phone = body.get("phone") as string;
    if (body.has("address"))
      updateFields.address = body.get("address") as string;
    if (body.has("image"))
      updateFields.image = body.get("image") as File | string | null;
    if (body.has("otp")) updateFields.otp = body.get("otp") as string;

    if ((updateFields.email || updateFields.phone) && !updateFields.otp) {
      return NextResponse.json({ error: "OTP is required" }, { status: 400 });
    }

    // Validate OTP if provided
    if (updateFields.otp) {
      const otpRecord = await prisma.idOTP.findFirst({
        where: { id: user.id, otp: updateFields.otp as string },
      });

      if (!otpRecord) {
        return NextResponse.json(
          { error: "Invalid OTP or OTP expired" },
          { status: 401 }
        );
      }

      await prisma.idOTP.delete({ where: { id: otpRecord.id } });
    }

    // Validate user input
    const validatedData = UpdateUserSchema.safeParse(updateFields);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Invalid data", errors: validatedData.error.format() },
        { status: 400 }
      );
    }

    const { email, phone, name, address, image } = validatedData.data;

    let imageUploadResult = null;

    // Handle image upload if present
    if (image) {
      // Delete old image if exists
      if (user.image && typeof user.image === "object" && "id" in user.image) {
        await deleteFile(user.image.id as string);
      }

      // Upload new image
      imageUploadResult = await uploadFile("profile", image);
    }

    // Update user in database with only provided fields
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        email: email || user.email,
        phone: phone || user.phone,
        name: name || user.name,
        address: address || user.address,
        image: imageUploadResult || user.image || {},
      },
    });

    return NextResponse.json(
      { message: "User updated successfully", data: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
