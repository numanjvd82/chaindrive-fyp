import { z } from "zod";
import { getDbInstance } from "../../lib/db/sqlite";
import { Violation, ViolationType, ViolationStatus } from "../../lib/types";
import { sql } from "../../utils/utils";
import { rentalModel } from "../rental";
import { listingModel } from "../listing";

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

// Function to generate INSERT query dynamically
function generateInsertQuery(input: CreateViolationInput): {
  fields: string[];
  values: any[];
} {
  const fields: string[] = [];
  const values: any[] = [];

  // Required fields
  fields.push("rental_id", "violation_type", "detailed_query", "status");
  values.push(
    input.rentalId,
    input.violationType,
    input.detailedQuery,
    input.status
  );

  // Optional fields
  if (input.expectedDamage !== undefined) {
    fields.push("expected_damage");
    values.push(input.expectedDamage);
  }

  if (input.photos !== undefined && input.photos.length > 0) {
    fields.push("photos");
    values.push(JSON.stringify(input.photos));
  }

  if (input.reportedByUserId !== undefined) {
    fields.push("reported_by_user_id");
    values.push(input.reportedByUserId);
  }

  return { fields, values };
}

export async function createViolation(
  input: CreateViolationInput
): Promise<Violation> {
  if (!input) throw new Error("Input is required");

  try {
    const parsedInput = createViolationSchema.parse(input);
    const db = getDbInstance();

    // Validate photos array length if provided
    if (parsedInput.photos && parsedInput.photos.length > 4) {
      throw new Error("Maximum 4 photos allowed");
    }

    // Generate dynamic insert query, pass photos as-is
    const { fields, values } = generateInsertQuery(parsedInput);
    const placeholders = fields.map(() => "?").join(", ");

    // Insert violation into database
    const result = db
      .prepare(
        sql`
        INSERT INTO Violations (${fields.join(", ")}) 
        VALUES (${placeholders})
        `
      )
      .run(...values);

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
    const rental = await rentalModel.getbyId(violation.rental_id);

    if (!rental) {
      throw new Error("Rental not found for the violation");
    }

    const listing = await listingModel.getById(rental.listingId);

    if (!listing) {
      throw new Error("Listing not found for the violation");
    }

    if (rental) {
      // Notify the renter about the violation
      const notifcationPayload = {
        userId: rental.renterId,
        type: "violation",
        content: `A new violation has been reported for your rental of ${listing.title}. Please check your rental for details. Click here to view.`,
        link: `/rentals/${rental.id}`,
      };
      db.prepare(
        sql`
    INSERT INTO Notifications (user_id, type, content, link, rentalId, created_at)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `
      ).run(
        notifcationPayload.userId,
        notifcationPayload.type,
        notifcationPayload.content,
        notifcationPayload.link,
        rental.id
      );
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
