const hre = require('hardhat');

async function main() {
  const Escrow = await hre.ethers.getContractFactory('EscrowAgency');
  const escrow = await Escrow.deploy();

  await escrow.deployed();

  console.log('EscrowAgency deployed to:', escrow.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
