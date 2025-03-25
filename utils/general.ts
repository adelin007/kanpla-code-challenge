import { Basket } from "@/types/appTypes";

export const generateId = () => Math.random().toString().slice(2);
export const getTotalPrice = (basket: Basket) => {
  return basket?.products?.reduce(
    (acc, item) => acc + item.price_unit * item.quantity,
    0
  );
};
