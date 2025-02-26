import { prisma } from "@/lib/db";
import { z } from "zod";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { validateJWT } from "@/utils/jwt";

// ✅ Zod Schema for Creating Dispatches
const DispatchSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  driverId: z.string().min(1, "Driver ID is required"),
  status: z.enum(["ASSIGNED", "IN_TRANSIT", "DELIVERED"]),
});

/** ✅ GET - Fetch Paginated Dispatches */
export const GET = async (request: Request) => {
  try {
    const session = await auth();
    if (session && session?.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const dispatches = await prisma.dispatch.findMany({
      skip,
      take: limit,
      include: {
        order: true,
        driver: { include: { user: { select: { name: true } } } },
      },
    });

    const totalDispatches = await prisma.dispatch.count();

    return NextResponse.json(
      {
        message: "Dispatches retrieved successfully",
        data: dispatches,
        pagination: { page, limit, totalDispatches },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching dispatches:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

/** ✅ POST - Create a Dispatch */
export const POST = async (request: Request) => {
  try {
    const session = await auth();
    const user = await validateJWT(request);
    if (
      (session && session?.user.role !== "ADMIN") ||
      (user && user.role !== "DRIVER")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsedData = DispatchSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Invalid data", errors: parsedData.error.format() },
        { status: 400 }
      );
    }

    const newDispatch = await prisma.dispatch.create({
      data: parsedData.data,
      include: { order: true, driver: true },
    });

    return NextResponse.json(
      { message: "Dispatch created successfully", data: newDispatch },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating dispatch:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
