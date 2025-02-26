import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { TransactionSchema } from "@/types/transaction";
import { validateJWT } from "@/utils/jwt";
import { auth } from "@/auth";

export const GET = async (req: Request) => {
  try {
    const session = await auth();
    const user = await validateJWT(req);
    if ((session && session?.user.role !== "ADMIN") || !user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const transactions = await prisma.transaction.findMany({
      take: limit,
      skip,
      orderBy: { createdAt: "desc" },
      include: { customer: true, order: true },
    });

    const totalTransactions = await prisma.transaction.count();

    return NextResponse.json({
      message: "Transactions fetched successfully",
      data: transactions,
      pagination: { page, totalPages: Math.ceil(totalTransactions / limit) },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
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
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const body = await req.json();
    const parsedData = TransactionSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Invalid data", errors: parsedData.error.format() },
        { status: 400 }
      );
    }

    const { orderId, amount, status, paymentMethod } = parsedData.data;

    // Ensure the order exists
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        customerId: order.customerId,
        orderId,
        amount,
        status,
        paymentMethod,
      },
    });

    return NextResponse.json(
      { message: "Transaction recorded successfully", data: newTransaction },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
