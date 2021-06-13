// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.9.0;

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

    event BurstCreated(
    address indexed creator,
    uint256 indexed tokenId
    );

    event BurstDestroyed(
    address indexed owner,
    uint256 indexed tokenId
    );

    /* Address that can create specific changes in the protocol (e.g., change creatorFee or trigger emergencyBurst) */
    address public governance;

    /* CreatorFee is the percentage of the erc20 that will go to the creator once the NFT is destroyed */ 
    uint256 public creatorFee;

    address public burstMarketplaceAddress;
    
    /* Provides a struct to capture asset address and amount information, nft creator address, and bool of if nft exists or has been destroyed */
    struct burstNftInfo {
        address[] assetAddresses;
        uint256[] assetAmounts;
        address payable creator;
        bool exists;
        bool isPayable;
        uint256 payableAmount;
    }

    /* Mapping nft indexId to above struct */
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
    function getBurstNftInfo(uint256 index) public view returns(address[] memory, uint256[] memory, address, bool, bool, uint256) {
        return (nftIndexToNftInfoMapping[index].assetAddresses,
        nftIndexToNftInfoMapping[index].assetAmounts,
        nftIndexToNftInfoMapping[index].creator, 
        nftIndexToNftInfoMapping[index].exists,
        nftIndexToNftInfoMapping[index].isPayable,
        nftIndexToNftInfoMapping[index].payableAmount);
    }
    
    /**
    * @dev Public function to deposit ERC20 and mint Burst NFT
    *
    * */
    function createBurst(
        address[] calldata _tokenContracts, 
        uint256[] calldata _amounts,
        string memory _tokenURI
    )
        public
        payable
    {
        require(_tokenContracts.length == _amounts.length, "Length of tokenContracts and amounts arrays are not equal");
        uint256 currentTokenId = _tokenIds.current();
        // Used to account Eth/native token deposit
        if (msg.value > 0) {
            nftIndexToNftInfoMapping[currentTokenId].isPayable = true;
            nftIndexToNftInfoMapping[currentTokenId].payableAmount = msg.value;
        }      
        for (uint i=0; i<_tokenContracts.length; i++) {
            depositErc20(_tokenContracts[i], _amounts[i]);
        }
        nftIndexToNftInfoMapping[currentTokenId].assetAddresses = _tokenContracts;
        nftIndexToNftInfoMapping[currentTokenId].assetAmounts = _amounts;
        nftIndexToNftInfoMapping[currentTokenId].creator = payable(_msgSender());
        nftIndexToNftInfoMapping[currentTokenId].exists = true;
        mintBurst(_tokenURI, currentTokenId);
    }
      
    /**
     * @dev Public function to burn Burst NFT that contains multiple erc20 and release those erc20
     *
     * */
    function destroyBurst(
        uint256 _tokenId
    )
        public
        payable
    {
        require(_isApprovedOrOwner(_msgSender(), _tokenId), "ERC721Burnable: caller is not owner nor approved");
        // Used to account Eth/native token withdraw
        if (nftIndexToNftInfoMapping[_tokenId].isPayable) {
            uint256 ethAmount = nftIndexToNftInfoMapping[_tokenId].payableAmount;
            uint256 creatorEthFeeAmount = ethAmount.mul(creatorFee).div(100);
            (bool success, ) = nftIndexToNftInfoMapping[_tokenId].creator.call{value: creatorEthFeeAmount}("");
            require(success, "Transfer failed.");
            (bool greatSuccess, ) = ownerOf(_tokenId).call{value: ethAmount.sub(creatorEthFeeAmount)}("");
            require(greatSuccess, "Transfer failed.");
        }
        for (uint256 i=0; i<nftIndexToNftInfoMapping[_tokenId].assetAddresses.length; i++) {
            releaseErc20(_tokenId, nftIndexToNftInfoMapping[_tokenId].assetAddresses[i], i);
        }
        emit BurstDestroyed(ownerOf(_tokenId), _tokenId);
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

    function setBurstMarketplaceAddress(address _burstMarketplaceAddress) public {
        require(msg.sender == governance, "!governance");
        burstMarketplaceAddress = _burstMarketplaceAddress;
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
    function mintBurst(string memory _tokenURI, uint256 _currentTokenId) 
        internal
        returns (uint256)
    {
        _safeMint(_msgSender(), _currentTokenId);
        _setTokenURI(_currentTokenId, _tokenURI);
        emit BurstCreated(_msgSender(), _currentTokenId);
        _tokenIds.increment();
        return _currentTokenId;
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
        _transferErc20(ownerOf(_tokenId), _tokenContract, tokenAmount.sub(creatorFeeAmount));
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

    /**
     * @dev Overridden from ERC721.
     */
    function transferFrom(address from, address to, uint256 tokenId) public override(ERC721, IERC721) {
        if (checkMarketOrderStatus(tokenId)) {
            (bool success,) = address(burstMarketplaceAddress).call(abi.encodeWithSignature("cancelMarketplaceOrder(uint256)", tokenId));
        require(success, "Error with marketplace contract");
        }
        super.transferFrom(from, to, tokenId);
    }

    /**
     * @dev Overridden from ERC721.
     */
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public override(ERC721, IERC721) {
        if (checkMarketOrderStatus(tokenId)) {
            (bool success,) = address(burstMarketplaceAddress).call(abi.encodeWithSignature("cancelMarketplaceOrder(uint256)", tokenId));
        require(success, "Error with marketplace contract");
        }
        super.safeTransferFrom(from, to, tokenId, _data);
    }

    function checkMarketOrderStatus(uint256 _tokenId) internal returns(bool) {
        (bool success, bytes memory result) = address(burstMarketplaceAddress).call(abi.encodeWithSignature("marketplaceOrderStatus(uint256)", _tokenId));
        require(success, "Error with marketplace contract");

        bool marketplaceOrder = abi.decode(result, (bool));

        return marketplaceOrder;
    }

}