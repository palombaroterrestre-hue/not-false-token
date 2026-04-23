import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  console.log("Deployer:", wallet.address);
  
  const TrendNFT = await ethers.getContractFactory("TrendNFT");
  const trendNFT = await TrendNFT.deploy();
  await trendNFT.waitForDeployment();
  const address = await trendNFT.getAddress();
  console.log("TrendNFT deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });