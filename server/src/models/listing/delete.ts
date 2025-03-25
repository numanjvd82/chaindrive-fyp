import { z } from "zod";
import { getDbInstance } from "../../lib/db/sqlite";

export const schema = z.number().int().positive();

type Input = z.infer<typeof schema>;

export const deleteListing = async (input: Input) => {
  try {
    const parseInput = schema.parse(input);
    const db = getDbInstance();

    const result = db
      .prepare("DELETE FROM Listings WHERE id = ?")
      .run(parseInput);

    if (result.changes === 0) {
      throw new Error("Unable to delete listing");
    }

    return true;
  } catch (error: any) {
    throw new Error(`Unable to delete listing ${error.message}`);
  }
};
