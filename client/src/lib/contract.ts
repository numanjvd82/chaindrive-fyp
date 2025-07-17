import { CONTRACT_ADDRESS } from "@/constants";
import { CarRentalUpgradeable__factory } from "@/constants/typechain-types";
import { ethers } from "ethers";

export const getContractInstance = (signer: ethers.Signer) => {
  return CarRentalUpgradeable__factory.connect(CONTRACT_ADDRESS, signer);
};
