import { z } from "zod";

export const PricingSchema = z.object({
  serviceType: z.string().min(1, "Service type is required"),
  baseFare: z.number().positive(),
  perKmRate: z.number().positive(),
  perMinRate: z.number().positive(),
  isActive: z.boolean(),
});
