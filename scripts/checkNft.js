import pkg from "hardhat";
const { ethers } = pkg;
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  console.log("Deploying with:", wallet.address);
  console.log("Network chainId:", (await provider.getNetwork()).chainId);
  
  const TrendNFT = await ethers.getContractFactory("TrendNFT");
  const contract = await TrendNFT.connect(wallet).deploy();
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  
  console.log("Deployed to:", address);
  
  const code = await provider.getCode(address);
  console.log("Code length:", code.length);
  
  if (code.length > 2) {
    console.log("Contract verified!");
    console.log("Update .env CONTRACT_ADDRESS to:", address);
  } else {
    console.log("ERROR: Contract not deployed!");
  }
}

main().catch(console.error);