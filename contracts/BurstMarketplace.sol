// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

/**
 * @dev This contract does the following:
 * Allows a maker or taker to exchange a Burst NFT for a specific amount of ETH or erc20 token
 * */

 contract BurstMarketplace {

    address private burstNFTContract;

    using SafeMath for uint256;

    event MarketplaceOrderCreated(
    address indexed maker,
    bytes32 indexed tokenId,
    address indexed paymentToken,
    uint256 price
    );

    event MarketplaceOrderFilled(
    address indexed maker,
    address indexed taker,
    bytes32 indexed tokenId,
    address paymentToken,
    uint256 price
    );

    event MarketplaceOrderCanceled(
    address indexed maker,
    bytes32 indexed tokenId,
    address indexed paymentToken,
    uint256 price
    );

    address internal EthAddress = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    /* Address that can create specific changes in the protocol (e.g., change protocolFee or protocolFeeRecipient) */
    address public governance;

    /* ProtocolFee is the percentage of the payment that will go to the protocol once the NFT is exchanged */ 
    uint256 public protocolFee;

    /* Address that receives the protocol fee */
    address public protocolFeeRecipient;

    struct marketplaceOrder {
        address maker;
        address taker;
        address paymentToken;
        uint256 burstTokenId;
        uint256 price;
        bool active;
    }

    mapping (uint256 => marketplaceOrder) internal tokenIdToActiveMarketplaceOrders;

    constructor (address _governance, uint256 _protocolFee, address _protocolFeeRecipient, address _burstNFTContract) {
        governance = _governance;
        protocolFee = _protocolFee;
        protocolFeeRecipient = _protocolFeeRecipient;
        burstNFTContract = _burstNFTContract;
    }

    /* ****************
     * Public Functions
     * ****************
     * */

    /**
     * @dev Public function to set the Governace address for the protocol
     *
     * */
    function setGovernance(address _governance) public {
        require(msg.sender == governance, "!governance");
        governance = _governance;
    } 

    /**
     * @dev Public function to set the Protocol Fee for the protocol
     * Should be a number 0 through 100 that represents a percentage
     *
     * */
    function setProtocolFee(uint _protocolFee) public {
        require(msg.sender == governance, "!governance");
        protocolFee = _protocolFee;
    }

    /**
     * @dev Public function to set the Protocol Fee Recipient Address
     *
     * */
    function setProtocolFeeRecipient(address _protocolFeeRecipient) public {
        require(msg.sender == governance, "!governance");
        protocolFeeRecipient = _protocolFeeRecipient;
    }

    /**
     * @dev Public function to set a market order for an existing Burst NFT
     *
     * */
    function createMarketplaceOrder(uint256 _tokenId, address _paymentToken, uint256 _price) public {
        IERC721 nft;
        nft = IERC721(burstNFTContract);
        require(msg.sender == nft.ownerOf(_tokenId), "Not tokenID owner, marketplace order not allowed");
        tokenIdToActiveMarketplaceOrders[_tokenId].maker = msg.sender;
        tokenIdToActiveMarketplaceOrders[_tokenId].taker = address(0);
        tokenIdToActiveMarketplaceOrders[_tokenId].paymentToken = _paymentToken;
        tokenIdToActiveMarketplaceOrders[_tokenId].burstTokenId = _tokenId;
        tokenIdToActiveMarketplaceOrders[_tokenId].price = _price;
        tokenIdToActiveMarketplaceOrders[_tokenId].active = true;
        // nft.approve(address(this), _tokenId);
        emit MarketplaceOrderCreated(nft.ownerOf(_tokenId),
        bytes32(_tokenId),
        _paymentToken,
        _price);
    }

    /**
     * @dev Public function to fill an existing Burst NFT market order
     *
     * */
    function confirmMarketplaceOrder(uint256 _tokenId) payable public {
        IERC721 nft;
        nft = IERC721(burstNFTContract);
        require(tokenIdToActiveMarketplaceOrders[_tokenId].active, "Marketplace order does not exists");
        require(nft.ownerOf(_tokenId) == tokenIdToActiveMarketplaceOrders[_tokenId].maker, "Burst NFT current owner is not order maker");
        uint256 marketplacePrice = tokenIdToActiveMarketplaceOrders[_tokenId].price;
        uint256 protocolFeeAmount = marketplacePrice.mul(protocolFee).div(100);
        if (tokenIdToActiveMarketplaceOrders[_tokenId].paymentToken == EthAddress) {
            require(msg.value >= marketplacePrice, "Not enough ETH");
            (bool success, ) = protocolFeeRecipient.call{value:protocolFeeAmount}("");
            require(success, "Transfer failed.");
            (bool greatSuccess, ) = nft.ownerOf(_tokenId).call{value:marketplacePrice.sub(protocolFeeAmount)}("");
            require(greatSuccess, "Transfer failed.");
        } else {
            require(msg.value == 0);
            IERC20 erc;
            erc = IERC20(tokenIdToActiveMarketplaceOrders[_tokenId].paymentToken);
            require(erc.balanceOf(msg.sender) >= marketplacePrice, "Not enough payment token");
            erc.approve(address(this), marketplacePrice);
            erc.transferFrom(msg.sender, protocolFeeRecipient, protocolFeeAmount);
            erc.transferFrom(msg.sender, nft.ownerOf(_tokenId), marketplacePrice.sub(protocolFeeAmount));
        }
        nft.safeTransferFrom(nft.ownerOf(_tokenId), msg.sender, _tokenId);
        tokenIdToActiveMarketplaceOrders[_tokenId].active = false;
        emit MarketplaceOrderFilled(
            nft.ownerOf(_tokenId),
            msg.sender,
            bytes32(_tokenId),
            tokenIdToActiveMarketplaceOrders[_tokenId].paymentToken,
            marketplacePrice);
    }

    /**
     * @dev Public function to cancel an existing Burst NFT market order
     *
     * */
    function cancelMarketplaceOrder(uint256 _tokenId) public {
        IERC721 nft;
        nft = IERC721(burstNFTContract);
        require(tokenIdToActiveMarketplaceOrders[_tokenId].active, "Marketplace order does not exists");
        require(msg.sender == nft.ownerOf(_tokenId), "Not tokenID owner, marketplace order not allowed");
        tokenIdToActiveMarketplaceOrders[_tokenId].active = false;
        emit MarketplaceOrderCreated(
            nft.ownerOf(_tokenId),
            bytes32(_tokenId),
            tokenIdToActiveMarketplaceOrders[_tokenId].paymentToken,
            tokenIdToActiveMarketplaceOrders[_tokenId].price);
    }

    /* To be used as contract development evolves */
    // function hashSeriesNumber(uint256 _tokenId, uint256 _price) internal pure returns (bytes32) {
    //     return keccak256(abi.encode(_tokenId, _price));
    // }

 }