import pandas as pd
from web3 import Web3
import json
import os
import time
import hashlib
from ai_agent import load_anonymized_data, train_local_model, aggregate_models, evaluate_global_model

# --- Web3 Configuration ---
# Load environment variables
from dotenv import load_dotenv
load_dotenv()

SEPOLIA_RPC_URL = os.getenv("SEPOLIA_RPC_URL")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
AGENT_ADDRESS_PRIVATE_KEY = os.getenv("AGENT_ADDRESS_PRIVATE_KEY") # Separate key for the AI agent wallet

if not SEPOLIA_RPC_URL or not PRIVATE_KEY or not AGENT_ADDRESS_PRIVATE_KEY:
    print("Error: Please set SEPOLIA_RPC_URL, PRIVATE_KEY, and AGENT_ADDRESS_PRIVATE_KEY in your .env file.")
    exit()

w3 = Web3(Web3.HTTPProvider(SEPOLIA_RPC_URL))
if not w3.is_connected():
    print("Error: Not connected to Sepolia RPC. Check your SEPOLIA_RPC_URL.")
    exit()

# --- Contract ABIs and Addresses (Replace with your deployed values) ---
CARV_ID_NFT_ADDRESS = "YOUR_CARV_ID_NFT_CONTRACT_ADDRESS"
MEDICAL_RESEARCH_RESULTS_ADDRESS = "YOUR_MEDICAL_RESEARCH_RESULTS_CONTRACT_ADDRESS"

# Load ABIs (assuming you have them as JSON files from Hardhat artifacts)
# You'll need to copy these from your Hardhat project's artifacts folder
# e.g., artifacts/contracts/CarvIdNFT.sol/CarvIdNFT.json
with open("CarvIdNFT.json", "r") as f:
    CARV_ID_NFT_ABI = json.load(f)["abi"]

with open("MedicalResearchResults.json", "r") as f:
    MEDICAL_RESEARCH_RESULTS_ABI = json.load(f)["abi"]

carv_id_contract = w3.eth.contract(address=CARV_ID_NFT_ADDRESS, abi=CARV_ID_NFT_ABI)
research_results_contract = w3.eth.contract(address=MEDICAL_RESEARCH_RESULTS_ADDRESS, abi=MEDICAL_RESEARCH_RESULTS_ABI)

# --- Wallet Setup ---
# Wallet used for deploying and general interactions (e.g., patient actions)
deployer_account = w3.eth.account.from_key(PRIVATE_KEY)
print(f"Deployer Account: {deployer_account.address}")

# Wallet representing an AI agent that will submit results
ai_agent_account = w3.eth.account.from_key(AGENT_ADDRESS_PRIVATE_KEY)
print(f"AI Agent Account: {ai_agent_account.address}")


# --- Blockchain Interaction Functions ---
def send_transaction(contract_function, sender_account, *args):
    """Helper to send a transaction and wait for receipt."""
    try:
        nonce = w3.eth.get_transaction_count(sender_account.address)
        transaction = contract_function(*args).build_transaction({
            'chainId': w3.eth.chain_id,
            'gas': 2000000, # Adjust gas limit as needed
            'maxFeePerGas': w3.eth.gas_price * 2, # Example, adjust based on network conditions
            'maxPriorityFeePerGas': w3.to_wei('1', 'gwei'), # Example
            'nonce': nonce,
        })
        signed_txn = w3.eth.account.sign_transaction(transaction, private_key=sender_account.key)
        tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
        print(f"Transaction sent: {tx_hash.hex()}")
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        print(f"Transaction confirmed in block {receipt.blockNumber}")
        if receipt.status == 0:
            raise Exception("Transaction failed!")
        return receipt
    except Exception as e:
        print(f"Transaction failed: {e}")
        return None

def mint_carv_id(to_address, token_id, uri):
    print(f"Minting CARV ID {token_id} for {to_address}...")
    return send_transaction(carv_id_contract.functions.mint, deployer_account, to_address, token_id, uri)

def grant_access(token_id, agent_address, data_type_hash):
    print(f"Granting access for CARV ID {token_id} to agent {agent_address} for data type hash {data_type_hash.hex()}...")
    # The owner of the NFT (the patient) grants access.
    # For demo, we use deployer_account as the patient's wallet.
    return send_transaction(carv_id_contract.functions.grantAccess, deployer_account, token_id, agent_address, data_type_hash)

