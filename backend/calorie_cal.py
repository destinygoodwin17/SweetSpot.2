
import pandas as pd
import joblib

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import Ridge
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error


def prepare_dataset():

    df = pd.read_csv("data/desserts.csv")
 
    df = df[ (df["calories"] >= 50) &(df["calories"] <= 1500)].copy()

    X = df["ingredients"]
    y = df["calories"]

    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    return X_train, X_test, y_train, y_test

def train_model(X_train, y_train):

    vectorizer = TfidfVectorizer()
    X_train_vectors = vectorizer.fit_transform(X_train)

    model = Ridge()
    model.fit(X_train_vectors, y_train)

    return model, vectorizer


def evaluate_model(model, vectorizer, X_test, y_test):

    
    X_test_vectors = vectorizer.transform(X_test)

    predictions = model.predict(X_test_vectors)

    mae = mean_absolute_error(y_test, predictions)

    print("Ridge MAE:", round(mae, 2))

    baseline = [model.intercept_] * len(y_test)

    print("\nFirst 5 predictions:")

    for actual, predicted in zip(y_test.head(5), predictions[:5]):
        print(
            "Actual:", round(actual, 1),
            "Predicted:", round(predicted, 1)
        )


def save_model(model, vectorizer):

    joblib.dump(model, "calorie_model.joblib")
    joblib.dump(vectorizer, "calorie_vectorizer.joblib")

    print("\nModel and vectorizer saved!")


def prepare_and_train_model():

    X_train, X_test, y_train, y_test = prepare_dataset()
    model, vectorizer = train_model(X_train, y_train)
    evaluate_model(model, vectorizer, X_test, y_test)
    save_model(model, vectorizer)

    return model, vectorizer


if __name__ == "__main__":
    prepare_and_train_model()
