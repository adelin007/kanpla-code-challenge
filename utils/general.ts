import { Basket, Product } from "@/types/appTypes";

export const generateId = () => Math.random().toString().slice(2);
export const getTotalPrice = (basket: Basket) => {
  return basket?.products?.reduce(
    (acc, item) => acc + getTotalProductPrice(item) * item.quantity,
    0
  );
};

export const getTotalProductPrice = (product: Product) => {
  if (!product || !product.price_unit) {
    return 0;
  }
  const { price_unit, vat_rate } = product;
  const roundedInitialPrice = Math.round(price_unit * 100) / 100;

  const finalProductPrice = roundedInitialPrice * (vat_rate + 1);

  return finalProductPrice;
};

export const formatDate = (dateInput: string) => {
  const parsedDate = new Date(dateInput);
  if (isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  const date = parsedDate.getDate();
  const month = parsedDate.getMonth() + 1;
  const year = parsedDate.getFullYear();

  const hours = parsedDate.getUTCHours();
  const minutes = parsedDate.getUTCMinutes();

  return `${date} / ${month} / ${year} - ${hours}:${minutes}`;
};
