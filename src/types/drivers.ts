import { z } from "zod";

export const DriverSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  license: z.string().min(1, "License is required"),
  vehicleType: z.string().min(1, "Vehicle type is required"),
  status: z.boolean(),
});
