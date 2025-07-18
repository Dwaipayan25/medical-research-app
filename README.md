# 🏥 MediChainAI - Decentralized AI Medical Research Network

## Empowering Privacy-Preserving & Collaborative DeSci with AI Agents

### ✨ Vision

Medical research is often hampered by fragmented data silos and stringent privacy regulations, preventing the aggregation and analysis of diverse, large-scale datasets. Our project envisions a future where groundbreaking medical discoveries are accelerated through **decentralized, privacy-preserving, and collaborative AI research**, all while ensuring patients retain absolute ownership and granular control over their sensitive health data.

We leverage the cutting-edge **CARV ecosystem** (CARV ID, D.A.T.A. Framework, SVM Chain) to build a trustless environment where AI agents can collectively analyze anonymized medical data, fostering a new era of DeSci (Decentralized Science).

### 🚀 Features

- **Patient Data Sovereignty (CARV ID):** Patients mint unique CARV ID NFTs (ERC-721) representing their digital identity and data ownership. They can explicitly grant or revoke access to specific types of their anonymized medical data for AI agents.
- **Privacy-Preserving AI Research (Federated Learning):** Our system simulates federated learning, allowing multiple AI agents to collaboratively train on distributed, anonymized medical datasets without centralizing raw patient information.
- **On-Chain Research Results:** Aggregated research findings (e.g., global model accuracy) are immutably recorded on the blockchain via a dedicated smart contract, ensuring transparency and verifiability.
- **AI-Powered Insights (Gemini LLM):** Leveraging Google's Gemini API, the frontend provides intelligent summaries of research findings, suggests next steps for scientific inquiry, and explains complex medical terms in an accessible manner.
- **Decentralized Data Orchestration (CARV D.A.T.A. Framework - Conceptual):** The backend demonstrates the capability to interact with the CARV D.A.T.A. Framework for querying on-chain data (e.g., for DeFi risk analysis, showcasing versatility). For medical data, it conceptually uses data made available through a privacy-preserving mechanism.
- **AI Agent Orchestration (CARV SVM Chain - Conceptual):** The project conceptually integrates with the CARV SVM Chain for the autonomous execution and coordination of AI agents, ensuring a trustless and high-throughput environment for DeSci.

### 🛠️ Technical Stack

Our solution is built upon a robust blend of Web3 and AI technologies:

- **Frontend:**
    - **React.js (with Vite):** A fast and modern JavaScript library for building the interactive user interface.
    - **Tailwind CSS:** For rapid and responsive UI development.
    - **Ethers.js:** For seamless interaction with Ethereum-compatible blockchains (MetaMask connection, smart contract calls).
    - **Google Gemini API:** Integrates powerful Large Language Models for AI-driven insights and explanations.
- **Backend (Python):**
    - **`orchestrator.py`:** The central script coordinating smart contract interactions, data loading, and federated learning simulation.
    - **`ai_agent.py`:** Implements the federated learning logic (local model training, aggregation, evaluation).
    - **`data_provider.py`:** Simulates the generation and conceptual availability of anonymized medical data.
    - **`defiAgent.py`:** (Separate script) Demonstrates querying CARV D.A.T.A. Framework for DeFi insights, showcasing the framework's broader applicability.
    - **Web3.py:** Python library for interacting with Ethereum blockchains.
    - **Scikit-learn, Pandas, NumPy:** For data processing and machine learning.
    - **Requests:** For making API calls to CARV D.A.T.A. Framework.
- **Smart Contracts (Solidity):**
    - **`CarvIdNFT` (ERC-7231):** Manages patient identities and granular data access permissions.
    - **`MedicalResearchResults`:** Stores immutable records of aggregated AI research outcomes on-chain.
- **CARV Ecosystem Integration:**
    - **CARV ID (ERC-7231):** Core for decentralized identity and access control.
    - **CARV D.A.T.A. Framework:** Provides the infrastructure for querying diverse on-chain/off-chain data for AI agents.
    - **CARV SVM Chain:** The conceptual layer for autonomous AI agent execution and shared memory.

### 🏗️ Architecture Overview

