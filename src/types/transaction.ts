import { z } from "zod";

export const TransactionSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  amount: z.number().positive(),
  status: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]),
  paymentMethod: z.enum(["CARD", "WALLET", "CASH"]),
});
