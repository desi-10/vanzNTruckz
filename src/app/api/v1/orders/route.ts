import { prisma } from "@/lib/db";
import { z } from "zod";
import { NextResponse } from "next/server";
import { validateJWT } from "@/utils/jwt";
import { auth } from "@/auth";
import { uploadFile } from "@/utils/cloudinary";

const OrderSchema = z.object({
  pickUp: z.string().min(1, "Pick up address is required"),
  dropOff: z.string().min(1, "Drop off address is required"),
  vehicleType: z.string().min(1, "Vehicle type is required"),
  parcelType: z.string().min(1, "Parcel type is required"),
  pieces: z.coerce.number().min(1, "Pieces is required"),
  image: z
    .union([z.string().base64(), z.instanceof(File)])
    .optional()
    .nullable(),
  recepientName: z.string().min(1, "Recipient name is required"),
  recepientNumber: z.string().min(1, "Recipient number is required"),
  additionalInfo: z.string().optional().nullable(),

  // Customer fields
  BaseCharges: z.coerce.number().min(1, "Base charges is required"),
  distanceCharges: z.coerce.number().min(1, "Distance charges is required"),
  timeCharges: z.coerce.number().min(1, "Time charges is required"),
  AdditionalCharges: z.coerce.number().min(1, "Additional charges is required"),
  totalEstimatedFare: z.coerce
    .number()
    .min(1, "Total estimated cost is required"),

  coupon: z.string().optional().nullable(),
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

    console.log(orders, "orders");

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
  const id = validateJWT(request);

  let user = null;

  if (id) {
    user = await prisma.user.findUnique({
      where: { id },
    });
  }

  // Ensure `user` is defined before accessing `user.role`
  if (!(session?.user.role === "ADMIN" || user?.role === "CUSTOMER")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.formData();
    const parsedData = OrderSchema.safeParse({
      pickUp: body.get("pickUp") as string,
      dropOff: body.get("dropOff") as string,
      vehicleType: body.get("vehicleType") as string,
      parcelType: body.get("parcelType") as string,
      pieces: body.get("pieces") as string,
      image: body.get("image") as File,
      recepientName: body.get("recepientName") as string,
      recepientNumber: body.get("recepientNumber") as string,
      additionalInfo: body.get("additionalInfo") as string,
      BaseCharges: body.get("BaseCharges") as string,
      distanceCharges: body.get("distanceCharges") as string,
      timeCharges: body.get("timeCharges") as string,
      AdditionalCharges: body.get("AdditionalCharges") as string,
      totalEstimatedFare: body.get("totalEstimatedFare") as string,
    });

    if (!parsedData.success) {
      console.log(parsedData.error.format(), "parsedData.error.format()");

      return NextResponse.json(
        { error: "Invalid data", errors: parsedData.error.format() },
        { status: 400 }
      );
    }

    const {
      pickUp,
      dropOff,
      vehicleType,
      parcelType,
      pieces,
      image,
      recepientName,
      recepientNumber,
      additionalInfo,
      BaseCharges,
      distanceCharges,
      timeCharges,
      AdditionalCharges,
      totalEstimatedFare,
      coupon,
    } = parsedData.data;

    let uploadResult = null;
    if (image instanceof File) {
      uploadResult = await uploadFile("orders", image);
    }

    // Run all database operations in a Prisma transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          customerId: user?.id || session?.user.id || "",
          pickUp,
          dropOff,
          vehicleType,
          parcelType,
          pieces,
          image: uploadResult || {},
          recepientName,
          recepientNumber,
          additionalInfo,
          BaseCharges,
          distanceCharges,
          timeCharges,
          AdditionalCharges,
          totalEstimatedFare,
          couponId: coupon || null,
          status: "PENDING",
        },
        include: { customer: { select: { id: true, name: true } } },
      });

      return newOrder;
    });

    console.log(result, "result");

    return NextResponse.json(
      { message: "Order created successfully", data: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
