import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import { uploadFile } from "@/utils/cloudinary";

const QuerySchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("10"),
});

export const GET = async (request: Request) => {
  try {
    // Authenticate user
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const parsedQuery = QuerySchema.safeParse(Object.fromEntries(searchParams));

    if (!parsedQuery.success) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    // Convert to numbers and ensure valid values
    const page = Math.max(1, Number(parsedQuery.data.page));
    const limit = Math.max(1, Math.min(100, Number(parsedQuery.data.limit))); // Prevent excessive limits
    const skip = (page - 1) * limit;

    // Fetch users
    const users = await prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        driverProfile: true,
      },
    });

    const totalUsers = await prisma.user.count();

    return NextResponse.json(
      {
        message: "Users retrieved successfully",
        data: users,
        pagination: { page, limit, totalUsers },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

const UserSchema = z.object({
  identifier: z.string().min(1).max(255),
  password: z.string().min(6).max(255),
  name: z.string().min(1).max(255),
  role: z
    .enum(["ADMIN", "DRIVER", "CUSTOMER", "SUPER_ADMIN", "SUB_ADMIN"])
    .default("CUSTOMER"),
  image: z
    .union([z.string().base64(), z.instanceof(File)])
    .optional()
    .nullable(),
});

export async function POST(req: Request) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.formData();

    // Validate input
    const validation = UserSchema.safeParse({
      identifier: body.get("identifier"),
      password: body.get("password"),
      name: body.get("name"),
      role: body.get("role"),
      image: body.get("image"),
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input format" },
        { status: 400 }
      );
    }

    const { identifier, password, name, role } = validation.data;
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

    let uploadResult = null;
    if (validation.data.image) {
      uploadResult = await uploadFile("profile", validation.data.image);
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        password: hashedPassword,
        role: role,
        image: uploadResult || {},
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
