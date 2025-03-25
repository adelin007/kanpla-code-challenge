export type Product = {
  id: string;
  name: string;
  price_unit: number;
  vat_rate: number;
};

export type OrderStatus = "pending" | "completed" | "failed";
export type Order = {
  id: string;
  amount_total: number;
  basket_id: string;
  user_id: string;
  created_at: string;
  status: OrderStatus;
};

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
export type Payment = {
  id: string;
  amount: number;
  user_id: string;
  created_at: string;
  status: PaymentStatus;
  type: string;
  order_id: string;
};

export type BasketProduct = Product & {
  quantity: number;
};
export type Basket = {
  id: string;
  products: BasketProduct[];
};
