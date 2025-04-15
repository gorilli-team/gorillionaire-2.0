// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract AccessNFT is ERC721, Ownable {
    error AccessNFT__InsufficientPayment();

    uint256 public s_nextTokenId;
    uint256 public s_price = 1 ether;

    constructor()
        ERC721("Gorillionaire Access NFT", "GOR-AX")
        Ownable(msg.sender)
    {}

    function mint() public payable {
        if (msg.value < s_price) {
            revert AccessNFT__InsufficientPayment();
        }
        uint256 tokenId = s_nextTokenId;
        s_nextTokenId++;
        _safeMint(msg.sender, tokenId);
    }

    function setPrice(uint256 newPrice) public onlyOwner {
        s_price = newPrice;
    }
}
