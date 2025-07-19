import { getDbInstance } from "../../lib/db/sqlite";
import { Violation } from "../../lib/types";
import { sql } from "../../utils/utils";

export async function getViolationsByRentalId(
  rentalId: number
): Promise<Violation[]> {
  try {
    const db = getDbInstance();

    const violations = db
      .prepare(
        sql`
        SELECT v.*, 
               r.listing_id,
               l.title as listing_title,
               u_reporter.email as reporter_email,
               u_owner.email as owner_email,
               u_renter.email as renter_email
        FROM Violations v
        LEFT JOIN Rentals r ON v.rental_id = r.id
        LEFT JOIN Listings l ON r.listing_id = l.id
        LEFT JOIN Users u_reporter ON v.reported_by_user_id = u_reporter.id
        LEFT JOIN Users u_owner ON l.owner_id = u_owner.id
        LEFT JOIN Users u_renter ON r.renter_id = u_renter.id
        WHERE v.rental_id = ?
        ORDER BY v.created_at DESC
        `
      )
      .all(rentalId) as any[];

    // Convert database results to proper Violation types
    const mappedViolations: Violation[] = violations.map((violation) => ({
      id: violation.id,
      rentalId: violation.rental_id,
      violationType: violation.violation_type,
      expectedDamage: violation.expected_damage,
      detailedQuery: violation.detailed_query,
      photos: violation.photos ? JSON.parse(violation.photos) : undefined,
      status: violation.status,
      reportedByUserId: violation.reported_by_user_id,
      createdAt: new Date(violation.created_at),
      updatedAt: new Date(violation.updated_at),
    }));

    return mappedViolations;
  } catch (error) {
    console.error("Error getting violations by rental ID:", error);
    throw error;
  }
}
