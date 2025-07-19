import { z } from "zod";
import { getDbInstance } from "../../lib/db/sqlite";
import { Violation, ViolationStatus } from "../../lib/types";
import { notificationDbFunctions } from "../../services/notification";
import { sql } from "../../utils/utils";

export const updateViolationSchema = z.object({
  id: z.number(),
  status: z
    .enum([
      "pending",
      "investigating",
      "confirmed",
      "disputed",
      "resolved",
      "dismissed",
    ])
    .optional(),
  expectedDamage: z.string().optional(),
  detailedQuery: z.string().optional(),
  photos: z.array(z.string()).max(4, "Maximum 4 photos allowed").optional(),
});

export type UpdateViolationInput = z.infer<typeof updateViolationSchema>;

export async function updateViolation(
  input: UpdateViolationInput
): Promise<Violation | null> {
  const { insertNotification } = notificationDbFunctions;
  if (!input || !input.id) throw new Error("Violation ID is required");

  try {
    const parsedInput = updateViolationSchema.parse(input);
    const db = getDbInstance();

    // Build update query dynamically
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (parsedInput.status !== undefined) {
      updateFields.push("status = ?");
      updateValues.push(parsedInput.status);
    }

    if (parsedInput.expectedDamage !== undefined) {
      updateFields.push("expected_damage = ?");
      updateValues.push(parsedInput.expectedDamage);
    }

    if (parsedInput.detailedQuery !== undefined) {
      updateFields.push("detailed_query = ?");
      updateValues.push(parsedInput.detailedQuery);
    }

    if (parsedInput.photos !== undefined) {
      if (parsedInput.photos.length > 4) {
        throw new Error("Maximum 4 photos allowed");
      }
      updateFields.push("photos = ?");
      updateValues.push(JSON.stringify(parsedInput.photos));
    }

    // Always update the updated_at timestamp
    updateFields.push("updated_at = CURRENT_TIMESTAMP");

    if (updateFields.length === 1) {
      // Only updated_at field, no actual changes
      throw new Error("No fields to update");
    }

    // Update the violation
    const updateQuery = sql`
      UPDATE Violations 
      SET ${updateFields.join(", ")}
      WHERE id = ?
    `;

    updateValues.push(parsedInput.id);

    const result = db
      .prepare(
        updateQuery.replace(
          '${updateFields.join(", ")}',
          updateFields.join(", ")
        )
      )
      .run(...updateValues);

    if (result.changes === 0) {
      return null; // Violation not found
    }

    // Get the updated violation with related data
    const updatedViolation = db
      .prepare(
        sql`
        SELECT v.*, 
               r.listing_id, r.renter_id,
               l.title as listing_title, l.owner_id,
               u_reporter.email as reporter_email,
               u_owner.email as owner_email,
               u_renter.email as renter_email
        FROM Violations v
        LEFT JOIN Rentals r ON v.rental_id = r.id
        LEFT JOIN Listings l ON r.listing_id = l.id
        LEFT JOIN Users u_reporter ON v.reported_by_user_id = u_reporter.id
        LEFT JOIN Users u_owner ON l.owner_id = u_owner.id
        LEFT JOIN Users u_renter ON r.renter_id = u_renter.id
        WHERE v.id = ?
        `
      )
      .get(parsedInput.id) as any;

    if (!updatedViolation) {
      throw new Error("Failed to retrieve updated violation");
    }

    // Send notifications based on status changes
    if (parsedInput.status && updatedViolation) {
      const statusMessages: Record<ViolationStatus, string> = {
        pending: "is now pending review",
        investigating: "is being investigated",
        confirmed: "has been confirmed",
        disputed: "is under dispute",
        resolved: "has been resolved",
        dismissed: "has been dismissed",
      };

      const statusMessage = statusMessages[parsedInput.status];

      // Notify owner
      if (updatedViolation.owner_id) {
        await insertNotification({
          userId: updatedViolation.owner_id,
          message: `Violation for ${updatedViolation.listing_title} ${statusMessage}`,
          type: "violation",
          isRead: false,
        });
      }

      // Notify renter
      if (updatedViolation.renter_id) {
        await insertNotification({
          userId: updatedViolation.renter_id,
          message: `Your violation for ${updatedViolation.listing_title} ${statusMessage}`,
          type: "violation",
          isRead: false,
        });
      }
    }

    // Convert database result to proper Violation type
    const mappedViolation: Violation = {
      id: updatedViolation.id,
      rentalId: updatedViolation.rental_id,
      violationType: updatedViolation.violation_type,
      expectedDamage: updatedViolation.expected_damage,
      detailedQuery: updatedViolation.detailed_query,
      photos: updatedViolation.photos
        ? JSON.parse(updatedViolation.photos)
        : undefined,
      status: updatedViolation.status,
      reportedByUserId: updatedViolation.reported_by_user_id,
      createdAt: new Date(updatedViolation.created_at),
      updatedAt: new Date(updatedViolation.updated_at),
    };

    return mappedViolation;
  } catch (error) {
    console.error("Error updating violation:", error);
    throw error;
  }
}
