import { getDbInstance } from "../../lib/db/sqlite";
import { Violation, ViolationType, ViolationStatus } from "../../lib/types";
import { sql } from "../../utils/utils";

export async function getViolationById(id: number): Promise<Violation | null> {
  try {
    const db = getDbInstance();

    const violation = db
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
        WHERE v.id = ?
        `
      )
      .get(id) as any;

    if (!violation) {
      return null;
    }

    // Convert database result to proper Violation type
    const mappedViolation: Violation = {
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

    return mappedViolation;
  } catch (error) {
    console.error("Error getting violation by ID:", error);
    throw error;
  }
}
