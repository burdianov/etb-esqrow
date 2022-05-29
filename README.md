## On-chain Escrow Service

![Header](/screenshots/esqrow.png)

To run the project locally, follow these steps.

1. Clone the project locally and install the dependencies:

```
git clone git@github.com:burdianov/etb-esqrow.git

# hardhat
cd etb-esqrow
npm install

# frontend
cd frontend
npm install
```

2. Start the local Hardhat node

```
npx hardhat node
```

3. While in the root directory, with the network running, deploy the contract to the local network in a separate terminal window

```
npx hardhat run scripts/deploy.js --network localhost
```

4. Copy the contract address from the terminal and assign it to the VITE_CONTRACT_ADDRESS environment variable in the .env file inside frontend directory

5. Configure .env file inside the root directory:

```
ALCHEMY_KEY=https://eth-rinkeby.alchemyapi.io/v2/your-alchemy-key
PRIVATE_KEY=your-rinkeby-private-key
```

6. Inside frontend directory, launch the project

```
npm run dev
```

### How to use the app

Note: The contract is deployed to Rinkeby network.
Address: 0xEe21CD5d318a6634f840d6F64B4dc6f2ad9DB492

1. Register as a Seller

2. Switch accounts and register as a Buyer

3. Being still in the Buyer role, create an Escrow.
