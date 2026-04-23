// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TrendNFT is ERC721URIStorage, ERC2981, Ownable {
    uint256 private _nextTokenId;

    constructor() ERC721("TrendNFT", "TNFT") Ownable(msg.sender) {
        // Imposta royalty di default (es. 10% = 1000 basis points)
        // L'utente ha chiesto "al massimo", OpenSea di solito limita al 10% o giù di lì, 
        // ma tecnicamente lo standard permette fino al 100%. Mettiamo 10% come standard sicuro.
        _setDefaultRoyalty(msg.sender, 1000); 
    }

    function mintNFT(address recipient, string memory tokenURI) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _mint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);
        return tokenId;
    }

    // Override necessari per ERC2981
    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
