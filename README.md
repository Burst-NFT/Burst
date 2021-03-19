# Burst

![diagram](https://github.com/Burst-NFT/Burst/blob/main/Docs/Burst-NFT-Diagram.png?raw=true)

## The below is important when considering the UX

Contract currently contains two types of create & destroy functions.

- The first type uses one ERC20, meaning a user would deposit one ERC20 (e.g., DAI) to create an NFT and would receive that same ERC20 when the NFT is destroyed
  - The create function for this accepts a single address and a single uint256 as function arguments
- The second type uses multiple ERC20, meaning a user would deposit multiple ERC20 (e.g., DAI, WETH, UNI) to create an NFT and would receive those same ERC20s when the NFT is destroyed
  - The create function for this accepts an array of addresses and an array of uint256 as function arguments
