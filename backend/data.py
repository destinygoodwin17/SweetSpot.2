import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

#load and cleaning up dataset for desserts.csv 
df = pd.read_csv("data/desserts.csv")
df = df.head(5000).copy()

df["cleaned_ingredients"] = df["ingredients"].str.lower()

for number in "0123456789":
    df["cleaned_ingredients"] = df["cleaned_ingredients"].str.replace(
        number, "", regex=False
    )


for character in ['[', ']', '"', '/']:
    df["cleaned_ingredients"] = df["cleaned_ingredients"].str.replace(
        character, "", regex=False
    )


#Create the TF-IDF model
vectorizer = TfidfVectorizer()

ingredient_vectors = vectorizer.fit_transform(
    df["cleaned_ingredients"]
)

#Recommnender based on TFID 
def recommend(user_ingredients):

    user_ingredients = user_ingredients.lower().strip()

    if not user_ingredients:
        return []

    user_vector = vectorizer.transform([user_ingredients])

    similarities = cosine_similarity(user_vector, ingredient_vectors)[0]

    top_matches = similarities.argsort()[-5:][::-1]

    recommendations = []

    for index in top_matches:

        if similarities[index] <= 0:
            continue

        recipe = df.iloc[index]

        recommendations.append({
            "title": recipe["title"],
            "ingredients": recipe["ingredients"],
            "similarity": round(float(similarities[index]), 3)
        })

    return recommendations


#Model test 
if __name__ == "__main__":

    results = recommend("banana oats honey")

    for recipe in results:
        print(recipe["title"], recipe["similarity"])


