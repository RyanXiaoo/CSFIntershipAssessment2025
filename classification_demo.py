
# 1. Import necessary libraries
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from sklearn import tree

def run_classification_demo():
    
    # 2. Load and explore the data
    iris = load_iris()
    X = pd.DataFrame(iris.data, columns=iris.feature_names)
    y = pd.Series(iris.target, name='species')

    print("--- Iris Dataset Classification Demo ---")
    print("\nFirst 5 rows of the dataset:")
    print(pd.concat([X, y], axis=1).head())
    print("\nDataset summary:")
    print(X.describe())
    print("\nClass distribution:")
    print(y.value_counts())

    # 3. Split the data into training and testing sets
    # We'll use 80% for training and 20% for testing, with a fixed random_state for reproducibility.
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    print(f"\nTraining set size: {X_train.shape[0]} samples")
    print(f"Test set size: {X_test.shape[0]} samples")

    # 4. Initialize and train the Decision Tree Classifier
    model = DecisionTreeClassifier(random_state=42)
    model.fit(X_train, y_train)
    print("\nDecision Tree model trained successfully.")

    # 5. Make predictions on the test set
    y_pred = model.predict(X_test)

    # 6. Evaluate the model
    # Accuracy Score
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\nModel Accuracy: {accuracy:.4f}")

    # Classification Report (Precision, Recall, F1-Score)
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=iris.target_names))

    # Confusion Matrix
    cm = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=iris.target_names, yticklabels=iris.target_names)
    plt.xlabel('Predicted Label')
    plt.ylabel('True Label')
    plt.title('Confusion Matrix')
    plt.savefig('confusion_matrix.png')
    print("\nConfusion matrix saved to confusion_matrix.png")
    # plt.show() # Commented out to run headlessly

    # 7. Visualize the Decision Tree
    plt.figure(figsize=(20,10))
    tree.plot_tree(model, 
                   feature_names=iris.feature_names,  
                   class_names=iris.target_names,
                   filled=True)
    plt.title("Decision Tree Structure")
    plt.savefig('decision_tree.png')
    print("Decision tree visualization saved to decision_tree.png")
    # plt.show() # Commented out to run headlessly

if __name__ == '__main__':
    run_classification_demo() 