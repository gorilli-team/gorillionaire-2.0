// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract EarlyGorillaNFT is ERC721, Ownable {
    error EarlyGorillaNFT__InsufficientPayment();
    error EarlyGorillaNFT__NotMinted();
    error EarlyGorillaNFT__AlreadyOwned();
    error EarlyGorillaNFT__InvalidURILength();

    string baseURI;
    uint256 public nextTokenId = 1;
    uint256 public price = 0;
    mapping(uint256 => bool) public isPremium;

    constructor(
        string memory _baseURI
    ) ERC721("Early Gorillas", "E-GOR") Ownable(msg.sender) {
        if (bytes(_baseURI).length == 0) {
            revert EarlyGorillaNFT__InvalidURILength();
        }
        baseURI = _baseURI;
    }

    function mint() public payable {
        if (balanceOf(msg.sender) > 0) {
            revert EarlyGorillaNFT__AlreadyOwned();
        }
        if (msg.value < price) {
            revert EarlyGorillaNFT__InsufficientPayment();
        }
        uint256 tokenId = nextTokenId;
        nextTokenId++;
        _safeMint(msg.sender, tokenId);
    }

    function setPrice(uint256 newPrice) public onlyOwner {
        price = newPrice;
    }

    function setBaseUri(string memory newURI) public onlyOwner {
        if (bytes(newURI).length == 0) {
            revert EarlyGorillaNFT__InvalidURILength();
        }
        baseURI = newURI;
    }

    function setPremium(bool _isPremium, uint256 tokenId) public onlyOwner {
        if (tokenId >= nextTokenId) {
            revert EarlyGorillaNFT__NotMinted();
        }
        isPremium[tokenId] = _isPremium;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        if (isPremium[tokenId]) {
            return string.concat(baseURI, "premium.json");
        } else {
            return string.concat(baseURI, "base.json");
        }
    }
}
