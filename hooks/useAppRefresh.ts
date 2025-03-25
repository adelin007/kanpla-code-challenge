import { useCallback, useEffect } from "react";
import { useFetchProducts } from "./useFetchProducts";

export const useAppRefresh = () => {
  const { fetchAllProducts } = useFetchProducts();

  const onRefresh = useCallback(async () => {
    await fetchAllProducts();
  }, [fetchAllProducts]);

  return {
    onRefresh,
  };
};
