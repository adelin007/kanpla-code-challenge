import React, { useEffect, useReducer, useState } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  generateId,
  getTotalPrice,
  getTotalProductPrice,
} from "@/utils/general";
import { Basket, Order, Product } from "@/types/appTypes";
import { useCreateOrder } from "@/hooks/useCreateOrder";
import { usePayOrder } from "@/hooks/usePayOrder";

import { AntDesign } from "@expo/vector-icons";
import {
  useOfflineStorageContext,
  useOfflineStorageDispatchContext,
} from "@/contexts/OfflineStorageContext";
import { useAppRefresh } from "@/hooks/useAppRefresh";

type BasketStateReducerAction =
  | {
      type: "add";
      payload: Product;
    }
  | {
      type: "remove";
      payload: string; // id of product to remove
    }
  | {
      type: "clear";
    };

const initialBasketState: Basket = {
  id: generateId(),
  products: [],
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
    case "clear": {
      return { ...initialBasketState };
    }
    default:
      return state;
  }
};

export default function PosScreen() {
  const [basket, dispatch] = useReducer(basketStateReducer, initialBasketState);

  const { createOrder } = useCreateOrder();
  const { payOrder } = usePayOrder();

  const { isFetching, products, currentOrder } = useOfflineStorageContext();
  const { setCurrentOrder } = useOfflineStorageDispatchContext();
  const { onRefresh } = useAppRefresh();

  const orderId = currentOrder?.id;
  const totalPrice = getTotalPrice(basket);

  const isBasketEmpty = basket?.products.length < 1;

  const canCreateOrder = !orderId && !isBasketEmpty;

  // fetch all data at first render
  useEffect(() => {
    onRefresh();
  }, [onRefresh]);

  const handleOnPressCreateOrder = async () => {
    await createOrder({
      total: totalPrice,
      basket_id: basket.id,
    });
  };
  const handleOnPressPayOrder = async () => {
    if (!orderId || !currentOrder?.amount_total) {
      Alert.alert("Could not find current order");
      return;
    }

    const finishedPayment = await payOrder({
      order_id: orderId,
      amount: currentOrder?.amount_total,
    });

    if (finishedPayment) {
      // clear basket
      dispatch({ type: "clear" });
      // clear current order
      setCurrentOrder(null);
    }
  };

  const handleOnPressRemoveProduct = (productId: string) => {
    dispatch({ type: "remove", payload: productId });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.productGrid}>
        <FlatList
          data={products}
          renderItem={({ item }) => {
            const productRoundedPrice = getTotalProductPrice(item).toFixed(2);
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
        {!isFetching ? (
          <>
            {basket?.products?.map((product, index) => {
              const productRoundedPrice =
                getTotalProductPrice(product).toFixed(2);
              return (
                <View key={index} style={styles.basketItemContainer}>
                  <TouchableOpacity
                    onPress={() => handleOnPressRemoveProduct(product.id)}
                    style={styles.removeButtonContainer}
                  >
                    <View key={index} style={styles.basketItem}>
                      <Text style={styles.text}>{product.quantity}</Text>
                      <Text style={styles.text}>{product.name}</Text>
                      <Text style={styles.text}>${productRoundedPrice}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}

            <ThemedText style={styles.text}>
              Total: ${totalPrice.toFixed(2)}
            </ThemedText>

            <TouchableOpacity
              style={[
                styles.button,
                !canCreateOrder && { backgroundColor: "#555" },
              ]}
              onPress={handleOnPressCreateOrder}
              disabled={!canCreateOrder}
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
          </>
        ) : (
          <ActivityIndicator />
        )}
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
    backgroundColor: "#add0bb",
    alignItems: "center",
  },
  basket: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ced8d2",
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
    borderRadius: 30,
    borderColor: "#add0bb",
  },
  removeButtonContainer: {
    alignContent: "center",
    justifyContent: "center",
  },
  removeButton: {
    backgroundColor: "white",
  },
  text: {
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
