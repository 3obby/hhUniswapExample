# hardhat uniswap example

This is a demo of swapExactInputSingle in Hardhat with a forked version of Ethereum mainnet. In this example, we simulate a swap from the default 'signer' account from DAI to WETH. This involves a bit of setup; 'signer' is sent some DAI by a holder, then 'signer' must call the 'DAI' token's 'approve' function to allow this example contract to spend the DAI in the transaction. This test should work out of the box if you follow the instructions below:

get an api key from an rpc provider like infura or alchemy

in one terminal, fork mainnet:

```
yarn hardhat node --fork https://eth-mainnet.g.alchemy.com/v2/<your api key>
```

in another terminal, run:

```
yarn hardhat test --network localhost
```

this simulates the mainnet ethereum, deploying the example contract and executing three swaps as an example; swapExactInputSingle, swapExactInputSingle02, and swapContractFundsExactInputSingle02, the last of which simulates an external account triggering the example contract to swap its funds. A successful test should result in something similar to the following:

`  exampleContract
ExampleContract deployed to: 0xD5bFeBDce5c91413E41cc7B24C8402c59A344f7c
Initial Balances (after 'rich' DAI holder shares 2 DAI/ea with signer/contract):
DAI balance of rich     : 28222569.275428721739958856
DAI balance of signer   : 2.0
DAI balance of contract : 2.0
WETH balance of rich    : 0.0
WETH balance of signer  : 0.0
WETH balance of contract: 0.0
After signer calls swapExactInputSingle:
DAI balance of rich     : 28222569.275428721739958856
DAI balance of signer   : 1.0
DAI balance of contract : 2.0
WETH balance of rich    : 0.0
WETH balance of signer  : 0.000540786875653017
WETH balance of contract: 0.0
After signer calls swapExactInputSingle02:
DAI balance of rich     : 28222569.275428721739958856
DAI balance of signer   : 0.0
DAI balance of contract : 2.0
WETH balance of rich    : 0.0
WETH balance of signer  : 0.001081573729955222
WETH balance of contract: 0.0
After the contract is commanded to call swapContractFundsExactInputSingle02:
DAI balance of rich     : 28222569.275428721739958856
DAI balance of signer   : 0.0
DAI balance of contract : 1.0
WETH balance of rich    : 0.0
WETH balance of signer  : 0.001081573729955222
WETH balance of contract: 0.000540786832951393
    ✔ Signer and Contract should have WETH (3055ms)`
