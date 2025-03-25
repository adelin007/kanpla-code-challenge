import { useOfflineStorageDispatchContext } from "@/contexts/OfflineStorageContext";
import { Product } from "@/types/appTypes";
import { AUTH_USER_TOKEN } from "@/utils/constants";
import { useCallback } from "react";
import { Alert } from "react-native";

export const useFetchProducts = () => {
  const { setProducts, setIsFetching } = useOfflineStorageDispatchContext();

  const fetchAllProducts = useCallback(async () => {
    try {
      setIsFetching(true);

      const response = await fetch(
        "https://kanpla-code-challenge.up.railway.app/products",
        {
          headers: {
            "x-auth-user": AUTH_USER_TOKEN,
          },
        }
      );

      const result: Product[] = await response.json();
      setIsFetching(false);
      if (result) {
        setProducts(result);
      }
      return result;
    } catch {
      Alert.alert("Cannot fetch products");
    } finally {
      setIsFetching(false);
    }
  }, []);

  const fetchProduct = useCallback(async (productId: string) => {
    try {
      setIsFetching(true);
      const response = await fetch(
        `https://kanpla-code-challenge.up.railway.app/products/${productId}`,
        {
          headers: {
            "x-auth-user": AUTH_USER_TOKEN,
          },
        }
      );

      const result: Product = await response.json();
      setIsFetching(false);
      return result;
    } catch {
      Alert.alert("Cannot fetch product");
    } finally {
      setIsFetching(false);
    }
  }, []);

  return {
    fetchAllProducts,
    fetchProduct,
  };
};
