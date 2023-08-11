import { ethers } from "hardhat";
import { expect } from "chai";

const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("exampleContract", function () {
  async function deploy() {
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

    async function printBalances() {
      const richbalanceDAIb1 = await daiToken.balanceOf(
        LOADED_DAI_HOLDER.address
      );
      console.log(
        `DAI balance of rich     : ${ethers.formatUnits(richbalanceDAIb1, 18)}`
      );

      const signerbalanceDAIb1 = await daiToken.balanceOf(signer.address);
      console.log(
        `DAI balance of signer   : ${ethers.formatUnits(
          signerbalanceDAIb1,
          18
        )}`
      );

      const contractBalanceDAIb1 = await daiToken.balanceOf(
        addrExampleContract
      );
      console.log(
        `DAI balance of contract : ${ethers.formatUnits(
          contractBalanceDAIb1,
          18
        )}`
      );

      const richbalanceWETHb1 = await wethToken.balanceOf(
        LOADED_DAI_HOLDER.address
      );
      console.log(
        `WETH balance of rich    : ${ethers.formatUnits(richbalanceWETHb1, 18)}`
      );

      const signerbalanceWETHb1 = await wethToken.balanceOf(signer.address);
      console.log(
        `WETH balance of signer  : ${ethers.formatUnits(
          signerbalanceWETHb1,
          18
        )}`
      );

      const contractBalanceWETHb1 = await wethToken.balanceOf(
        addrExampleContract
      );
      console.log(
        `WETH balance of contract: ${ethers.formatUnits(
          contractBalanceWETHb1,
          18
        )}`
      );
    }

    const exampleContract = await ethers.deployContract("SwapExamples");

    const addrExampleContract = await exampleContract.getAddress();

    console.log(
      `ExampleContract deployed to: ${await exampleContract.getAddress()}`
    );

    const [signer] = await ethers.getSigners();

    // find a DAI holder from etherscan to impersonate, as of 8/11/23 this addr is loaded:
    const ADDR_LOADED_DAI_HOLDER = "0x604749efB8DC03976D832c8353cB327C5dF09dF6";

    const LOADED_DAI_HOLDER = await ethers.getImpersonatedSigner(
      ADDR_LOADED_DAI_HOLDER
    );

    //send the DAI holder some L1 to pay for gas fees
    await signer.sendTransaction({
      to: ADDR_LOADED_DAI_HOLDER,
      value: ethers.parseEther("200"),
      gasPrice: ethers.parseUnits("5000", "gwei"),
      gasLimit: 250000,
    });

    //create instances of each token contract to read balances/approve transfers
    const daiToken = new ethers.Contract(
      DAI_ADDRESS,
      ERC20_ABI,
      LOADED_DAI_HOLDER
    );
    const wethToken = new ethers.Contract(
      WETH_ADDRESS,
      ERC20_ABI,
      LOADED_DAI_HOLDER
    );

    //the loaded DAI holder shares some with the signer and the exampleContract
    const transferAmount = ethers.parseUnits("2", 18);
    await daiToken.transfer(addrExampleContract, transferAmount);
    await daiToken.transfer(signer, transferAmount);

    console.log(
      "Initial Balances (after 'rich' DAI holder shares 2 DAI/ea with signer/contract):"
    );
    await printBalances();

    //authorize exampleContract to withdraw DAI
    const daiTokenWithSigner = daiToken.connect(signer);
    (
      await daiTokenWithSigner.approve(
        addrExampleContract,
        1000000000000000000n
      )
    ).wait();

    (await exampleContract.swapExactInputSingle(1000000000000000000n)).wait();

    console.log("After signer calls swapExactInputSingle:");
    await printBalances();

    //authorize exampleContract to withdraw another DAI
    const daiTokenWithSigner2 = daiToken.connect(signer);
    (
      await daiTokenWithSigner2.approve(
        addrExampleContract,
        1000000000000000000n
      )
    ).wait();

    (await exampleContract.swapExactInputSingle02(1000000000000000000n)).wait();

    console.log("After signer calls swapExactInputSingle02:");
    await printBalances();

    //also included an example where the contract has funds and is commanded to execute a swap
    (
      await exampleContract.swapContractFundsExactInputSingle02(
        ethers.parseUnits("1", 18)
      )
    ).wait();

    console.log(
      "After the contract is commanded to call swapContractFundsExactInputSingle02:"
    );
    await printBalances();

    return {
      signerWETHbal: await wethToken.balanceOf(signer.address),
      contractWETHbal: await wethToken.balanceOf(addrExampleContract),
    };
  }

  it("Signer and Contract should have WETH", async function () {
    const { signerWETHbal, contractWETHbal } = await loadFixture(deploy);
    expect(signerWETHbal).to.be.greaterThan(0);
    expect(contractWETHbal).to.be.greaterThan(0);
  });
});
