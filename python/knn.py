from functions import readFeatureFile
from sklearn.neighbors import KNeighborsClassifier
knn = KNeighborsClassifier(n_neighbors=50, algorithm="brute", weights="distance")

x, y = readFeatureFile("../data/dataset/training.csv")

knn.fit(x, y)

x, y = readFeatureFile("../data/dataset/testing.csv")

accuracy = knn.score(x, y)
print("Accuracy: ", accuracy)