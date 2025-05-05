export type PartialUser = {
  id: number;
  email: string;
  password_hash: string;
  salt: string;
  twoFactorEnabled: boolean;
  isVerified: boolean;
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
  twoFactorEnabled: boolean;
  state: string;
  idCardFront: string;
  idCardBack: string;
  selfie: string;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
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
  status: "pending" | "active" | "cancelled" | "completed";
  updatedAt: Date;
};

export type Device = {
  id: number;
  deviceId: string;
  listingId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Location = {
  id: number;
  deviceId: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
};
