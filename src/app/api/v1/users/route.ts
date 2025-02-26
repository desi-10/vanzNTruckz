import { getUserByEmail } from "@/data/user";
import { prisma } from "@/lib/db";
import { RegisterSchema } from "@/types/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { auth } from "@/auth";

// ✅ Zod Schema for Pagination
const PaginationSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});

/** ✅ GET - Fetch Paginated Users */
export const GET = async (request: Request) => {
  try {
    const session = await auth();
    if (session && session?.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parsedQuery = PaginationSchema.safeParse(
      Object.fromEntries(searchParams)
    );

    if (!parsedQuery.success) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    const page = Number(parsedQuery.data.page) || 1;
    const limit = Number(parsedQuery.data.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        driverProfile: true,
        orders: true,
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

/** ✅ POST - Register a User */
export const POST = async (request: Request) => {
  try {
    const session = await auth();
    if (session && session?.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsedData = RegisterSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Invalid data", errors: parsedData.error.format() },
        { status: 400 }
      );
    }

    const { name, email, password, role, licenseNumber, vehicleType } =
      parsedData.data;

    // Check if user exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        emailVerified: new Date(),
        password: hashedPassword,
        role,
        driverProfile: { create: { license: licenseNumber, vehicleType } },
      },
      select: { id: true, name: true, email: true, driverProfile: true },
    });

    return NextResponse.json(
      { message: "User created successfully", data: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
