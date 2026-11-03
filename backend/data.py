
import pandas as pd




df = pd.read_csv("data/desserts.csv")

print("First recipe:")
print(df.loc[0, "title"])

print("\nIngredients:")
print(df.loc[0, "ingredients"])

print("\nModel input:")
print(df.loc[0, "input"])

print("\nModel target:")
print(df.loc[0, "target"])

print("\nDataset splits:")
print(df["split"].value_counts())
