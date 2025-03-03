import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

// ✅ Zod Schema for Pagination
const PaginationSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});

export const GET = async (request: Request) => {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parsedQuery = PaginationSchema.safeParse(
      Object.fromEntries(searchParams.entries())
    );

    if (!parsedQuery.success) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    const page = parsedQuery.data.page ? parseInt(parsedQuery.data.page) : 1;
    const limit = parsedQuery.data.limit
      ? parseInt(parsedQuery.data.limit)
      : 10;
    const skip = (page - 1) * limit;

    const [customers, totalCustomers] = await prisma.$transaction([
      prisma.user.findMany({
        skip,
        take: limit,
        where: { role: "CUSTOMER" },
        omit: { password: true },
      }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
    ]);

    return NextResponse.json(
      {
        message: "Customers retrieved successfully",
        data: customers,
        pagination: {
          page,
          limit,
          totalCustomers,
          totalPages: Math.ceil(totalCustomers / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
