import { getUserByEmail } from "@/data/user";
import { LoginSchema } from "@/types/user";
import { generateTokens } from "@/utils/jwt";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

// Allowed Roles
const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN", "SUB_ADMIN"];

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();

    // Validate request body with Zod
    const parsedData = LoginSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Invalid data", errors: parsedData.error.format() },
        { status: 400 }
      );
    }

    const { email, password } = parsedData.data;

    // Check if the user exists
    const user = await getUserByEmail(email);
    if (!user || !user.password || !user.email) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    // Check User Role Authorization
    if (!ALLOWED_ROLES.includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    // Generate JWT Token
    const token = generateTokens(user.id);

    return NextResponse.json(
      {
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          ...token,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