The system comprises a React frontend, a Python backend (orchestrator and AI agents), and two Solidity smart contracts deployed on an Ethereum-compatible chain (e.g., Sepolia, representing the SVM Chain's settlement layer).

1. **Frontend (Patient/Researcher DApp):** Allows patients to connect their wallet, mint CARV IDs, and grant/revoke access to their anonymized data. Researchers can trigger AI research simulations and view AI-generated summaries and insights.
2. **Backend (Orchestration & AI Agents):**
    - The `orchestrator.py` manages the flow: interacting with CARV ID contract for permissions, loading simulated anonymized data, triggering federated learning, and submitting results to the `MedicalResearchResults` contract.
    - `ai_agent.py` simulates local model training and global model aggregation for federated learning.
    - `data_provider.py` generates the mock anonymized data.
    - `defiAgent.py` is a separate demonstration of querying CARV D.A.T.A. for DeFi-specific use cases.
3. **Smart Contracts:**
    - `CarvIdNFT` records ownership of patient identities and permission grants.
    - `MedicalResearchResults` serves as an immutable ledger for research outcomes.
4. **CARV Ecosystem:** Provides the underlying infrastructure for decentralized identity (CARV ID), data access (D.A.T.A. Framework), and AI agent execution (SVM Chain).
5. **Gemini API:** Powers the AI-driven insights on the frontend.

### 📜 Smart Contracts

- **`CarvIdNFT.sol` (ERC-7231)**
    - **`mint(address to, uint256 tokenId, string uri)`:** Allows patients to mint a unique CARV ID NFT.
    - **`grantAccess(uint256 tokenId, address agentAddress, bytes32 dataTypeHash)`:** Enables the CARV ID owner (patient) to grant specific AI agents access to a particular data type (hashed).
    - **`revokeAccess(uint256 tokenId, address agentAddress, bytes32 dataTypeHash)`:** Allows revoking previously granted access.
    - **`hasAccess(uint256 tokenId, address agentAddress, bytes32 dataTypeHash) view returns (bool)`:** Checks if an agent has permission for a data type.
    - **Events:** `AccessGranted`, `AccessRevoked` for transparency.
- **`MedicalResearchResults.sol`**
    - **`submitAggregatedResult(string researchTopic, bytes32 resultHash, uint256 accuracy, address agentAddress)`:** Allows authorized AI agents to submit the hash of an aggregated research model's weights and its accuracy on-chain.
    - **`getResearchResult(string researchTopic, address agentAddress) view returns (bytes32 resultHash, uint256 accuracy)`:** Retrieves submitted results.
    - **Event:** `ResearchResultSubmitted` for tracking.

### 🏁 Getting Started

### 1. Environment Setup

- **Node.js & npm/pnpm:** Ensure installed.
- **Python 3.x & pip:** Ensure installed.
- **MetaMask:** Install the browser extension and connect to the Sepolia testnet.
- **`.env` file:** Create a `.env` file in the root of your *frontend* project and populate it with:
    
    ```
    VITE_GEMINI_API_KEY=your_gemini_api_key_here
    VITE_CARV_ID_NFT_ADDRESS=0xYourCarvIdContractAddress
    VITE_MEDICAL_RESEARCH_RESULTS_ADDRESS=0xYourMedicalResearchContractAddress
    
    ```
    
    - Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    - Replace contract addresses with your deployed contract addresses on Sepolia.
- **Backend Environment Variables:** For the Python backend, set the following environment variables:
    - `SEPOLIA_RPC_URL=your_sepolia_rpc_url` (e.g., from Alchemy, Infura)
    - `PRIVATE_KEY=your_deployer_private_key` (private key of the wallet deploying contracts/acting as patient)
    - `AGENT_ADDRESS_PRIVATE_KEY=your_ai_agent_private_key` (private key for the AI agent's wallet)
    - `CARV_DATA_API_KEY=your_carv_data_api_key` (obtained from CARV)
    - You can create a `.env` file for Python and use `python-dotenv` to load them (already included in `orchestrator.py`).

### 2. Smart Contract Deployment (Conceptual)

- **Compile & Deploy:** You would typically use Hardhat or Foundry to compile and deploy `CarvIdNFT.sol` and `MedicalResearchResults.sol` to the Sepolia testnet.
- **Update Addresses:** Once deployed, update the `VITE_CARV_ID_NFT_ADDRESS` and `VITE_MEDICAL_RESEARCH_RESULTS_ADDRESS` in your frontend `.env` file and `orchestrator.py`.

### 3. Backend Setup & Run

1. **Install Python dependencies:**
    
    ```
    pip install pandas scikit-learn web3 python-dotenv requests numpy
    
    ```
    
2. **Generate Anonymized Data:**
    
    ```
    python3 data_provider.py
    
    ```
    
    This will create `anonymized_medical_data.csv` and `anonymized_data_drug_discovery_data.json`.
    
3. **Run the Orchestrator:**
    
    ```
    python3 orchestrator.py
    
    ```
    
    This script will simulate patient CARV ID minting, access granting, federated learning, and on-chain result submission. **Ensure your `SEPOLIA_RPC_URL`, `PRIVATE_KEY`, `AGENT_ADDRESS_PRIVATE_KEY` environment variables are set correctly before running.**
    
4. **Run the DeFi Agent (Optional, for demonstration of D.A.T.A. Framework querying):**
    
    ```
    python3 defiAgent.py
    
    ```
    
    This script will query the CARV D.A.T.A. Framework for DeFi data. **Ensure your `CARV_DATA_API_KEY` environment variable is set.**
    

### 4. Frontend Setup & Run

1. **Navigate to the frontend directory.**
2. **Install Node.js dependencies:**
    
    ```
    pnpm install # or npm install
    
    ```
    
3. **Start the development server:**
    
    ```
    pnpm dev # or npm run dev
    
    ```
    
    This will typically open the DApp in your browser at `http://localhost:5173` (or similar).
    

### 5. How to Use the DApp

1. **Connect Wallet:** On the `Home` page, click "Launch App" and then "Connect Wallet" (MetaMask).
2. **CARV ID Management:**
    - Go to the `CARV ID` page.
    - **Mint My CARV ID NFT:** Enter a desired token ID and click the button. This simulates a patient claiming their digital identity.
    - **Grant Data Access:** Enter your minted CARV ID, the AI Agent's wallet address (from `orchestrator.py` output), and a `Data Type` (e.g., `drug_discovery_data`). Click "Grant Access to Agent." This sets the on-chain permission for the AI agent to access your data.
3. **AI Research:**
    - Go to the `AI Research` page.
    - **Start Decentralized Research:** Click this button to simulate the AI agents performing federated learning and submitting a result on-chain. The results will appear in the "Aggregated Research Results" section.
    - **Summarize Findings / Suggest Next Steps:** Click these buttons on a research result card to get AI-powered insights from Gemini.
    - **Activate SVM Agent (Mock):** Toggle this button to conceptually show an AI agent active on the CARV SVM Chain.
    - **Medical Term Explainer:** Enter any medical term to get a simplified explanation from Gemini.

### 🔮 Future Enhancements

- **Real-time Data Fetching:** Integrate the CARV D.A.T.A. Framework directly into the Python `orchestrator.py` to fetch real-time anonymized medical data (if CARV provides such an ingestion mechanism or relevant datasets).
- **Advanced Federated Learning:** Implement more sophisticated FL algorithms and privacy-enhancing techniques (e.g., differential privacy).
- **Full SVM Chain Integration:** Deploy AI agent logic directly onto the CARV SVM Chain for true on-chain execution and verifiable computation.
- **Decentralized Storage:** Integrate with IPFS/Filecoin for decentralized storage of anonymized data, with references stored on-chain.
- **User Analytics & Dashboards:** Provide more detailed dashboards for researchers to visualize research progress and data contributions.
- **Multi-Agent Coordination:** Develop more complex scenarios involving multiple specialized AI agents collaborating on research tasks.

### 🤝 Contribution

Contributions are welcome! Please fork the repository and submit pull requests.

### 📄 License

This project is open-source and available under the MIT License.
