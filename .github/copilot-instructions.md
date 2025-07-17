# GitHub Copilot Instructions for ChainDrive - Car Rental Platform

## Project Overview
ChainDrive is a decentralized car rental platform built with a modern tech stack. The project consists of a React frontend client and a Node.js backend server with blockchain integration using Ethereum smart contracts.

## Architecture & Tech Stack

### Frontend (Client)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API with custom providers
- **HTTP Client**: Axios with custom instance
- **Routing**: React Router v6
- **Blockchain Integration**: Ethers.js v6
- **Real-time Communication**: Socket.io-client

### Backend (Server)
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: SQLite with direct SQL queries
- **Blockchain**: Hardhat for smart contract development
- **Smart Contracts**: Solidity (upgradeable contracts using OpenZeppelin)
- **Real-time Communication**: Socket.io
- **File Upload**: Multer
- **Authentication**: Session-based with cookies
- **Email**: Nodemailer for OTP verification

## Project Structure

```
chaindrive-fyp/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── contexts/      # React Context providers
│   │   ├── providers/     # Context providers
│   │   ├── lib/           # Utility functions and configurations
│   │   └── constants/     # Constants and type definitions
│   └── public/            # Static assets
└── server/                # Node.js backend
    ├── src/
    │   ├── controllers/   # Route handlers
    │   ├── models/        # Data models and business logic
    │   ├── routes/        # API route definitions
    │   ├── middlewares/   # Express middlewares
    │   ├── lib/           # Database and utility functions
    │   └── utils/         # Helper functions
    ├── contracts/         # Solidity smart contracts
    └── scripts/           # Deployment scripts
```

## Key Features & Functionality

### Core Features
1. **User Authentication**: Email/OTP-based authentication with role-based access (owner/renter)
2. **Car Listings**: CRUD operations for vehicle listings with image uploads
3. **Rental Management**: Booking, confirmation, and completion workflows
4. **Real-time Chat**: Socket.io-based messaging between users
5. **Blockchain Integration**: Smart contract interactions for rental agreements
6. **Device Tracking**: IoT device integration for vehicle monitoring
7. **Wallet Integration**: MetaMask wallet connection and management

### User Roles
- **Owner**: Can create listings, manage rentals, and interact with renters
- **Renter**: Can browse listings, book rentals, and communicate with owners

## Database Schema (SQLite)

### Key Tables
- `users`: User profiles and authentication data
- `listings`: Vehicle listings with details and images
- `rentals`: Rental transactions and status
- `conversations`: Chat conversations between users
- `messages`: Individual chat messages
- `devices`: IoT device tracking data
- `wallets`: User wallet addresses
- `sessions`: User session management
- `notifications`: User notifications

## API Patterns

### Request/Response Structure
- RESTful API design with proper HTTP methods
- Zod validation for request/response schemas
- Session-based authentication with cookies
- Error handling with consistent error responses

### Common Patterns
```typescript
// Model pattern
export const modelName = {
  create: createFunction,
  list: listFunction,
  getById: getByIdFunction,
  update: updateFunction,
  delete: deleteFunction,
};

// Controller pattern
export const controllerName = async (req: Request, res: Response) => {
  try {
    // Validation
    // Business logic
    // Response
  } catch (error) {
    // Error handling
  }
};
```

## Frontend Patterns

### Component Structure
- Functional components with TypeScript
- Custom hooks for data fetching and state management
- Context providers for global state
- Reusable UI components with proper prop types

### State Management
- UserContext: Authentication and user data
- WalletContext: Blockchain wallet management
- NotificationContext: Real-time notifications
- SocketContext: WebSocket connection management

### Routing Structure
- Protected routes based on authentication
- Role-based route access (owner/renter dashboards)
- Lazy loading for better performance

## Smart Contract Integration

### Contract Details
- **Name**: CarRentalUpgradeable
- **Pattern**: OpenZeppelin upgradeable contracts
- **Network**: Ethereum Sepolia testnet
- **Functionality**: Rental agreements, payments, and dispute resolution

### Integration Pattern
```typescript
// Contract connection
const contract = CarRentalUpgradeable__factory.connect(CONTRACT_ADDRESS, signer);

// Transaction pattern
const tx = await contract.functionName(params);
await tx.wait();
```

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow consistent naming conventions (camelCase for variables, PascalCase for components)
- Implement proper error handling and validation
- Use meaningful variable and function names

### File Organization
- Keep related functionality together
- Use index files for clean imports
- Separate concerns (UI, logic, data)
- Follow the established folder structure

### Database Queries
- Use prepared statements for security
- Implement proper error handling
- Use transactions for related operations
- Follow the SQL template literal pattern: `sql\`...\``

### API Development
- Validate all inputs with Zod schemas
- Use proper HTTP status codes
- Implement consistent error responses
- Add proper middleware for authentication

## Environment Configuration

### Client Environment Variables
- `VITE_SERVER_URL`: Backend server URL
- Contract addresses and blockchain configurations

### Server Environment Variables
- Database connection strings
- Email configuration for OTP
- Session secrets
- Blockchain network configurations

## Testing & Deployment

### Development Commands
```bash
# Client
npm run dev          # Start development server
npm run build        # Build for production

# Server  
npm run dev          # Start development server
npm run build        # Compile TypeScript
npx hardhat compile  # Compile smart contracts
```

## Common Patterns to Follow

1. **Error Handling**: Always wrap async operations in try-catch blocks
2. **Validation**: Use Zod schemas for all data validation
3. **Database Operations**: Use prepared statements and proper error handling
4. **Authentication**: Check user authentication in protected routes
5. **File Uploads**: Use Multer with proper file validation
6. **Real-time Updates**: Use Socket.io for live features
7. **Blockchain Integration**: Handle wallet connections and transaction states

## Important Notes

- The project uses session-based authentication, not JWT
- Database queries use direct SQL with SQLite
- Smart contracts are upgradeable using OpenZeppelin proxy pattern
- File uploads are handled with Multer and stored as base64 in database
- Real-time features use Socket.io for bidirectional communication
- The frontend uses React Context for state management, not Redux
- TypeScript is used throughout for type safety

When providing code suggestions, please:
1. Follow the existing patterns and conventions
2. Include proper TypeScript types
3. Implement appropriate error handling
4. Use the established folder structure
5. Consider security implications for authentication and data access
6. Ensure blockchain interactions are properly handled
7. Maintain consistency with the existing codebase style
