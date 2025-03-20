import { CONTRACT_ADDRESS } from "@/constants";
import contractABI from "@/constants/CarRental.json";
import { ethers } from "ethers";

export const getContractInstance = (signer: ethers.Signer) => {
  return new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
};
