import { z } from "zod";
import { getDbInstance } from "../../lib/db/sqlite";
import { Violation, ViolationType, ViolationStatus } from "../../lib/types";
import { notificationDbFunctions } from "../../services/notification";
import { sql } from "../../utils/utils";

export const createViolationSchema = z.object({
  rentalId: z.number(),
  violationType: z.enum([
    "late_return",
    "damage",
    "illegal_activity",
    "speeding",
    "unauthorized_location",
    "other",
  ]),
  expectedDamage: z.string().optional(),
  detailedQuery: z
    .string()
    .min(10, "Detailed query must be at least 10 characters"),
  photos: z.array(z.string()).max(4, "Maximum 4 photos allowed").optional(),
  status: z
    .enum([
      "pending",
      "investigating",
      "confirmed",
      "disputed",
      "resolved",
      "dismissed",
    ])
    .default("pending"),
  reportedByUserId: z.number().optional(),
});

export type CreateViolationInput = z.infer<typeof createViolationSchema>;

export async function createViolation(
  input: CreateViolationInput
): Promise<Violation> {
  const { insertNotification } = notificationDbFunctions;
  if (!input) throw new Error("Input is required");

  try {
    const parsedInput = createViolationSchema.parse(input);
    const db = getDbInstance();

    // Validate photos array length if provided
    if (parsedInput.photos && parsedInput.photos.length > 4) {
      throw new Error("Maximum 4 photos allowed");
    }

    // Insert violation into database
    const result = db
      .prepare(
        sql`
        INSERT INTO Violations (
          rental_id, violation_type, expected_damage, detailed_query, 
          photos, status, reported_by_user_id
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?
        )
        `
      )
      .run(
        parsedInput.rentalId,
        parsedInput.violationType,
        parsedInput.expectedDamage || null,
        parsedInput.detailedQuery,
        parsedInput.photos ? JSON.stringify(parsedInput.photos) : null,
        parsedInput.status,
        parsedInput.reportedByUserId || null
      );

    // Get the created violation
    const violation = db
      .prepare(
        sql`
        SELECT * FROM Violations WHERE id = ?
        `
      )
      .get(result.lastInsertRowid) as any;

    if (!violation) {
      throw new Error("Failed to create violation");
    }

    // Get rental details for notifications
    const rental = db
      .prepare(
        sql`
        SELECT r.*, l.title as listing_title, u.id as owner_id 
        FROM Rentals r 
        JOIN Listings l ON r.listing_id = l.id 
        JOIN Users u ON l.owner_id = u.id 
        WHERE r.id = ?
        `
      )
      .get(parsedInput.rentalId) as any;

    if (rental) {
      // Notify the owner about the violation
      await insertNotification({
        userId: rental.owner_id,
        message: `A violation (${parsedInput.violationType.replace(
          "_",
          " "
        )}) has been reported for rental of ${rental.listing_title}`,
        type: "violation",
        isRead: false,
      });

      // Notify the renter about the violation
      await insertNotification({
        userId: rental.renter_id,
        message: `You have a violation (${parsedInput.violationType.replace(
          "_",
          " "
        )}) reported for your rental of ${rental.listing_title}`,
        type: "violation",
        isRead: false,
      });
    }

    // Convert database result to proper Violation type
    const createdViolation: Violation = {
      id: violation.id,
      rentalId: violation.rental_id,
      violationType: violation.violation_type as ViolationType,
      expectedDamage: violation.expected_damage,
      detailedQuery: violation.detailed_query,
      photos: violation.photos ? JSON.parse(violation.photos) : undefined,
      status: violation.status as ViolationStatus,
      reportedByUserId: violation.reported_by_user_id,
      createdAt: new Date(violation.created_at),
      updatedAt: new Date(violation.updated_at),
    };

    return createdViolation;
  } catch (error) {
    console.error("Error creating violation:", error);
    throw error;
  }
}
