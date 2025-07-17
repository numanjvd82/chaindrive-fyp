import { ethers, upgrades } from "hardhat";

async function main() {
  const CarRentalV2 = await ethers.getContractFactory("CarRentalV2");
  console.log("Upgrading to CarRentalV2...");

  const carRental = await upgrades.upgradeProxy(
    "0xYourDeployedProxyAddress",
    CarRentalV2
  );

  console.log("CarRental upgraded to V2 at:", carRental.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
