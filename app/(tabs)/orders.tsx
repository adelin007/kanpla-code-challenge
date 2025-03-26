import React, { useEffect, useState } from "react";
import { FlatList, View, StyleSheet, Text } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useOfflineStorageContext } from "@/contexts/OfflineStorageContext";
import { useAppRefresh } from "@/hooks/useAppRefresh";
import { formatDate } from "@/utils/general";
import { OrderStatus } from "@/types/appTypes";

export default function TabTwoScreen() {
  const { isFetching, orders } = useOfflineStorageContext();
  const { onRefresh } = useAppRefresh();

  // fetch all data at first render
  useEffect(() => {
    onRefresh();
  }, [onRefresh]);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Orders</ThemedText>
      </ThemedView>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        refreshing={isFetching}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ThemedView style={styles.orderItemContainer}>
            <ThemedView style={styles.orderItem}>
              <ThemedText>Id: {item.id.slice(-4)}</ThemedText>
              <ThemedText>Date: {formatDate(item.created_at)}</ThemedText>
              <ThemedText>
                Total: {Math.round(item.amount_total * 100) / 100}$
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.orderItemStatusContainer}>
              <ThemedText
                style={[styles.orderItemStatus, getStatusStyle(item.status)]}
              >
                {item.status}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyListContainer}>
            <Text>No orders</Text>
          </View>
        )}
      />
    </ThemedView>
  );
}

const getStatusStyle = (status: OrderStatus) => {
  if (status === "pending") {
    return styles.pendingStatus;
  } else if (status === "completed") {
    return styles.completedStatus;
  } else {
    return styles.failedStatus;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  orderItemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderItem: {
    padding: 16,
    flex: 3,
  },
  orderItemStatusContainer: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    flex: 1,
  },
  orderItemStatus: {
    padding: 2,
    borderRadius: 10,
  },
  pendingStatus: {
    backgroundColor: "pink",
  },
  completedStatus: {
    backgroundColor: "#add0bb",
  },
  failedStatus: {
    backgroundColor: "#f2b0b0",
  },
  emptyListContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
