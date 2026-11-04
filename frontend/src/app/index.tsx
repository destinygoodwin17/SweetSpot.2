
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from "react-native";

type Recipe = {
  title: string;
  ingredients: string;
  similarity: number;
};

export default function HomeScreen() {
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [message, setMessage] = useState("");
  const [predictedCalories, setPredictedCalories] = useState<number | null>(null);

  function findDesserts() {
    setMessage("Finding desserts...");

    fetch(
      "http://192.168.1.232:8000/recommend?ingredients=" +
        encodeURIComponent(ingredients)
    )
      .then((response) => response.json())
      .then((data) => {
        setRecipes(data.recommendations);
        setMessage("");
      })
      .catch((error) => {
        console.log(error);
        setMessage("Connection failed");
      });
      
  }

 function predictCalories() {
  if (!ingredients.trim()) {
    setMessage("Please enter some ingredients first.");
    return;
  }

  setPredictedCalories(null);
  setMessage("Predicting calories...");

  fetch(
    "http://192.168.1.232:8000/predict-calories?ingredients=" +
      encodeURIComponent(ingredients)
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Prediction request failed");
      }
      return response.json();
    })
    .then((data) => {
      setPredictedCalories(data.predicted_calories);
      setMessage("");
    })
    .catch((error) => {
      console.log(error);
      setMessage("Could not predict calories.");
    });
}
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>SweetSpot 2.0</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter ingredients..."
        value={ingredients}
        onChangeText={setIngredients}
      />

      <TouchableOpacity style={styles.button} onPress={findDesserts}>
        <Text style={styles.buttonText}>Find My Dessert</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={predictCalories}>
          <Text style={styles.buttonText}>Predict Calories</Text>
      </TouchableOpacity>

{predictedCalories !== null && (
  <View style={styles.card}>
    <Text style={styles.recipeTitle}>
      Estimated Calories: {predictedCalories}
    </Text>
    <Text>Experimental estimate.</Text>
  </View>
)}

      <Text>{message}</Text>

      {recipes.map((recipe, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.recipeTitle}>{recipe.title}</Text>
          <Text>Similarity: {Math.round(recipe.similarity * 100)}%</Text>
          <Text>{recipe.ingredients}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 80,
    backgroundColor: "#FFF8F3",
    flexGrow: 1
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12
  },
  button: {
    backgroundColor: "#96535B",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20
  },
  buttonText: {
    color: "white",
    fontWeight: "bold"
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 12,
    borderRadius: 10
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5
  }
});
