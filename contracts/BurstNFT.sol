// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

/*
    accepts erc20 as deposit
    creates erc721 mapped to deposited erc20
    destroys erc721 and transfers withdrawn erc20
*/

contract BurstNFT is IERC721Enumerable, ERC721Burnable {
    using SafeMath for uint256;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Maps the tokenID of the NFT to the deposited ERC20 address and amount
    mapping(uint256 => mapping(address => uint256))
        public nftToTokenAmountMapping;

    // Maps the tokenID of the NFT to the array of deposited ERC20 addresses
    mapping(uint256 => address[]) public nftToTokenAddressesMapping;

    // Maps the tokenID of the NFT to the address of the creator
    mapping(uint256 => address) public ntfCreatorMapping;

    constructor() ERC721("Burst NFT", "BURST") {}

    /** PUBLIC FUNCTIONS */

    /**
     * @dev Public function to deposit ERC20 and mint Burst NFT
     *
     * */
    function createBurstWithSingleErc20(address _tokenContract, uint256 _amount)
        public
    {
        depositErc20(_tokenContract, _amount);
        nftToTokenAddressesMapping[_tokenIds.current()].push(_tokenContract);
        ntfCreatorMapping[_tokenIds.current()] = _msgSender();
        mintBurst("_tokenURIplaceholder"); //Need to figure out what to do with this URI
    }

    /**
     * @dev Public function to deposit ERC20 and mint Burst NFT
     *
     * */
    function createBurstWithMultiErc20(
        address[] memory _tokenContracts,
        uint256[] memory _amounts
    ) public {
        assert(_tokenContracts.length == _amounts.length);
        for (uint256 i = 0; i < _tokenContracts.length; i++) {
            depositErc20(_tokenContracts[i], _amounts[i]);
        }
        nftToTokenAddressesMapping[_tokenIds.current()] = _tokenContracts;
        ntfCreatorMapping[_tokenIds.current()] = _msgSender();
        mintBurst("_tokenURIplaceholder"); //Need to figure out what to do with this URI
    }

    /**
     * @dev Public function to burn Burst NFT that contains a single erc20 and release that erc20
     *
     * */
    function destroyBurstWithSingleErc20(uint256 _tokenId) public {
        require(
            _isApprovedOrOwner(_msgSender(), _tokenId),
            "ERC721Burnable: caller is not owner nor approved"
        );
        assert(nftToTokenAddressesMapping[_tokenId].length == 0);
        address tokenContract = nftToTokenAddressesMapping[_tokenId][0];
        uint256 tokenAmount = nftToTokenAmountMapping[_tokenId][tokenContract];
        require(tokenAmount > 0, "NFT does not hold ERC20 asset");
        _transferErc20(_msgSender(), tokenContract, tokenAmount);
        burn(_tokenId);
    }

    /**
     * @dev Public function to burn Burst NFT that contains multiple erc20 and release those erc20
     *
     * */
    function destroyBurstWithMultiERC20(uint256 _tokenId) public {
        require(
            _isApprovedOrOwner(_msgSender(), _tokenId),
            "ERC721Burnable: caller is not owner nor approved"
        );
        //Need to insert a control here to make sure the below mapped array of addresses exists
        for (
            uint256 i = 0;
            i < nftToTokenAddressesMapping[_tokenId].length;
            i++
        ) {
            releaseErc20(_tokenId, nftToTokenAddressesMapping[_tokenId][i]);
        }
        burn(_tokenId);
    }

    /** INTERNAL FUNCTIONS */

    /**
     * @dev Internal function to deposit ERC20
     *
     * */
    function depositErc20(address _tokenContract, uint256 _amount) internal {
        IERC20 erc;
        erc = IERC20(_tokenContract);
        uint256 al = erc.allowance(_msgSender(), address(this));
        require(al >= _amount, "Token allowance not enough");
        require(
            erc.transferFrom(_msgSender(), address(this), _amount),
            "Transfer failed"
        );
        nftToTokenAmountMapping[_tokenIds.current()][
            _tokenContract
        ] = nftToTokenAmountMapping[_tokenIds.current()][_tokenContract].add(
            _amount
        );
    }

    /**
     * @dev Internal function to mint Burst NFT
     *
     * */
    function mintBurst(string memory _tokenURI) internal returns (uint256) {
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
    function releaseErc20(uint256 _tokenId, address _tokenContract) internal {
        uint256 tokenAmount = nftToTokenAmountMapping[_tokenId][_tokenContract];
        require(tokenAmount > 0, "NFT does not hold ERC20 asset");
        _transferErc20(_msgSender(), _tokenContract, tokenAmount);
    }

    /**
     * @dev Internal function to transfer ERC20 held in the contract
     *
     * */
    function _transferErc20(
        address _recipient,
        address _tokenContract,
        uint256 _returnAmount
    ) internal {
        IERC20 erc;
        erc = IERC20(_tokenContract);
        require(
            erc.balanceOf(address(this)) >= _returnAmount,
            "Not enough funds to transfer"
        );
        erc.transfer(_recipient, _returnAmount);
    }
}
