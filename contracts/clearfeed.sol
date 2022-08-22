// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

import { Verifier } from "./verifier.sol";


contract ClearFeed is ERC721, ERC721URIStorage, ERC721Enumerable {
    
    Verifier private verifier;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct Parameters {
        string beta_zero;
        string beta_one;
        string beta_two;

        string regression_beta_zero;
        string regression_beta_one;
    }
    mapping(uint256 => Parameters) public paramsByIndex;

    event Minted (address owner, uint256 tokenId);

    constructor () ERC721("Clear Feed 2", "CLF") {
        _tokenIdCounter.increment();
        verifier = new Verifier();
    }

    function safeMint(string memory zero, string memory one, string memory two) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        Parameters storage parameters = paramsByIndex[tokenId];
        parameters.beta_zero = zero;
        parameters.beta_one = one;
        parameters.beta_two = two;

        parameters.regression_beta_zero = "0";
        parameters.regression_beta_one = "0"; 

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

    function enhance(uint256 tokenId, uint[8] memory proof, uint[4] memory input, string memory beta_zero, string memory beta_one) public {
        uint[2] memory a = [proof[0], proof[1]];
        uint[2][2] memory b = [[proof[2], proof[3]], [proof[4], proof[5]]];
        uint[2] memory c = [proof[6], proof[7]];
        
        require(verifier.verifyProof(a, b, c, input), "invalid proof");

        paramsByIndex[tokenId].regression_beta_zero = beta_zero;
        paramsByIndex[tokenId].regression_beta_one = beta_one;

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