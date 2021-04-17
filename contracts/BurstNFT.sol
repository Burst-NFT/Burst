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

    // Address that can create specific changes in the protocol (e.g., change creatorFee or trigger emergencyBurst)
    address public governance;

    // CreatorFee is the percentage of the erc20 that will go to the creator once the NFT is destroyed 
    uint256 public creatorFee;
    
    // Provides a struct to capture asset address and amount information, nft creator address, and bool of if nft exists or has been destroyed
    struct burstNftInfo {
        address[] assetAddresses;
        uint256[] assetAmounts;
        address creator;
        bool exists;
    }

    // Mapping nft indexId to above struct
    mapping(uint256 => burstNftInfo) public nftIndexToNftInfoMapping;
    
    constructor (address _governance, uint256 _creatorFee, string memory _baseURI) ERC721 ("Burst NFT", "BURST") {
        governance = _governance;
        creatorFee = _creatorFee;
        _setBaseURI(_baseURI);
    }
    
    /* ****************
     * Public Functions
     * ****************
     * */

    /**
    * @dev Public view function to get info on a Burst NFT
    *
    * */
    function getBurstNftInfo(uint256 index) public view returns(address[] memory, uint256[] memory, address, bool) {
        return (nftIndexToNftInfoMapping[index].assetAddresses,
        nftIndexToNftInfoMapping[index].assetAmounts,
        nftIndexToNftInfoMapping[index].creator, 
        nftIndexToNftInfoMapping[index].exists);
    }
    
    /**
    * @dev Public function to deposit ERC20 and mint Burst NFT
    *
    * */
    function createBurstWithMultiErc20(
        address[] calldata _tokenContracts, 
        uint256[] calldata _amounts,
        string memory _tokenURI
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
        mintBurst(_tokenURI);
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
        nftIndexToNftInfoMapping[_tokenId].exists = false;
    }

    /**
     * @dev Public function to set the Governace address for the protocol
     *
     * */
    function setGovernance(address _governance) public {
        require(msg.sender == governance, "!governance");
        governance = _governance;
    } 

    /**
     * @dev Public function to set the NFT Creator Fee for the protocol
     * Should be a number 0 through 100 that represents a percentage
     *
     * */
    function setCreatorFee(uint _creatorFee) public {
        require(msg.sender == governance, "!governance");
        creatorFee = _creatorFee;
    }

    /* ******************
     * Internal Functions
     * ******************
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
    function mintBurst(string memory _tokenURI) 
        internal
        returns (uint256)
    {
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, _tokenURI);
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