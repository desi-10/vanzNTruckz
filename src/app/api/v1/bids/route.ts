import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { validateJWT } from "@/utils/jwt";
import { BidStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bidSchema = z.object({
  orderId: z.string(),
  amount: z.number().default(0),
  status: z.enum(["PENDING", "ACCEPTED", "REJECTED"]).default("PENDING"),
});

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth();
    const user = await validateJWT(req);
    if (!session || !user || user.role !== "DRIVER") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = bidSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          error: "Invalid data",
          errors: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { orderId, amount, status } = validated.data;

    const result = await prisma.$transaction(async (tx) => {
      if (
        !user.driverProfile ||
        user.driverProfile.kycStatus !== "APPROVED" ||
        !user.driverProfile.isActive
      ) {
        throw new Error("Driver not eligible to place bid");
      }

      const order = await tx.order.findUnique({
        where: { id: orderId },
      });

      if (
        !order ||
        order.status !== "PENDING" ||
        !order?.driverId ||
        user.driverProfile.vehicleType !== order.vehicleType
      ) {
        throw new Error("Order not available");
      }

      const existingBid = await tx.bid.findFirst({
        where: { orderId, driverId: user.id },
      });

      if (existingBid) {
        const updatedBid = await tx.bid.update({
          where: { id: existingBid.id },
          data: { amount, status: status as BidStatus },
        });

        await tx.inbox.create({
          data: {
            userId: order.customerId,
            message: `Bid updated by ${user.name} for Order #${order.id}`,
            type: "BID",
            isRead: false,
          },
        });

        return updatedBid;
      }

      const bid = await tx.bid.create({
        data: {
          orderId,
          driverId: user.id,
          amount,
          status: status as BidStatus,
        },
      });

      //   await tx.inbox.create({
      //     data: {
      //       userId: order.customerId,
      //       message: `New Bid Placed by ${user.name} for Order #${order.id}`,
      //       type: "BID",
      //       isRead: false,
      //     },
      //   });

      return bid;
    });

    return NextResponse.json(
      { message: "Bid placed successfully", data: result },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error placing bid:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
};
