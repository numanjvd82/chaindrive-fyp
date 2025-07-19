import { getDbInstance } from "../../lib/db/sqlite";
import { Violation } from "../../lib/types";
import { sql } from "../../utils/utils";

export const getViolationsByRentalId = (rentalId: number): Violation => {
  if (!rentalId) {
    throw new Error("Rental ID is required");
  }
  const db = getDbInstance();
  const query = sql`
    SELECT 
      v.*,
      renter.name as renter_name,
      owner.name as owner_name,
      l.title as listing_title,
      l.model as listing_model
    FROM violations v
    LEFT JOIN rentals r ON v.rental_id = r.id
    LEFT JOIN users renter ON r.renter_id = renter.id
    LEFT JOIN listings l ON r.listing_id = l.id
    LEFT JOIN users owner ON l.user_id = owner.id
    WHERE v.rental_id = ?
    ORDER BY v.created_at DESC
  `;

  return (
    (db
      .prepare(query)
      .all(rentalId)
      .map((violation: any) => ({
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
      }))[0] as Violation) || null
  );
};
