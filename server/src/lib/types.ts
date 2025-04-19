export type PartialUser = {
  id: number;
  email: string;
  password_hash: string;
  salt: string;
  role: "owner" | "renter";
  created_at: Date;
  updated_at: Date;
};

export type User = {
  id: number;
  role: "renter" | "owner";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  city: string;
  state: string;
  idCardFront: string;
  idCardBack: string;
  selfie: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface Conversation {
  id: number;
  otherUserId: number;
  name: string;
  avatar: string;
  lastMessage: string | null;
  lastSeen: Date;
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface Listing {
  id: number;
  title: string;
  model: string;
  year: number;
  pricePerDay: number;
  numOfSeats: number;
  location: string;
  licensePlate: string;
  transmissionType: "manual" | "automatic";
  fuelType: "petrol" | "diesel" | "electric" | "hybrid";
  ownerId: number;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Wallet {
  id: number;
  userId: number;
  walletAddress: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

export type Rental = {
  id: number;
  listingId: number;
  renterId: number;
  renterAddress: string;
  ownerAddress: string;
  startDate: Date;
  endDate: Date;
  rentalFee: number;
  securityDeposit: number;
  platformFee: number;
  totalEth: string;
  ownerConfirmed: boolean;
  completedByRenter: boolean;
  completedByOwner: boolean;
  isCompleted: boolean;
  createdAt: Date;
  status: "pending" | "active" | "cancelled";
  updatedAt: Date;
};
