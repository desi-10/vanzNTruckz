import { generateTokens, verifyRefreshToken } from "@/utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";
import { z } from "zod";

// Zod Schema for validating refresh token
const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    // Validate the refresh token
    const validate = refreshTokenSchema.safeParse(body);
    if (!validate.success) {
      return NextResponse.json(
        {
          error: "Invalid refresh token",
          errors: validate.error.format(),
        },
        { status: 400 }
      );
    }

    const { refreshToken } = validate.data;
    console.log("Refresh Token:", refreshToken);

    // Verify the refresh token
    const decodedToken = verifyRefreshToken(refreshToken);

    if (!decodedToken) {
      return NextResponse.json(
        { error: "Invalid or expired refresh token" },
        { status: 401 }
      );
    }

    const newAccessToken = generateTokens(
      (decodedToken as JwtPayload).userId
    ).accessToken;

    return NextResponse.json(
      {
        message: "New access token generated successfully",
        accessToken: newAccessToken,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Refresh Token Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