def has_access(token_id, agent_address, data_type_hash):
    print(f"Checking access for CARV ID {token_id} to agent {agent_address} for data type hash {data_type_hash.hex()}...")
    return carv_id_contract.functions.hasAccess(token_id, agent_address, data_type_hash).call()

def submit_research_result(research_topic, result_hash, accuracy, agent_address):
    print(f"Submitting research result for topic '{research_topic}' with accuracy {accuracy}% from agent {agent_address}...")
    return send_transaction(research_results_contract.functions.submitAggregatedResult, ai_agent_account, research_topic, result_hash, accuracy, agent_address)

# --- Main Orchestration Logic ---
def run_decentralized_research():
    print("\n--- Starting Decentralized AI Medical Research Orchestration ---")

    # 1. Simulate Patient Registration and Access Granting
    patient_id_token = 101 # Example patient CARV ID
    patient_address = deployer_account.address # Patient wallet
    agent_address = ai_agent_account.address # AI Agent wallet
    data_type_str = "drug_discovery_data"
    data_type_hash = w3.keccak(text=data_type_str)

    # Mint CARV ID for the patient
    if not carv_id_contract.functions.ownerOf(patient_id_token).call() == patient_address:
        mint_carv_id(patient_address, patient_id_token, f"https://example.com/carv-id/{patient_id_token}")
        time.sleep(5) # Wait for tx to confirm
    else:
        print(f"CARV ID {patient_id_token} already owned by {patient_address}")

    # Patient grants access to the AI agent
    if not has_access(patient_id_token, agent_address, data_type_hash):
        grant_access(patient_id_token, agent_address, data_type_hash)
        time.sleep(5) # Wait for tx to confirm
    else:
        print(f"Access already granted for CARV ID {patient_id_token} to agent {agent_address} for {data_type_str}")


    # 2. AI Agent Checks Permissions and Fetches Data
    print(f"\nAI Agent ({agent_address}) checking permissions...")
    if has_access(patient_id_token, agent_address, data_type_hash):
        print(f"AI Agent has permission to access '{data_type_str}' data for CARV ID {patient_id_token}.")

        # Conceptual Data Fetch (from data_provider.py's output or IPFS)
        # In a real system, the agent would query D.A.T.A. Framework API here.
        # For this demo, we'll assume the data is locally available from data_provider.py
        print("AI Agent conceptually fetching anonymized medical data...")
        anonymized_df = load_anonymized_data()
        if anonymized_df is None:
            print("Failed to load anonymized data. Exiting.")
            return

        # 3. Perform Privacy-Preserving AI (Federated Learning Simulation)
        print("\nPerforming Federated Learning simulation...")
        num_agents = 3 # Simulate 3 collaborating AI agents/data sources
        local_data_splits = np.array_split(anonymized_df, num_agents)

        local_models = []
        local_accuracies = []
        for i, local_df in enumerate(local_data_splits):
            print(f"  - Agent {i+1} training on local data (size: {len(local_df)})...")
            model, acc = train_local_model(local_df)
            local_models.append(model)
            local_accuracies.append(acc)
            print(f"    Local accuracy: {acc:.2f}%")

        global_model = aggregate_models(local_models)
        if global_model:
            # Evaluate global model on a small test set (e.g., first 10% of original data)
            train_df, test_df = train_test_split(anonymized_df, test_size=0.1, random_state=42)
            global_accuracy = evaluate_global_model(global_model, test_df)
            print(f"\nFederated Learning complete. Global Model Accuracy: {global_accuracy:.2f}%")

            # 4. AI Agent Submits Aggregated Result On-Chain
            research_topic = "Drug Discovery - Disease X Prediction"
            # Hash of the aggregated model weights (conceptual)
            model_weights_hash = w3.keccak(text=json.dumps({"coef": global_model.coef_.tolist(), "intercept": global_model.intercept_.tolist()}))

            submit_research_result(research_topic, model_weights_hash, int(global_accuracy), agent_address)
            print("\nOrchestration complete. Check Sepolia Etherscan for transactions and contract states.")
        else:
            print("Global model could not be aggregated due to issues with local models.")

    else:
        print(f"AI Agent does NOT have permission to access '{data_type_str}' data for CARV ID {patient_id_token}.")
        print("Please ensure the patient has granted access via the frontend.")

if __name__ == "__main__":
    # First, run data_provider.py to generate data
    # Then, run this orchestrator.py
    run_decentralized_research()