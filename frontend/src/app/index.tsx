
import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {
  const [message, setMessage] = useState("Connecting...");

  useEffect(() => {
  fetch("http://192.168.1.232:8000")
    .then((response) => response.json())
    .then((data) => setMessage(data.message))
    .catch((error) => {
      console.log("Fetch error:", error);
      setMessage(String(error));
    });
}, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SweetSpot 2.0</Text>
      <Text>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#755239",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
