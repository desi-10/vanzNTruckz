import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { validateJWT } from "@/utils/jwt";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const session = await auth();
    const user = await validateJWT(req);

    if (!session && !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let id: string = "";

    if (session) {
      id = (await params).id;
    }

    if (user && !session) {
      id = user.id;
    }

    console.log("Final ID:", id);

    // Fetch Driver
    const driver = await prisma.driver.findUnique({
      where: { userId: id },
      include: {
        user: true,
      },
    });

    if (!driver) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Driver fetched successfully", data: driver },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
