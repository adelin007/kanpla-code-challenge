import { useOfflineStorageDispatchContext } from "@/contexts/OfflineStorageContext";
import { Order } from "@/types/appTypes";
import { AUTH_USER_TOKEN } from "@/utils/constants";
import { generateId } from "@/utils/general";
import { useCallback } from "react";
import { Alert } from "react-native";

type CreateOrderParams = {
  total: number;
  basket_id: string;
};

export const useCreateOrder = () => {
  const { setIsFetching } = useOfflineStorageDispatchContext();
  const createOrder = useCallback(
    async ({ total, basket_id }: CreateOrderParams) => {
      try {
        setIsFetching(true);
        const response = await fetch(
          "https://kanpla-code-challenge.up.railway.app/orders",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-auth-user": AUTH_USER_TOKEN,
            },
            body: JSON.stringify({
              total,
              basket_id,
            }),
          }
        );
        const result: Order = await response.json();

        setIsFetching(false);
        return result;
      } catch {
        Alert.alert("Failed to create order");
      } finally {
        setIsFetching(false);
      }
    },
    []
  );

  return {
    createOrder,
  };
};
