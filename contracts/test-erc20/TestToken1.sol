// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestToken1 is ERC20 {

    constructor(uint256 initialSupply) ERC20("Test1", "TEST1") {
        _mint(msg.sender, initialSupply);
    }

}