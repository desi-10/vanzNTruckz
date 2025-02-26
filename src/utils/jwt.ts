import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || "accesssecret";
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "refreshsecret";
const EMAIL_SECRET = process.env.EMAIL_TOKEN_SECRET || "emailsecret";

export const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(userId, ACCESS_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(userId, REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

export const generateEmailVerificationToken = (email: string): string => {
  return jwt.sign({ email }, EMAIL_SECRET, { expiresIn: "1h" });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET);
};

export const verifyEmailToken = (token: string) => {
  return jwt.verify(token, EMAIL_SECRET);
};

export const validateJWT = async (req: Request) => {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);
    return await prisma.user.findUnique({ where: { id: decoded as string } });
  } catch (error) {
    console.error("JWT validation failed:", error);
    return null; // Invalid token
  }
};
