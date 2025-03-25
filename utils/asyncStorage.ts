import { Basket, Order, Product } from "@/types/appTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type DataType = "products" | "orders" | "basket";

export const storeData = async (
  value: Product[] | Order[] | Basket,
  key: DataType
) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {}
};

export const getData = async (key: DataType) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {}
};
