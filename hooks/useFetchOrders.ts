import { useOfflineStorageDispatchContext } from "@/contexts/OfflineStorageContext";
import { Order } from "@/types/appTypes";
import { AUTH_USER_TOKEN } from "@/utils/constants";
import { useCallback } from "react";

export const useFetchOrders = () => {
  const { setOrders, setIsFetching } = useOfflineStorageDispatchContext();
  const fetchOrders = useCallback(async () => {
    try {
      setIsFetching(true);
      const response = await fetch(
        "https://kanpla-code-challenge.up.railway.app/orders",
        {
          headers: {
            "x-auth-user": AUTH_USER_TOKEN,
          },
        }
      );
      const data: Order[] = await response.json();
      if (Array.isArray(data)) {
        setOrders(data);
      }

      setIsFetching(false);

      return data;
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsFetching(false);
    }
  }, []);

  return {
    fetchOrders,
  };
};
