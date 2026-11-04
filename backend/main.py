
from fastapi import FastAPI
from data import recommend
import joblib
from pathlib import Path

app = FastAPI()

@app.get("/")
def home():
    return {"message": "SweetSpot 2.0 backend is working!"}


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

    # Convert ingredient text into numbers
    ingredients_vector = calorie_vectorizer.transform(
        [ingredients]
    )

    # Predict calories
    prediction = calorie_model.predict(
        ingredients_vector
    )[0]

    return {
        "predicted_calories": round(
            max(0, float(prediction)), 1
        )
    }