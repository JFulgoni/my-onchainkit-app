// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract MyNameIs {
    bytes32 public name;

    function setName(bytes32 newName) public {
        name = newName;
    }
}