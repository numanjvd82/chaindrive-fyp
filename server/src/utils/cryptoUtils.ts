import { pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";

// Hash a password
export function hashPassword(password: string): { salt: string; hash: string } {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return { salt, hash };
}

// Verify a password
export function verifyPassword(
  password: string,
  hash: string,
  salt: string
): boolean {
  const derivedHash = pbkdf2Sync(password, salt, 10000, 64, "sha512").toString(
    "hex"
  );
  return timingSafeEqual(Buffer.from(hash), Buffer.from(derivedHash));
}
