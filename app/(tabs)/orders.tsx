import React, { useEffect, useState } from "react";
import { FlatList, View, StyleSheet, Text } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useOfflineStorageContext } from "@/contexts/OfflineStorageContext";
import { useAppRefresh } from "@/hooks/useAppRefresh";

const AUTH_USER_TOKEN = ""; // use your own token

export default function TabTwoScreen() {
  const { isFetching, orders } = useOfflineStorageContext();
  const { onRefresh } = useAppRefresh();

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Paid Orders</ThemedText>
      </ThemedView>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        refreshing={isFetching}
        onRefresh={onRefresh}
        renderItem={({ item }) => (
          <ThemedView style={styles.orderItem}>
            <ThemedText>{item.id}</ThemedText>
            <ThemedText>{item.created_at}</ThemedText>
            <ThemedText>{item.amount_total}$</ThemedText>
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
  orderItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  emptyListContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
