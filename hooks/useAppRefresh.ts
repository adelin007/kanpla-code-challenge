import { useCallback, useEffect } from "react";
import { useFetchProducts } from "./useFetchProducts";
import { useFetchOrders } from "./useFetchOrders";

export const useAppRefresh = () => {
  const { fetchAllProducts } = useFetchProducts();
  const { fetchOrders } = useFetchOrders();

  const onRefresh = useCallback(async () => {
    await fetchAllProducts();
    await fetchOrders();
  }, [fetchAllProducts, fetchOrders]);

  return {
    onRefresh,
  };
};
