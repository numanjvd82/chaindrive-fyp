export type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  salt: string;
  role: "owner" | "renter";
  created_at: Date;
  updated_at: Date;
};
