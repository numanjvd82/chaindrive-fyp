import { z } from "zod";
import { getDbInstance } from "../../lib/db/sqlite";
import { Violation, ViolationType, ViolationStatus } from "../../lib/types";
import { sql } from "../../utils/utils";

export async function listViolations(userId: number): Promise<Violation[]> {
  try {
    const db = getDbInstance();

    // Get violations with related data
    const dataQuery = sql`
      SELECT v.*, 
             r.listing_id, r.renter_id,
             l.title as listing_title, l.owner_id
      FROM Violations v
      LEFT JOIN Rentals r ON v.rental_id = r.id
      LEFT JOIN Listings l ON r.listing_id = l.id
      WHERE v.reported_by_user_id = ?
      ORDER BY v.created_at DESC
    `;

    const violations = db.prepare(dataQuery).all(userId) as any[];

    // Convert database results to proper Violation types
    const mappedViolations: Violation[] = violations.map((violation) => ({
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
    }));

    return mappedViolations;
  } catch (error) {
    console.error("Error listing violations:", error);
    throw error;
  }
}
