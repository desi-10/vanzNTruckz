import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { PricingSchema } from "@/types/pricing";

import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const pricingPlans = await prisma.pricing.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      { message: "Pricing plans fetched successfully", data: pricingPlans },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching pricing:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const POST = async (req: Request) => {
  try {
    const session = await auth();
    if (session && session?.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsedData = PricingSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Invalid data", errors: parsedData.error.format() },
        { status: 400 }
      );
    }

    const newPricing = await prisma.pricing.create({ data: parsedData.data });

    return NextResponse.json(
      { message: "Pricing added successfully", data: newPricing },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding pricing:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
