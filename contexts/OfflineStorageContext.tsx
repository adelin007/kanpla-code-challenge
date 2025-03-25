import { Basket, Order, Product } from "@/types/appTypes";
import { getData } from "@/utils/asyncStorage";
import React, { useState, useContext, useEffect } from "react";

interface OfflineStorageContextValue {
  products: Product[];
  orders: Order[];
  basket: Basket | null;
  isFetching: boolean;
}

interface OfflineStorageContextProviderProps {
  children?: React.ReactNode;
}

export interface OfflineStorageDispatchContextValue {
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setBasket: React.Dispatch<React.SetStateAction<Basket | null>>;
  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
}

export const OfflineStorageContext =
  React.createContext<OfflineStorageContextValue | null>(null);
export const OfflineStorageDispatchContext =
  React.createContext<OfflineStorageDispatchContextValue | null>(null);

export const OfflineStorageContextProvider = ({
  children,
}: OfflineStorageContextProviderProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [basket, setBasket] = useState<Basket | null>(null);

  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      const products: Product[] = await getData("products");
      if (Array.isArray(products)) {
        setProducts(products);
      } else {
        setProducts([]);
      }
    };

    const getOrders = async () => {
      const orders: Order[] = await getData("orders");
      if (Array.isArray(orders)) {
        setOrders(orders);
      } else {
        setOrders([]);
      }
    };

    const getBasket = async () => {
      const basket: Basket = await getData("basket");
      setBasket(basket);
    };

    getProducts();
    getOrders();
    getBasket();
  }, [getData]);

  return (
    <OfflineStorageContext.Provider
      value={{
        products,
        orders,
        basket,
        isFetching,
      }}
    >
      <OfflineStorageDispatchContext.Provider
        value={{
          setOrders,
          setBasket,
          setProducts,
          setIsFetching,
        }}
      >
        {children}
      </OfflineStorageDispatchContext.Provider>
    </OfflineStorageContext.Provider>
  );
};

export const useOfflineStorageContext = () => {
  const context = useContext(OfflineStorageContext);
  if (!context) {
    throw new Error(
      "useOfflineStorageContext must be used within a OfflineStorageContextProvider"
    );
  }
  return context;
};
export const useOfflineStorageDispatchContext = () => {
  const context = useContext(OfflineStorageDispatchContext);
  if (!context) {
    throw new Error(
      "useOfflineStorageDispatchContext must be used within a OfflineStorageContextProvider"
    );
  }
  return context;
};
