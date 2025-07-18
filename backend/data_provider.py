import pandas as pd
import json
import hashlib
import os
import requests # For D.A.T.A. API if key is available

# --- Configuration ---
# Replace with your actual D.A.T.A. Framework API key if obtained
# CARV_DATA_API_KEY = os.getenv("CARV_DATA_API_KEY", "")
CARV_DATA_API_KEY = "a3f5fd5a-afb9-4ecd-b1fc-d2903ae517f8";
print("here is the API key:",CARV_DATA_API_KEY)
CARV_DATA_API_BASE_URL = "https://interface.carv.io/ai-agent-backend/" # From CARV docs

# --- Simulate Anonymized Medical Data ---
def generate_anonymized_data(num_records=100):
    data = []
    for i in range(num_records):
        patient_id_hash = hashlib.sha256(f"patient_{i}".encode()).hexdigest()
        age_group = f"{10 * (i % 7 + 1)}-{10 * (i % 7 + 2) - 1}" # e.g., 10-19, 20-29
        diagnosis_codes = ["C00", "C18", "J45", "I10", "E11", "F32"]
        diagnosis_code = diagnosis_codes[i % len(diagnosis_codes)]
        treatment_outcomes = ["Improved", "Stable", "Worsened"]
        treatment_outcome = treatment_outcomes[i % len(treatment_outcomes)]
        data.append({
            "patient_id_hash": patient_id_hash,
            "age_group": age_group,
            "diagnosis_code": diagnosis_code,
            "treatment_outcome": treatment_outcome
        })
    df = pd.DataFrame(data)
    df.to_csv("anonymized_medical_data.csv", index=False)
    print("Generated anonymized_medical_data.csv")
    return df

# --- Function to "make data available" via D.A.T.A. Framework API or IPFS fallback ---
def make_data_available(df, data_type="drug_discovery_data"):
    # In a real scenario, this would involve secure data bridging.
    # Here, we simulate making it available and getting a reference.

    if CARV_DATA_API_KEY:
        print(f"Attempting to make data available via CARV D.A.T.A. Framework API for {data_type}...")
        # This is a conceptual API call. You need to check CARV's specific endpoint
        # for data submission/registration. This is illustrative.
        headers = {
            "Authorization": f"Bearer {CARV_DATA_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "dataType": data_type,
            "dataContent": df.to_dict(orient='records'), # Sending as JSON for simplicity
            "metadata": {"source": "simulated_hospital_A", "anonymized": True}
        }
        try:
            response = requests.post(f"{CARV_DATA_API_BASE_URL}/data/register", headers=headers, json=payload)
            response.raise_for_status() # Raise an exception for HTTP errors
            response_data = response.json()
            data_reference = response_data.get("dataReference", "API_REFERENCE_UNKNOWN")
            print(f"Data made available via CARV D.A.T.A. API. Reference: {data_reference}")
            return data_reference
        except requests.exceptions.RequestException as e:
            print(f"Failed to use CARV D.A.T.A. API: {e}. Falling back to IPFS/local.")
            return upload_to_ipfs_or_local(df, data_type)
    else:
        print("CARV_DATA_API_KEY not set. Falling back to IPFS/local simulation.")
        return upload_to_ipfs_or_local(df, data_type)

def upload_to_ipfs_or_local(df, data_type):
    # Fallback: Simulate uploading to IPFS or just saving locally
    file_name = f"anonymized_data_{data_type}.json"
    df.to_json(file_name, orient='records', indent=4)
    print(f"Data saved locally as {file_name}. In a real scenario, this would be uploaded to IPFS.")
    # For a true IPFS upload, you'd use a library like `ipfs-http-client` or a service like Pinata API.
    # For this demo, we'll return a conceptual IPFS hash.
    conceptual_ipfs_hash = hashlib.sha256(df.to_json(orient='records').encode()).hexdigest()
    return f"ipfs://{conceptual_ipfs_hash}"

if __name__ == "__main__":
    # Generate data
    medical_df = generate_anonymized_data()
    # Make data available (conceptually)
    data_ref = make_data_available(medical_df, "drug_discovery_data")
    print(f"Data reference for AI agents: {data_ref}")