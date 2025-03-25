import React, { useEffect, useState } from "react";
import { FlatList, View, StyleSheet, Text } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useOfflineStorageContext } from "@/contexts/OfflineStorageContext";
import { useAppRefresh } from "@/hooks/useAppRefresh";
import { formatDate } from "@/utils/general";

const AUTH_USER_TOKEN = ""; // use your own token

export default function TabTwoScreen() {
  const { isFetching, orders } = useOfflineStorageContext();
  const { onRefresh } = useAppRefresh();

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
        renderItem={({ item }) => (
          <ThemedView style={styles.orderItemContainer}>
            <ThemedView style={styles.orderItem}>
              <ThemedText>{item.id.slice(-4)}</ThemedText>
              <ThemedText>{formatDate(item.created_at)}</ThemedText>
              <ThemedText>
                {Math.round(item.amount_total * 100) / 100}$
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.orderItemStatus}>
              <ThemedText>{item.status}</ThemedText>
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
  orderItemStatus: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    flex: 1,
  },
  emptyListContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
