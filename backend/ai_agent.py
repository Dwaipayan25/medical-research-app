import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import numpy as np
import json

def load_anonymized_data(data_path="anonymized_medical_data.csv"):
    """Loads the anonymized medical data."""
    try:
        df = pd.read_csv(data_path)
        return df
    except FileNotFoundError:
        print(f"Error: Data file not found at {data_path}. Please run data_provider.py first.")
        return None

def train_local_model(local_df):
    """Trains a simple logistic regression model on local data."""
    if local_df.empty:
        return None, 0.0

    # For simplicity, let's predict 'treatment_outcome' based on 'age_group' (one-hot encoded)
    # and 'diagnosis_code' (one-hot encoded).
    # In a real scenario, features would be more robust.

    # One-hot encode categorical features
    features = ['age_group', 'diagnosis_code']
    X = pd.get_dummies(local_df[features])
    y = local_df['treatment_outcome']

    # Ensure consistent columns for all agents (important for aggregation)
    # This is a simplification; in real FL, you'd need a shared feature space.
    all_possible_age_groups = [f"{i}-{i+9}" for i in range(10, 80, 10)] # Example
    all_possible_diagnosis_codes = ["C00", "C18", "J45", "I10", "E11", "F32"]
    all_features = [f"age_group_{ag}" for ag in all_possible_age_groups] + \
                   [f"diagnosis_code_{dc}" for dc in all_possible_diagnosis_codes]

    # Reindex X to ensure all expected columns are present, filling missing with 0
    X = X.reindex(columns=all_features, fill_value=0)

    # Filter out outcomes that are not in the current local_df if necessary
    unique_outcomes = y.unique()
    if len(unique_outcomes) < 2: # Need at least two classes for classification
        print("Not enough unique outcomes in local data for classification. Skipping local training.")
        return None, 0.0

    # Filter out rows where y is not in unique_outcomes (shouldn't happen with get_dummies but good practice)
    valid_indices = y.isin(unique_outcomes)
    X = X[valid_indices]
    y = y[valid_indices]


    model = LogisticRegression(max_iter=1000, solver='liblinear') # Use liblinear for small datasets
    try:
        model.fit(X, y)
        # Calculate a simple accuracy for the local model
        accuracy = model.score(X, y) * 100
        return model, accuracy
    except ValueError as e:
        print(f"Error training local model: {e}. Data might be insufficient or ill-formed.")
        return None, 0.0


def aggregate_models(local_models):
    """Aggregates local model weights (Federated Averaging)."""
    if not local_models:
        return None

    # Filter out None models
    valid_models = [m for m in local_models if m is not None]
    if not valid_models:
        return None

    # Assuming all models have the same number of coefficients and intercept
    num_models = len(valid_models)
    avg_coef = np.mean([m.coef_ for m in valid_models], axis=0)
    avg_intercept = np.mean([m.intercept_ for m in valid_models], axis=0)

    # Create a dummy model to hold the aggregated weights
    aggregated_model = LogisticRegression(max_iter=1000, solver='liblinear')
    aggregated_model.coef_ = avg_coef
    aggregated_model.intercept_ = avg_intercept
    # Set classes_ attribute, crucial for prediction later. Assumes all models have same classes.
    aggregated_model.classes_ = valid_models[0].classes_

    return aggregated_model

def evaluate_global_model(global_model, test_df):
    """Evaluates the global model on a separate test set."""
    if global_model is None or test_df.empty:
        return 0.0

    features = ['age_group', 'diagnosis_code']
    X_test = pd.get_dummies(test_df[features])
    y_test = test_df['treatment_outcome']

    # Ensure consistent columns for evaluation
    all_possible_age_groups = [f"{i}-{i+9}" for i in range(10, 80, 10)]
    all_possible_diagnosis_codes = ["C00", "C18", "J45", "I10", "E11", "F32"]
    all_features = [f"age_group_{ag}" for ag in all_possible_age_groups] + \
                   [f"diagnosis_code_{dc}" for dc in all_possible_diagnosis_codes]
    X_test = X_test.reindex(columns=all_features, fill_value=0)

    # Filter out rows where y_test is not in global_model.classes_
    valid_indices = y_test.isin(global_model.classes_)
    X_test = X_test[valid_indices]
    y_test = y_test[valid_indices]

    if X_test.empty or y_test.empty:
        return 0.0

    accuracy = global_model.score(X_test, y_test) * 100
    return accuracy