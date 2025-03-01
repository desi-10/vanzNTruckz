import { prisma } from "@/lib/db";
import { z } from "zod";
import { NextResponse } from "next/server";
import { validateJWT } from "@/utils/jwt";
import { auth } from "@/auth";

const OrderSchema = z.object({
  vehicleType: z.string({ required_error: "Vehicle type is required" }),
  deliveryAddress: z.string({ required_error: "Delivery address is required" }),
  pickUpAddress: z.string({ required_error: "Pickup address is required" }),
});

/** ✅ GET - Fetch Paginated Orders */
export const GET = async (request: Request) => {
  // const session = await auth();
  // if (!session || session.user.role !== "ADMIN") {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  try {
    const { searchParams } = new URL(request.url);
    let page = Number(searchParams.get("page")) || 1;
    let limit = Number(searchParams.get("limit")) || 50;

    // Ensure valid numbers and prevent negative values
    page = Math.max(page, 1);
    limit = Math.min(Math.max(limit, 1), 100); // Limit max to 100 to avoid heavy queries

    const skip = (page - 1) * limit;

    // Fetch orders and count in a single query
    const [orders, totalOrders] = await prisma.$transaction([
      prisma.order.findMany({
        skip,
        take: limit,
        include: {
          customer: {
            select: { name: true, email: true, phone: true, address: true },
          },
          driver: { select: { user: { select: { name: true } } } },
          dispatch: { select: { status: true } },
          transaction: {
            select: { amount: true, paymentMethod: true, status: true },
          },
        },
      }),
      prisma.order.count(),
    ]);

    return NextResponse.json(
      {
        message: "Orders retrieved successfully",
        data: orders,
        pagination: {
          page,
          limit,
          totalOrders,
          totalPages: Math.ceil(totalOrders / limit),
          hasNextPage: page * limit < totalOrders,
          hasPrevPage: page > 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
  const session = await auth();
  const user = await validateJWT(request);

  if (!session || !user || user.role !== "DRIVER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsedData = OrderSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Invalid data", errors: parsedData.error.format() },
        { status: 400 }
      );
    }

    const { vehicleType, pickUpAddress, deliveryAddress } = parsedData.data;

    // Filter drivers by vehicleType
    const drivers = await prisma.user.findMany({
      where: {
        role: "DRIVER",
        driverProfile: {
          vehicleType,
          kycStatus: "APPROVED",
        },
      },
    });

    if (drivers.length === 0) {
      return NextResponse.json(
        { error: "No drivers available" },
        { status: 404 }
      );
    }

    const newOrder = await prisma.order.create({
      data: {
        customerId: user.id,
        pickUpAddress,
        deliveryAddress,
      },
      include: { customer: true },
    });

    // Send Messages to Available Drivers
    await Promise.all(
      drivers.map(async (driver) => {
        // Example message function
        console.log(
          `Message sent to driver: ${driver.name} -  ${driver.phone}`
        );
      })
    );

    return NextResponse.json(
      { message: "Order created successfully", data: newOrder },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
