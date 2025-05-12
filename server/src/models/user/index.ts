import { createOne } from "./createOne";
import { findOneByEmail } from "./findOneByEmail";
import { findOneById } from "./findOneById";
import { toggleTwoFactor } from "./toggleTwoFactor";

export const userModel = {
  createOne,
  findOneByEmail,
  findOneById,
  toggleTwoFactor,
};
