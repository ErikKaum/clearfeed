// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract ClearFeed is ERC721, ERC721URIStorage, ERC721Enumerable {
   
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct Parameters {
        string beta_zero;
        string beta_one;
        string beta_two;
    }
    mapping(uint256 => Parameters) public paramsByIndex;

    event Minted (address owner, uint256 tokenId);

    constructor () ERC721("Clear Feed", "CLF") {
        _tokenIdCounter.increment();
    }

    function safeMint(string memory zero, string memory one, string memory two) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        Parameters storage paramters = paramsByIndex[tokenId];
        paramters.beta_zero = zero;
        paramters.beta_one = one;
        paramters.beta_two = two;

        _safeMint(msg.sender, tokenId);
        emit Minted(msg.sender, tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {

        string memory name = "Clear Feed";
        string memory zero = paramsByIndex[tokenId].beta_zero;
        string memory one = paramsByIndex[tokenId].beta_one;
        string memory two = paramsByIndex[tokenId].beta_two;

        bytes memory dataURI = abi.encodePacked(
            '{',
                '"name": "', name,'",',
                '"description": "Your private personalized feed','",',
                '"beta_zero": "', zero,'",',
                '"beta_one": "', one,'",',  
                '"beta_two": "', two,'",',  
            '}'
        );
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
    }

    // Required by solidity to override
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function boolToUInt256(bool x) internal pure returns (uint256 r) {
        assembly { r := x }
    }


}