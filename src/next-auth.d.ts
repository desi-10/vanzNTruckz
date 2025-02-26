import { UserRole } from "@prisma/client";
import { type DefaultSession } from "next-auth";

export type ExtendeUser = DefaultSession["user"] & {
  phoneNumber: string;
  userAddress: string;
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendeUser;
  }
}
