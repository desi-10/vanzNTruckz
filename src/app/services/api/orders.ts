import axios from "axios";

export const getOrders = async (page: number, limit: number = 50) => {
  const { data } = await axios.get(
    `/api/v1/orders?page=${page}&limit=${limit}`
  );
  return data;
};
