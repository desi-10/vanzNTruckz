import { auth } from "@/auth";
import { prisma } from "@/lib/db";

import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const session = await auth();
    if (session && session?.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Pagination
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const drivers = await prisma.driver.findMany({
      take: limit,
      skip,
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    const totalDrivers = await prisma.driver.count();

    return NextResponse.json({
      message: "Drivers fetched successfully",
      data: drivers,
      pagination: { page, totalPages: Math.ceil(totalDrivers / limit) },
    });
  } catch (error) {
    console.error("Error fetching drivers:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
