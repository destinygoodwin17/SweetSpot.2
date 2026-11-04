from fastapi import FastAPI
from data import recommend
import joblib
from pathlib import Path
import pandas as pd
app = FastAPI()

@app.get("/")
def home():
    return {"message": "SweetSpot backend is active"}


@app.get("/recommend")
def get_recommendations(ingredients: str):
    results = recommend(ingredients)
    return {"recommendations": results}

backend_folder = Path(__file__).resolve().parent

calorie_model = joblib.load(
    backend_folder / "calorie_model.joblib"
)

calorie_vectorizer = joblib.load(
    backend_folder / "calorie_vectorizer.joblib"
)

@app.get("/predict-calories")
def predict_calories(ingredients: str):

    ingredients_vector = calorie_vectorizer.transform(
         [ingredients]
    )
    prediction = calorie_model.predict(ingredients_vector)[0]

    return {"predicted_calories": round(max(0, float(prediction)),1)
    }


dessert_data = pd.read_csv("data/desserts.csv")

@app.get("/nutrition")
def get_nutrition():
    desserts = dessert_data.head(5)
    nutrition = []

    for i in range(len(desserts)):
       recipe = desserts.iloc[i]
       nutrition.append({
        "title": recipe["title"],
        "calories": float(recipe["calories"]),
        "protein": float(recipe["protein_g"]),
        "carbs": float(recipe["carbs_g"]),
        "fat": float(recipe["fat_g"])
    })

    return {"nutrition": nutrition}