import pandas as pd
import json
import os
import requests
import time

# --- Configuration ---
# IMPORTANT: Replace with your actual CARV D.A.T.A. Framework API key.
# This should be obtained from CARV directly (e.g., via their Discord or developer@carv.io).
# It's highly recommended to set this as an an environment variable.
# CARV_DATA_API_KEY = os.getenv("CARV_DATA_API_KEY", "")
# Corrected: Removed trailing slash to prevent double slashes in the final URL
CARV_DATA_API_BASE_URL = "https://api.carv.io" 

# --- Function to Query CARV D.A.T.A. Framework ---
def query_carv_data(sql_query: str, api_key: str) -> dict | None:
    """
    Sends a SQL query to the CARV D.A.T.A. Framework backend and returns the result.

    Args:
        sql_query (str): The SQL query string to execute.
        api_key (str): Your CARV D.A.T.A. Framework API key.

    Returns:
        dict | None: A dictionary containing the query result (column_infos, rows)
                     or None if an error occurred.
    """
    if not api_key:
        print("Error: CARV_DATA_API_KEY is not set. Cannot query CARV D.A.T.A. API.")
        return None

    # Construct the full URL without a double slash
    query_endpoint = f"{CARV_DATA_API_BASE_URL}/sql_query"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "sql_content": sql_query
    }

    print(f"\nAttempting to query CARV D.A.T.A. API with SQL:\n{sql_query}")
    print(f"Endpoint: {query_endpoint}")

    try:
        response = requests.post(query_endpoint, headers=headers, json=payload, timeout=30)
        response.raise_for_status() # Raise an exception for HTTP errors (4xx or 5xx)

        response_data = response.json()

        if response_data.get("code") == 0 and response_data.get("msg") == "Success":
            print("Query successful!")
            return response_data.get("data")
        else:
            print(f"CARV API returned an error: {response_data.get('msg', 'Unknown error')}")
            return None

    except requests.exceptions.HTTPError as e:
        print(f"HTTP Error querying CARV API: {e.response.status_code} - {e.response.text}")
        return None
    except requests.exceptions.ConnectionError as e:
        print(f"Connection Error querying CARV API: {e}")
        return None
    except requests.exceptions.Timeout as e:
        print(f"Timeout Error querying CARV API: {e}")
        return None
    except requests.exceptions.RequestException as e:
        print(f"An unexpected Request Error occurred: {e}")
        return None
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON response from CARV API: {e}")
        print(f"Raw response: {response.text}")
        return None

