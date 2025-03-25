import React, { useEffect, useReducer, useState } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  View,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  generateId,
  getTotalPrice,
  getTotalProductPrice,
} from "@/utils/general";
import { Basket, Product } from "@/types/appTypes";
import { useCreateOrder } from "@/hooks/useCreateOrder";
import { usePayOrder } from "@/hooks/usePayOrder";

import { AntDesign } from "@expo/vector-icons";
import { useOfflineStorageContext } from "@/contexts/OfflineStorageContext";
import { useAppRefresh } from "@/hooks/useAppRefresh";

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

      return {
        ...state,
        products: productIsAlreadyInBasket
          ? [...updatedCurrentProducts]
          : [...updatedCurrentProducts, { ...action.payload, quantity: 1 }],
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
  const [orderId, setOrderId] = useState<string | null>(null);

  const { createOrder } = useCreateOrder();
  const { payOrder } = usePayOrder();

  const { isFetching, products } = useOfflineStorageContext();
  const { onRefresh } = useAppRefresh();

  const totalPrice = getTotalPrice(basket);

  const isBasketEmpty = basket?.products.length < 1;

  useEffect(() => {
    onRefresh();
  }, [onRefresh]);

  const handleOnPressCreateOrder = async () => {
    const finishedOrder = await createOrder({
      total: totalPrice,
      order_id: generateId(),
      basket_id: basket.id,
    });
    if (finishedOrder?.id) {
      setOrderId(finishedOrder.id);
    }
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
  console.log("isBasketEmpty: ", isBasketEmpty);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.productGrid}>
        <FlatList
          data={products}
          renderItem={({ item }) => {
            const productRoundedPrice = (
              item.price_unit *
              (item.vat_rate + 1)
            ).toFixed(2);
            return (
              <TouchableOpacity
                style={styles.product}
                onPress={() => dispatch({ type: "add", payload: item })}
              >
                <Text style={styles.text}>{item.name}</Text>
                <Text style={styles.text}>${productRoundedPrice}</Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.id}
          numColumns={2}
          refreshing={isFetching}
          onRefresh={onRefresh}
        />
      </ThemedView>
      <ThemedView style={styles.basket}>
        <ThemedText type="title" style={styles.text}>
          Basket
        </ThemedText>

        {basket?.products?.map((product, index) => {
          const productRoundedPrice = getTotalProductPrice(product).toFixed(2);
          return (
            <View key={index} style={styles.basketItemContainer}>
              <View key={index} style={styles.basketItem}>
                <Text style={styles.text}>{product.name}</Text>
                <Text style={styles.text}>${productRoundedPrice}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleOnPressRemoveProduct(product.id)}
                style={styles.removeButtonContainer}
              >
                <AntDesign name="close" style={styles.removeButton} />
              </TouchableOpacity>
            </View>
          );
        })}

        <ThemedText style={styles.text}>
          Total: ${totalPrice.toFixed(2)}
        </ThemedText>

        <TouchableOpacity
          style={styles.button}
          onPress={handleOnPressCreateOrder}
          disabled={isBasketEmpty}
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
  basketItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
    padding: 5,
  },
  basketItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
    padding: 5,
    borderWidth: 2,
    borderColor: "#173829",
  },
  removeButtonContainer: {
    alignContent: "center",
    justifyContent: "center",
  },
  removeButton: {
    backgroundColor: "white",
  },
  text: {
    color: "#ffffff",
    paddingHorizontal: 2,
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
