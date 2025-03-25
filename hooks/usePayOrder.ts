import { useOfflineStorageDispatchContext } from "@/contexts/OfflineStorageContext";
import { Order, Payment } from "@/types/appTypes";
import { AUTH_USER_TOKEN } from "@/utils/constants";
import { useCallback } from "react";
import { Alert } from "react-native";

type PayOrderParams = {
  order_id: string;
  amount: number;
};

export const usePayOrder = () => {
  const { setIsFetching } = useOfflineStorageDispatchContext();
  const payOrder = useCallback(async ({ order_id, amount }: PayOrderParams) => {
    try {
      setIsFetching(true);
      const paymentResponse = await fetch(
        `https://kanpla-code-challenge.up.railway.app/payments`,
        {
          method: "POST",
          headers: {
            "x-auth-user": AUTH_USER_TOKEN,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id,
            amount,
          }),
        }
      );

      const paymentResult: Payment = await paymentResponse.json();
      if (!paymentResult) {
        throw new Error("Could not fulfill payment");
      }

      const patchOrderResponse = await fetch(
        `https://kanpla-code-challenge.up.railway.app/orders/${order_id}`,
        {
          method: "PATCH",
          headers: {
            "x-auth-user": AUTH_USER_TOKEN,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "completed",
          }),
        }
      );

      const patchOrderResult: Order = await patchOrderResponse.json();

      setIsFetching(false);
      return patchOrderResult;
    } catch {
      Alert.alert("Could not execute payment");
    } finally {
      setIsFetching(false);
    }
  }, []);

  return {
    payOrder,
  };
};
