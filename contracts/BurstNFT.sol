// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

/**
 * @dev This contract does the following:
 * accepts erc20 as deposit and creates erc721 mapped to deposited erc20
 * destroys erc721 and transfers mapped erc20
 * */

contract BurstNFT is IERC721Enumerable, ERC721Burnable {
    
    using SafeMath for uint256;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // CreatorFee is the percentage of the erc20 that will go to the creator once the NFT is destroyed 
    uint256 public creatorFee = 2;
    
    // Provides a struct to capture asset address and amount information, nft creator address, and bool of if nft exists or has been destroyed
    struct burstNftInfo {
        address[] assetAddresses;
        uint256[] assetAmounts;
        address creator;
        bool exists;
    }

    // Mapping nft indexId to above struct
    mapping(uint256 => burstNftInfo) public nftIndexToNftInfoMapping;

    function getBurstNftInfo(uint256 index) public view returns(address[] memory, uint256[] memory, address, bool) {
        return (nftIndexToNftInfoMapping[index].assetAddresses,
        nftIndexToNftInfoMapping[index].assetAmounts,
        nftIndexToNftInfoMapping[index].creator, 
        nftIndexToNftInfoMapping[index].exists);
    }
    
    constructor () ERC721 ("Burst NFT", "BURST") {
    }
    
    /* ****************
     * Public Functions
     * ****************
     * */
    
    /**
    * @dev Public function to deposit ERC20 and mint Burst NFT
    *
    * */
    function createBurstWithMultiErc20(
        address[] calldata _tokenContracts, 
        uint256[] calldata _amounts
    )
        public
    {
        assert(_tokenContracts.length == _amounts.length);        
        for (uint i=0; i<_tokenContracts.length; i++) {
            depositErc20(_tokenContracts[i], _amounts[i]);
        }
        nftIndexToNftInfoMapping[_tokenIds.current()].assetAddresses = _tokenContracts;
        nftIndexToNftInfoMapping[_tokenIds.current()].assetAmounts = _amounts;
        nftIndexToNftInfoMapping[_tokenIds.current()].creator = _msgSender();
        nftIndexToNftInfoMapping[_tokenIds.current()].exists = true;
        mintBurst();
    }
      
    /**
     * @dev Public function to burn Burst NFT that contains multiple erc20 and release those erc20
     *
     * */
    function destroyBurstWithMultiERC20(
        uint256 _tokenId
    )
        public
    {
        require(_isApprovedOrOwner(_msgSender(), _tokenId), "ERC721Burnable: caller is not owner nor approved");
        for (uint256 i=0; i<nftIndexToNftInfoMapping[_tokenId].assetAddresses.length; i++) {
            releaseErc20(_tokenId, nftIndexToNftInfoMapping[_tokenId].assetAddresses[i], i);
        }
        burn(_tokenId);
        nftIndexToNftInfoMapping[_tokenIds.current()].exists = false;
    }

    /* ****************
     * Internal Functions
     * ****************
     * */

    /**
    * @dev Internal function to deposit ERC20
    *
    * */
    function depositErc20(
        address _tokenContract, 
        uint256 _amount
    )
        internal
    {
        IERC20 erc;
        erc = IERC20(_tokenContract);
        uint256 al = erc.allowance(_msgSender(), address(this));
        require(al >= _amount, "Token allowance not enough");
        require(erc.transferFrom(_msgSender(), address(this), _amount),"Transfer failed");
    }

    /**
     * @dev Internal function to mint Burst NFT
     *
     * */
    function mintBurst() 
        internal
        returns (uint256)
    {
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        // _setTokenURI(newItemId, _tokenURI); //Taken out
        _tokenIds.increment();
        return newItemId;
    }
    
    /**
     * @dev Internal function to release erc20
     *
     * */
    function releaseErc20(
        uint256 _tokenId,
        address _tokenContract,
        uint256 i
    )
        internal
    {
        uint256 tokenAmount = nftIndexToNftInfoMapping[_tokenId].assetAmounts[i];
        require(tokenAmount > 0, "NFT does not hold ERC20 asset");
        uint256 creatorFeeAmount = tokenAmount.mul(creatorFee).div(100);
        _transferErc20(nftIndexToNftInfoMapping[_tokenId].creator, _tokenContract, creatorFeeAmount);
        _transferErc20(_msgSender(), _tokenContract, tokenAmount.sub(creatorFeeAmount));
    }

    /**
     * @dev Internal function to transfer ERC20 held in the contract
     *
     * */
    function _transferErc20(
        address _recipient,
        address _tokenContract,
        uint256 _returnAmount
    ) 
        internal
    {
        IERC20 erc;
        erc = IERC20(_tokenContract);
        require(
            erc.balanceOf(address(this)) >= _returnAmount,
            "Not enough funds to transfer"
        );
        erc.transfer(_recipient, _returnAmount);
    }

}