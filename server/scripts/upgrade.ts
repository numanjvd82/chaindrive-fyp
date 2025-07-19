import { ethers, upgrades } from "hardhat";

async function main() {
  const CarRentalV2 = await ethers.getContractFactory("CarRentalUpgradeable");
  console.log("Upgrading to CarRentalV2...");

  if (!process.env.PROXY_ADDRESS) {
    throw new Error("PROXY_ADDRESS environment variable is not set.");
  }

  const carRental = await upgrades.upgradeProxy(
    process.env.PROXY_ADDRESS,
    CarRentalV2
  );

  console.log("CarRental upgraded to V2 at:", await carRental.getAddress());

  // Verify the new terms configuration
  const termsConfig = await carRental.getTermsConfig();
  console.log("Terms Configuration:");
  console.log(
    "- Late Fee Per Hour:",
    ethers.formatEther(termsConfig.lateFeePerHour),
    "ETH"
  );
  console.log(
    "- Max Late Fee Multiplier:",
    termsConfig.maxLateFeeMultiplier.toString()
  );
  console.log(
    "- Damage Assessment Period:",
    termsConfig.damageAssessmentPeriod.toString(),
    "seconds"
  );
  console.log(
    "- Violation Penalty Rate:",
    termsConfig.violationPenaltyRate.toString(),
    "%"
  );

  // Get terms and conditions
  const terms = await carRental.getTermsAndConditions();
  console.log("\nTerms and Conditions:", terms);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
