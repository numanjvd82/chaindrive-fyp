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
