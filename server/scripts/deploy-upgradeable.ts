import { ethers, upgrades } from "hardhat";

async function main() {
  const CarRentalUpgradeable = await ethers.getContractFactory(
    "CarRentalUpgradeable"
  );
  console.log("Deploying CarRentalUpgradeable as an upgradeable contract...");

  const carRental = await upgrades.deployProxy(
    CarRentalUpgradeable,
    ["0x057A1424278fd7A388140CA54909f40A15945825"],
    {
      initializer: "initialize",
    }
  );

  await carRental.waitForDeployment();
  console.log(
    "CarRentalUpgradeable deployed to:",
    await carRental.getAddress()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
