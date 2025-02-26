import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../api/orders";

export const UseOrders = (page: number = 1, limit: number = 50) => {
  return useQuery({
    queryKey: ["orders", page],
    queryFn: () => getOrders(page, limit),
  });
};
