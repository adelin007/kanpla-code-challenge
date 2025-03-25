import React, { useReducer, useState } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  View,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { generateId, getTotalPrice } from "@/utils/general";
import { Basket, Product } from "@/types/appTypes";
import { useCreateOrder } from "@/hooks/useCreateOrder";
import { usePayOrder } from "@/hooks/usePayOrder";

type BasketStateReducerAction =
  | {
      type: "add";
      payload: Product;
    }
  | {
      type: "remove";
      payload: string; // id of product to remove
    };
const basketStateReducer = (
  state: Basket,
  action: BasketStateReducerAction
) => {
  switch (action.type) {
    case "add": {
      if (!action.payload) {
        return state;
      }

      const productToAddId = action.payload.id;

      const updatedCurrentProducts = state.products.map((currentProduct) => {
        if (currentProduct.id === productToAddId) {
          return { ...currentProduct, quantity: currentProduct.quantity + 1 };
        } else {
          return { ...currentProduct };
        }
      });

      const productIsAlreadyInBasket = state.products.some(
        (existingProduct) => existingProduct.id === productToAddId
      );
      // const isProductAlreadyInBasket =
      // const existingProducts = state.products
      //   .filter((currentProduct) => currentProduct.id === productToAddId)
      //   .map((product) => ({ ...product, quantity: product.quantity + 1 }));

      // state.products.map((currentProduct) => {
      //   // when product is already in basket
      //   if (productToAddId === currentProduct.id) {
      //     return { ...currentProduct, quantity: currentProduct.quantity + 1 };
      //   }
      // });

      return {
        ...state,
        products: productIsAlreadyInBasket
          ? [...updatedCurrentProducts]
          : [...updatedCurrentProducts, { ...action.payload, quantity: 1 }],
        // products: [...existingProducts, { ...action.payload, quantity: 1 }],
      };
    }
    case "remove": {
      if (!action.payload) {
        return { ...state };
      }

      return {
        ...state,
        products: state.products.filter(
          (currentProduct) => currentProduct.id !== action.payload
        ),
      };
    }
    default:
      return state;
  }
};

const mockProducts: Product[] = [
  {
    id: "1",
    name: "First",
    price_unit: 1,
    vat_rate: 1,
  },
  {
    id: "2",
    name: "Second",
    price_unit: 2,
    vat_rate: 1,
  },
];

const initialBasketState: Basket = {
  id: generateId(),
  products: [],
};
export default function PosScreen() {
  const [basket, dispatch] = useReducer(basketStateReducer, initialBasketState);
  const [products, setProducts] = useState(mockProducts);
  const [orderId, setOrderId] = useState<string | null>(null);

  const { createOrder } = useCreateOrder();
  const { payOrder } = usePayOrder();

  const totalPrice = getTotalPrice(basket);

  const handleOnPressCreateOrder = async () => {
    await createOrder({
      total: totalPrice,
      order_id: generateId(),
      basket_id: basket.id,
    });
  };
  const handleOnPressPayOrder = async () => {};

  const handleOnPressRemoveProduct = (productId: string) => {
    dispatch({ type: "remove", payload: productId });
  };
  // useEffect(() => {
  //   fetch("https://kanpla-code-challenge.up.railway.app/products", {
  //     headers: {
  //       "x-auth-user": AUTH_USER_TOKEN,
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((json) => setProducts(json))
  //     .catch((error) => console.error(error));
  // }, []);

  // const createOrder = () => {
  //   fetch("https://kanpla-code-challenge.up.railway.app/orders", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "x-auth-user": AUTH_USER_TOKEN,
  //     },
  //     body: JSON.stringify({
  //       total: basket.reduce((acc, item) => acc + item.product.price_unit, 0),
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then((json) => {
  //       setOrderId(json.id);
  //     })
  //     .catch((error) => console.error(error));
  // };

  // const payOrder = useCallback(() => {
  //   fetch(`https://kanpla-code-challenge.up.railway.app/payments`, {
  //     method: "POST",
  //     headers: {
  //       "x-auth-user": AUTH_USER_TOKEN!,
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       order_id: orderId,
  //       amount: basket.reduce((acc, item) => acc + item.product.price_unit, 0),
  //     }),
  //   })
  //     .then((response) =>
  //       response.status === 201 ? response.json() : Promise.reject(response)
  //     )
  //     .then((json) => {
  //       fetch(
  //         `https://kanpla-code-challenge.up.railway.app/orders/${json.order_id}`,
  //         {
  //           method: "PATCH",
  //           headers: {
  //             "x-auth-user": AUTH_USER_TOKEN,
  //           },
  //           body: JSON.stringify({
  //             status: "completed",
  //           }),
  //         }
  //       )
  //         .then((response) =>
  //           response.status === 201 ? response.json() : Promise.reject(response)
  //         )
  //         .then((json) => {
  //           setBasket([]);
  //           setOrderId(null);
  //         })
  //         .catch((error) => console.error(error));
  //     })
  //     .catch((error) => console.error(error));
  // }, [orderId, basket]);

  console.log("basket: ", basket);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.productGrid}>
        <FlatList
          data={products}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.product}
              onPress={() => dispatch({ type: "add", payload: item })}
            >
              <Text style={styles.text}>{item.name}</Text>
              <Text style={styles.text}>
                ${item.price_unit * item.vat_rate}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
        />
      </ThemedView>

      <ThemedView style={styles.basket}>
        <ThemedText type="title" style={styles.text}>
          Basket
        </ThemedText>

        {basket?.products?.map((item, index) => (
          <View key={index} style={styles.basketItem}>
            <TouchableOpacity
              onPress={() => handleOnPressRemoveProduct(item.id)}
            >
              <Text style={styles.text}>{item.name}</Text>
              <Text style={styles.text}>
                ${item.price_unit * item.vat_rate}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        <ThemedText style={styles.text}>Total: ${totalPrice}</ThemedText>

        <TouchableOpacity
          style={styles.button}
          onPress={handleOnPressCreateOrder}
        >
          <ThemedText style={styles.buttonText}>Create Order</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, !orderId && { backgroundColor: "#555" }]}
          onPress={handleOnPressPayOrder}
          disabled={!orderId}
        >
          <ThemedText style={styles.buttonText}>Pay</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  productGrid: {
    flex: 2,
    padding: 10,
  },
  product: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: "#1e1e1e",
    alignItems: "center",
  },
  basket: {
    flex: 1,
    padding: 10,
    backgroundColor: "#1e1e1e",
  },
  basketItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
    padding: 5,
  },
  text: {
    color: "#ffffff",
  },
  button: {
    backgroundColor: "#173829",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});
