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
    const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    const ERC20_ABI = [
      "function name() public view returns (string)",
      "function symbol() public view returns (string)",
      "function decimals() public view returns (uint8)",
      "function totalSupply() public view returns (uint256)",
      "function balanceOf(address _owner) public view returns (uint256 balance)",
      "function transfer(address _to, uint256 _value) public returns (bool success)",
      "function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)",
      "function approve(address _spender, uint256 _value) public returns (bool success)",
      "function allowance(address _owner, address _spender) public view returns (uint256 remaining)",
    ];

    const exampleContract = await ethers.deployContract("SwapExamples");

    const addrExampleContract = await exampleContract.getAddress();

    console.log(`Deployed to ${await exampleContract.getAddress()}`);

    const [signer] = await ethers.getSigners();

    // find a loaded holder on etherscan to send us some DAI
    const rich = await ethers.getImpersonatedSigner(
      "0x604749efB8DC03976D832c8353cB327C5dF09dF6"
    );

    await signer.sendTransaction({
      to: "0x604749efB8DC03976D832c8353cB327C5dF09dF6",
      value: ethers.parseEther("200"), // 0.01 Ether
      gasPrice: ethers.parseUnits("5000", "gwei"),
      gasLimit: 210000,
    });

    const daiToken = new ethers.Contract(DAI_ADDRESS, ERC20_ABI, rich);
    const wethToken = new ethers.Contract(WETH_ADDRESS, ERC20_ABI, rich);

    const transferAmount = ethers.parseUnits("2", 18);

    await daiToken.transfer(addrExampleContract, transferAmount);

    const richbalanceDAI = await daiToken.balanceOf(rich.address);
    console.log(
      `DAI balance of rich  : ${ethers.formatUnits(richbalanceDAI, 18)}`
    );

    const signerbalanceDAI = await daiToken.balanceOf(signer.address);
    console.log(
      `DAI balance of signer: ${ethers.formatUnits(signerbalanceDAI, 18)}`
    );

    const contractBalanceDAI = await daiToken.balanceOf(addrExampleContract);
    console.log(
      `DAI balance of ExampleContract: ${ethers.formatUnits(
        contractBalanceDAI,
        18
      )}`
    );

    const richbalanceWETH = await wethToken.balanceOf(rich.address);
    console.log(
      `WETH balance of rich  : ${ethers.formatUnits(richbalanceWETH, 18)}`
    );

    const signerbalanceWETH = await wethToken.balanceOf(signer.address);
    console.log(
      `WETH balance of signer: ${ethers.formatUnits(signerbalanceWETH, 18)}`
    );

    const val = await exampleContract.swapMyExactInputSingle02(
      ethers.parseUnits("1", 18)
    );

    val.wait();

    console.log(val);

    const contractBalanceWETH = await wethToken.balanceOf(addrExampleContract);
    console.log(
      `WETH balance of ExampleContract: ${ethers.formatUnits(
        contractBalanceWETH,
        18
      )}`
    );

    // await daiToken.approve(addrExampleContract, 10000000000000000n);

    // console.log(exampleContract);

    // await exampleContract.swapExactInputSingle(10000000000000000n);

    // // Get the balance of DAI for signer 0
    // const balance = await daiToken.balanceOf(signer.address);
    // console.log(`DAI balance of signer 0: ${ethers.formatUnits(balance, 18)}`);

    // return {
    //   addrExampleContract,
    //   abi: exampleContract.interface,
    // };
  }

  it("Should have a deployment address", async function () {
    // const { address, abi } =
    await loadFixture(deploy);
    // const exampleContract = new ethers.Contract(address, abi, ethers.provider);

    // Now you can interact with exampleContract as usual
    expect(1).to.equal(1);
  });
});
