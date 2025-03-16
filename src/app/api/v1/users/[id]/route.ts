import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { deleteFile, uploadFile } from "@/utils/cloudinary";
import { validateJWT } from "@/utils/jwt";
import { NextResponse } from "next/server";
import { z } from "zod";

const UpdateUserSchema = z.object({
  identifier: z.string().min(1).max(255),
  name: z.string().min(2).max(50).optional().nullable(),
  phone: z.string().min(10).max(10).optional().nullable(),
  image: z
    .union([z.string().base64(), z.instanceof(File)])
    .optional()
    .nullable(),
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

    // Parse form data
    const body = await request.formData();
    const updateFields: Record<string, string | File | null> = {};

    // Validate only provided fields
    if (body.has("identifier"))
      updateFields.identifier = body.get("identifier");
    if (body.has("name")) updateFields.name = body.get("name");
    if (body.has("phone")) updateFields.phone = body.get("phone");
    if (body.has("image")) updateFields.image = body.get("image");

    // Validate user input
    const validatedData = UpdateUserSchema.safeParse(updateFields);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Invalid data", errors: validatedData.error.format() },
        { status: 400 }
      );
    }

    const { identifier, name, phone, image } = validatedData.data;
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
    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 404 }
      );
    }

    let updateResult = null;
    // Handle image upload if present
    if (validatedData.data.image && user.image) {
      if (user.image && typeof user.image === "object" && "id" in user.image) {
        await deleteFile(user.image.id as string);
      }
      updateResult = await uploadFile("profile", image as File | string);
    }

    // Update user in database with only provided fields
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || user.name,
        phone: phone || user.phone,
        image: updateResult || user.image || {},
        ...(isEmail
          ? { emailVerified: new Date() }
          : { phoneVerified: new Date() }),
        ...(isEmail
          ? { email: sanitizedIdentifier }
          : { phone: sanitizedIdentifier }),
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
