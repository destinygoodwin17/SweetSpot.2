
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

type Nutrition = {
  title: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export default function HomeScreen() {
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [message, setMessage] = useState("");
  const [predictedCalories, setPredictedCalories] = useState<number | null>(null);
  const [nutrition, setNutrition] = useState<Nutrition[]>([]);

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
function getNutrition() {
  setMessage("Loading nutrition data...");

  fetch("http://192.168.1.232:8000/nutrition")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Could not load nutrition data");
      }
      return response.json();
    })
    .then((data) => {
      setNutrition(data.nutrition);
      setMessage("");
    })
    .catch((error) => {
      console.log(error);
      setMessage("Could not load nutrition data.");
    });

    
}   let maxCalories = 1;

      for (let i = 0; i < nutrition.length; i++) {
      if (nutrition[i].calories > maxCalories) {
       maxCalories = nutrition[i].calories;
  }}




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

      <TouchableOpacity style={styles.button} onPress={getNutrition}>
        <Text style={styles.buttonText}>View Sweet Insights</Text>
      </TouchableOpacity>

{predictedCalories !== null && (
  <View style={styles.card}>
    <Text style={styles.recipeTitle}>
      Estimated Calories: {predictedCalories}
    </Text>
    <Text>Experimental estimate.</Text>
  </View>
)}

{nutrition.length > 0 && (
  <View style={styles.card}>
    <Text style={styles.recipeTitle}>Calorie Comparison</Text>

    {nutrition.map((dessert, index) => {

      const barWidth = (dessert.calories / maxCalories) * 100;

      return (
        <View key={index} style={{ marginBottom: 15 }}>
          <Text>{dessert.title}</Text>
          <Text>{dessert.calories} calories</Text>

          <View style={styles.barBackground}>
            <View
              style={[
                styles.bar,
                { width:`${barWidth}%`}
              ]}
            />
          </View>
        </View>
      );
    })}
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
  },
  barBackground: {
    backgroundColor: "#F0E0E0",
    height: 16,
    borderRadius: 8,
    marginTop: 5
  },

  bar: {
    backgroundColor: "#96535B",
    height: 16,
    borderRadius: 8
  }
});

