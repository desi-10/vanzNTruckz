import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Invalid email",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const RegisterSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["ADMIN", "SUB_ADMIN", "CUSTOMER", "DRIVER"]),
    licenseNumber: z.string().optional(), // Required only for drivers
    vehicleType: z.string().optional(), // Required only for drivers
  })
  .refine(
    (data) => {
      if (data.role === "DRIVER") {
        return (
          data.licenseNumber &&
          data.licenseNumber.length > 0 &&
          data.vehicleType &&
          data.vehicleType.length > 0
        );
      }
      return true;
    },
    {
      message: "License number and vehicle type are required for drivers",
      path: ["licenseNumber", "vehicleType"],
    }
  );

export const ForgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Invalid email",
  }),
});
