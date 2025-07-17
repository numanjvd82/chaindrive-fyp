# Chaindrive FYP

Chaindrive FYP is a full-stack car rental platform leveraging blockchain technology and IoT devices for secure, transparent, and real-time rental experiences. The project consists of a React + TypeScript + Vite frontend and a Node.js/Express backend, with a Solidity smart contract for decentralized payment handling.

## Features

- **Car Listings:** Users can list vehicles for rent, including details like model, price, location, and images.
- **Secure Payments:** Rental payments are processed via an Ethereum smart contract (`CarRental.sol`), forwarding funds to the Chaindrive wallet.
- **User Authentication:** Sessions and user management handled securely.
- **Chat and Notifications:** Real-time messaging and notifications for renters and owners.
- **Image Uploads:** JPEG/PNG images supported for car listings.
- **IoT Integration:** Real-time location data from IoT devices allows car owners to monitor vehicle position during rentals.
- **Database:** SQLite backend with full schema for users, listings, chat, notifications, and IoT data.
- **Wallet Integration:** Connect Ethereum wallet for blockchain payments.

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Backend:** Node.js, Express, SQLite
- **Blockchain:** Solidity smart contracts, Hardhat for deployment
- **IoT:** Integration with devices to stream and store live location data
- **Other:** Socket.io (real-time features), Multer (image uploads), React Query

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/numanjvd82/chaindrive-fyp.git
   cd chaindrive-fyp
   ```

2. **Install dependencies:**
   - **Frontend:**
     ```bash
     cd client
     npm install
     ```
   - **Backend:**
     ```bash
     cd ../server
     npm install
     ```

3. **Environment Variables:**
   - Backend requires a `.env` file with:
     ```
     CLIENT_URL=http://localhost:5173
     ALCHEMY_RPC_URL=<your-alchemy-rpc-url>
     CHAINDRIVE_PRIVATE_WALLET_KEY=<private-key>
     ```
   - Frontend may require API base URL configuration.

4. **Database:**
   - SQLite database (`chaindrive.db`) is initialized automatically with all necessary tables.

5. **Smart Contract Deployment:**
   - Use Hardhat to deploy `CarRental.sol`:
     ```bash
     npx hardhat run scripts/deploy.ts --network holesky
     ```
   - Set the deployed contract address in your environment/config.

6. **IoT Device Integration:**
   - Connect and configure your IoT devices to stream vehicle location data to the backend. Ensure the server is set up to receive and store this data for real-time access by car owners.

7. **Running the Servers:**
   - **Backend:**
     ```bash
     npm run start
     ```
   - **Frontend:**
     ```bash
     npm run dev
     ```

## Usage

- Register and log in as a user.
- List your vehicle for rent or browse available rentals.
- Connect your Ethereum wallet to process payments.
- Monitor your car's real-time location during rentals via the integrated IoT devices.
- Chat with other users and receive notifications.

## License

This software is proprietary to [Numan Javed]. Unauthorized copying, modification, distribution, or use is strictly prohibited.

For usage inquiries, contact: numanjaved2001@gmail.com.

---

> For detailed developer guides, see the documentation in the `client/README.md` and review code comments for API endpoints, IoT integration, and smart contract usage.
