import { prisma } from "@/lib/db";
import jwt, { JwtPayload } from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || "accesssecret";
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "refreshsecret";
const EMAIL_SECRET = process.env.EMAIL_TOKEN_SECRET || "emailsecret";

export const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ userId }, ACCESS_SECRET, {
    expiresIn: "1m",
  });
  const refreshToken = jwt.sign({ userId }, REFRESH_SECRET, {
    expiresIn: "10m",
  });

  return { accessToken, refreshToken };
};

export const generateEmailVerificationToken = (email: string): string => {
  return jwt.sign({ email }, EMAIL_SECRET, { expiresIn: "1h" });
};

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, ACCESS_SECRET);
  } catch (error) {
    console.error("Access Token Error:", error);
    return null;
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch (error) {
    console.error("Refresh Token Error:", error);
    return null;
  }
};

export const verifyEmailToken = (token: string) => {
  return jwt.verify(token, EMAIL_SECRET);
};

export const validateJWT = async (req: Request) => {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = verifyAccessToken(token);
    console.log("Decoded Token:", decodedToken);
    if (!decodedToken) return null;

    return await prisma.user.findUnique({
      where: { id: (decodedToken as JwtPayload).userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        driverProfile: true,
      },
    });
  } catch (error) {
    console.error("JWT validation failed:", error);
    return null; // Invalid token
  }
};
