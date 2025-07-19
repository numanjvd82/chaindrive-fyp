import { getDbInstance } from "../../lib/db/sqlite";
import { Violation, ViolationType, ViolationStatus } from "../../lib/types";
import { sql } from "../../utils/utils";

export interface ListViolationsQuery {
  rentalId?: number;
  violationType?: ViolationType;
  status?: ViolationStatus;
  reportedByUserId?: number;
  limit?: number;
  offset?: number;
}

export async function listViolations(query: ListViolationsQuery = {}): Promise<{
  violations: Violation[];
  total: number;
}> {
  try {
    const db = getDbInstance();
    const {
      rentalId,
      violationType,
      status,
      reportedByUserId,
      limit = 50,
      offset = 0,
    } = query;

    // Build WHERE clause dynamically
    const conditions: string[] = [];
    const params: any[] = [];

    if (rentalId !== undefined) {
      conditions.push("rental_id = ?");
      params.push(rentalId);
    }

    if (violationType !== undefined) {
      conditions.push("violation_type = ?");
      params.push(violationType);
    }

    if (status !== undefined) {
      conditions.push("status = ?");
      params.push(status);
    }

    if (reportedByUserId !== undefined) {
      conditions.push("reported_by_user_id = ?");
      params.push(reportedByUserId);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Get total count
    const countQuery = sql`
      SELECT COUNT(*) as total 
      FROM Violations 
      ${whereClause}
    `;

    const totalResult = db
      .prepare(countQuery.replace("${whereClause}", whereClause))
      .get(...params) as { total: number };
    const total = totalResult.total;

    // Get violations with pagination
    const dataQuery = sql`
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
      ${whereClause}
      ORDER BY v.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const violations = db
      .prepare(dataQuery.replace("${whereClause}", whereClause))
      .all(...params, limit, offset) as any[];

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

    return {
      violations: mappedViolations,
      total,
    };
  } catch (error) {
    console.error("Error listing violations:", error);
    throw error;
  }
}