# --- DeFi Research & Risk Agent Logic (Conceptual) ---
def run_defi_agent():
    """
    Simulates an AI-powered DeFi research/risk agent.
    It constructs queries, fetches data from CARV, and provides conceptual analysis.
    """
    print("--- Starting DeFi Research/Risk Agent ---")

    # --- Example 1: Get total gas used and transaction count on Ethereum yesterday ---
    # Note: CARV's documentation examples use specific dates. For "yesterday",
    # you'd dynamically generate the date. We'll use a fixed date for demonstration.
    # Replace with dynamic date generation for a real-time agent!
    yesterday_date_str = "2024-12-01" # Example date, replace with actual dynamic date
    print(f"\n--- Querying Ethereum data for {yesterday_date_str} ---")

    query_gas_and_tx_count = f"""
    SELECT
        SUM(gas_used) AS total_gas_used,
        COUNT(*) AS transaction_count
    FROM eth.transactions
    WHERE date_parse(date, '%Y-%m-%d') = date_parse('{yesterday_date_str}', '%Y-%m-%d');
    """
    gas_tx_data = query_carv_data(query_gas_and_tx_count, CARV_DATA_API_KEY)

    if gas_tx_data:
        print("\n--- Analysis: Daily Ethereum Activity ---")
        if gas_tx_data['rows']:
            total_gas = gas_tx_data['rows'][0]['items'][0]
            tx_count = gas_tx_data['rows'][0]['items'][1]
            print(f"Total Gas Used on {yesterday_date_str}: {total_gas}")
            print(f"Total Transactions on {yesterday_date_str}: {tx_count}")
            # Conceptual Risk/Research:
            if total_gas and float(total_gas) > 10000000000000000000: # Example threshold
                print("Research Insight: High gas usage, indicates significant network activity or congestion.")
            if tx_count and int(tx_count) < 500000: # Example threshold
                print("Risk Alert: Transaction count is unusually low, investigate potential network issues or reduced activity.")
        else:
            print("No data found for gas usage and transaction count.")
    else:
        print("Failed to retrieve gas usage and transaction count data.")

    time.sleep(1) # Small delay between queries

    # --- Example 2: Find top 5 most active addresses in last 7 days (Ethereum) ---
    print("\n--- Querying Top Active Ethereum Addresses (Last 7 Days) ---")
    query_top_addresses = """
    WITH address_activity AS (
        SELECT
            from_address AS address,
            COUNT(*) AS tx_count
        FROM
            eth.transactions
        WHERE date_parse(date, '%Y-%m-%d') >= date_add('day', -7, current_date)
        GROUP BY
            from_address
        UNION ALL
        SELECT
            to_address AS address,
            COUNT(*) AS tx_count
        FROM
            eth.transactions
        WHERE
            date_parse(date, '%Y-%m-%d') >= date_add('day', -7, current_date)
        GROUP BY
            to_address
    )
    SELECT
        address,
        SUM(tx_count) AS total_transactions
    FROM
        address_activity
    GROUP BY
        address
    ORDER BY
        total_transactions DESC
    LIMIT 5;
    """
    top_addresses_data = query_carv_data(query_top_addresses, CARV_DATA_API_KEY)

    if top_addresses_data:
        print("\n--- Analysis: Top Active Addresses ---")
        if top_addresses_data['rows']:
            print("Top 5 Most Active Ethereum Addresses (Last 7 Days):")
            for row in top_addresses_data['rows']:
                address = row['items'][0]
                tx_count = row['items'][1]
                print(f"- Address: {address}, Transactions: {tx_count}")
                # Conceptual Risk/Research:
                if tx_count and int(tx_count) > 10000: # Example threshold for very high activity
                    print(f"  Research Insight: {address} is a highly active address, potentially a large exchange, bot, or power user.")
                # Further analysis could involve checking if these addresses are known entities,
                # or if their activity patterns are unusual.
        else:
            print("No data found for top active addresses.")
    else:
        print("Failed to retrieve top active addresses data.")

    time.sleep(1)

    # --- Example 3: Token Transfer Analysis for a specific token (e.g., USDC on Ethereum) ---
    # This example requires a specific token address.
    # Replace with a real token address for a live agent.
    usdc_token_address = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" # Example USDC address on Ethereum
    start_date_for_token_tx = "2024-11-01" # Example start date

    print(f"\n--- Querying Token Transfer Analysis for USDC ({usdc_token_address}) from {start_date_for_token_tx} ---")
    query_token_transfers = f"""
    WITH filtered_transactions AS (
        SELECT
            token_address,
            from_address,
            to_address,
            value,
            block_timestamp
        FROM eth.token_transfers
        WHERE token_address = '{usdc_token_address}'
            AND date_parse(date, '%Y-%m-%d') >= date_parse('{start_date_for_token_tx}', '%Y-%m-%d')
    )
    SELECT
        COUNT(*) AS transaction_count,
        SUM(value) AS total_transaction_value,
        MAX(value) AS max_transaction_value,
        MIN(value) AS min_transaction_value,
        MAX_BY(from_address, value) AS max_value_from_address,
        MAX_BY(to_address, value) AS max_value_to_address
    FROM filtered_transactions;
    """
    token_transfer_data = query_carv_data(query_token_transfers, CARV_DATA_API_KEY)

    if token_transfer_data:
        print("\n--- Analysis: Token Transfer Insights ---")
        if token_transfer_data['rows']:
            row = token_transfer_data['rows'][0]['items']
            tx_count = row[0]
            total_value = row[1]
            max_value = row[2]
            min_value = row[3]
            max_value_from_address = row[4]
            max_value_to_address = row[5]

            print(f"Token: USDC ({usdc_token_address})")
            print(f"Total Transfers: {tx_count}")
            print(f"Total Value Transferred: {total_value}")
            print(f"Max Single Transfer Value: {max_value} (from {max_value_from_address} to {max_value_to_address})")
            print(f"Min Single Transfer Value: {min_value}")

            # Conceptual Risk/Research:
            if tx_count and int(tx_count) == 0:
                print("Research Insight: No token transfers found for this period. Verify token address or date range.")
            if max_value and float(max_value) > 1000000: # Example threshold for large transfers
                print(f"Risk Alert: Very large single transfer detected ({max_value}). Investigate source and destination for unusual activity (e.g., potential whale movements, bridge exploits).")
        else:
            print("No token transfer data found for the specified token and period.")
    else:
        print("Failed to retrieve token transfer data.")

    print("\n--- DeFi Research/Risk Agent Finished ---")

if __name__ == "__main__":
    if not CARV_DATA_API_KEY:
        print("\nWARNING: CARV_DATA_API_KEY environment variable is not set.")
        print("Please set it before running the script to query the CARV D.A.T.A. API.")
        print("Falling back to conceptual output for demonstration purposes.")
        # You might want to add mock data generation here if you want to run without API key
        # For now, it will just print the warning and attempt to call the API, which will fail.
    
    run_defi_agent()
