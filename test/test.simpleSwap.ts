import { ethers } from "hardhat";
import { Contract } from "ethers";
import { expect } from "chai";

const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("exampleContract", function () {
  async function deploy() {
    const swapRouter = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
    const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const ERC20_ABI = [
      "function balanceOf(address owner) view returns (uint256)",
    ];

    const exampleContract = await ethers.deployContract("SwapExamples", [
      swapRouter,
    ]);

    console.log(`Deployed to ${await exampleContract.getAddress()}`);
    console.log(await exampleContract.poolFee());

    await exampleContract.swapExactOutputSingle(1000000n, 10000000000000000n);

    // const [signer] = await ethers.getSigners();

    // // Create a contract instance to interact with the DAI token
    // const daiToken = new ethers.Contract(DAI_ADDRESS, ERC20_ABI, signer);

    // // Get the balance of DAI for signer 0
    // const balance = await daiToken.balanceOf(signer.address);
    // console.log(`DAI balance of signer 0: ${ethers.formatUnits(balance, 18)}`);

    return {
      address: await exampleContract.getAddress(),
      abi: exampleContract.interface,
    };
  }

  it("Should have a deployment address", async function () {
    const { address, abi } = await loadFixture(deploy);
    const exampleContract = new ethers.Contract(address, abi, ethers.provider);

    // Now you can interact with exampleContract as usual
    expect(1).to.equal(1);
  });
});
