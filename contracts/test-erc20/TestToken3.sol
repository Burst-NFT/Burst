// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestToken3 is ERC20 {

    constructor(uint256 initialSupply) ERC20("Test3", "TEST3") {
        _mint(msg.sender, initialSupply);
    }

}