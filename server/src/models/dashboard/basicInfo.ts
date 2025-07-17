import { z } from "zod";
import { getDbInstance } from "../../lib/db/sqlite";
import { sql } from "../../utils/utils";

const idSchema = z.number().int().positive();
export type GetDashboardDataInput = z.infer<typeof idSchema>;

const DASHBOARD_QUERY = sql`
SELECT 
  (SELECT COUNT(*) 
   FROM Rentals r
   JOIN Listings l ON r.listing_id = l.id
   WHERE r.status = 'active' AND l.owner_id = ?) AS activeBookings,
  (SELECT SUM(rental_fee) 
   FROM Rentals r
   JOIN Listings l ON r.listing_id = l.id
   WHERE l.owner_id = ? AND (r.status = 'completed' OR r.status = 'active')) AS totalEarnings,
  (SELECT COUNT(*) 
   FROM Listings 
   WHERE owner_id = ?) AS totalListings,
  (SELECT COUNT(*)
   FROM Rentals r
   JOIN Listings l ON r.listing_id = l.id
   WHERE r.status = 'pending' AND l.owner_id = ?) AS pendingBookings,
  (SELECT COUNT(*)
   FROM Rentals r
   JOIN Listings l ON r.listing_id = l.id
   WHERE r.status = 'completed' AND l.owner_id = ?) AS completedBookings,
  (SELECT COUNT(*)
   FROM Rentals r
   JOIN Listings l ON r.listing_id = l.id
   WHERE r.status = 'cancelled' AND l.owner_id = ?) AS cancelledBookings
`;

export async function dashboardBasicInfo(id: GetDashboardDataInput) {
  try {
    const parsedId = idSchema.parse(id);
    const dbInstance = getDbInstance();

    const dashboardData = (await dbInstance
      .prepare(DASHBOARD_QUERY)
      .get(parsedId, parsedId, parsedId, parsedId, parsedId, parsedId)) as
      | {
          activeBookings: number;
          totalEarnings: number;
          totalListings: number;
          pendingBookings: number;
          completedBookings: number;
          cancelledBookings: number;
        }
      | undefined;

    return {
      activeBookings: dashboardData?.activeBookings || 0,
      pendingBookings: dashboardData?.pendingBookings || 0,
      completedBookings: dashboardData?.completedBookings || 0,
      cancelledBookings: dashboardData?.cancelledBookings || 0,
      totalEarnings: dashboardData?.totalEarnings || 0,
      totalListings: dashboardData?.totalListings || 0,
    };
  } catch (error) {
    throw new Error("Failed to fetch dashboard data");
  }
}
