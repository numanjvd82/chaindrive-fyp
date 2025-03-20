import hre from "hardhat";

async function main() {
  // const [deployer] = await hre.ethers.getSigners();
  // console.log("Deploying contract with:", deployer.address);

  const chaindriveWallet = "0x057A1424278fd7A388140CA54909f40A15945825";
  const CarRental = await hre.ethers.getContractFactory("CarRental");
  const contract = await CarRental.deploy(chaindriveWallet);

  await contract.waitForDeployment();
  console.log("Contract deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
