//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract EscrowAgency is ReentrancyGuard {
    using Counters for Counters.Counter;

    enum Status {
        AWAITING_DELIVERY,
        CANCELLED,
        DELIVERED,
        COMPLETE
    }

    struct Escrow {
        uint256 id;
        address seller;
        address buyer;
        uint256 value;
        uint256 createdAt;
        uint256 expiryTime;
        Status status;
    }

    struct Seller {
        address payable id;
        string name;
        string email;
    }

    struct Buyer {
        address payable id;
        string name;
        string email;
    }

    address public agent;

    uint256 public commission;

    mapping(address => Seller) public sellers;
    Counters.Counter public sellersCount;

    mapping(uint256 => address) public sellersCountToAddress;

    mapping(address => Buyer) public buyers;
    Counters.Counter public buyersCount;

    mapping(uint256 => address) public buyersCountToAddress;

    mapping(uint256 => Escrow) public escrows;
    Counters.Counter public escrowsCount;

    mapping(address => uint256[]) public buyerEscrows;
    mapping(address => uint256[]) public sellerEscrows;

    event EscrowCreated(
        address seller,
        address buyer,
        uint256 value,
        uint256 createdAt
    );

    event EscrowCancelled(
        address seller,
        address buyer,
        uint256 value,
        uint256 createdAt,
        uint256 cancelledAt
    );

    event GoodsDelivered(
        address seller,
        address buyer,
        uint256 value,
        uint256 time
    );

    modifier onlyAgent() {
        require(msg.sender == agent);
        _;
    }

    modifier onlyBuyer(uint256 escrowId) {
        require(
            msg.sender == escrows[escrowId].buyer,
            "Not the buyer of this escrow"
        );
        _;
    }

    modifier notCancelled(uint256 escrowId) {
        require(
            escrows[escrowId].status != Status.CANCELLED,
            "The escrow is cancelled"
        );
        _;
    }

    constructor() {
        agent = msg.sender;
        commission = 3;
    }

    function setCommission(uint256 _commission) external onlyAgent {
        commission = _commission;
    }

    function registerBuyer(string calldata name, string calldata email)
        external
    {
        require(
            buyers[msg.sender].id == address(0),
            "A buyer with this address has already been registered"
        );
        buyers[msg.sender] = Buyer(payable(msg.sender), name, email);
        buyersCount.increment();
        uint256 _buyersCount = buyersCount.current();
        buyersCountToAddress[_buyersCount] = msg.sender;
    }

    function registerSeller(string calldata name, string calldata email)
        external
    {
        require(
            sellers[msg.sender].id == address(0),
            "A seller with this address has already been registered"
        );
        sellers[msg.sender] = Seller(payable(msg.sender), name, email);
        sellersCount.increment();
        uint256 _sellersCount = sellersCount.current();
        sellersCountToAddress[_sellersCount] = msg.sender;
    }

    // the buyer initiates the escrow
    function initiateEscrow(address payable seller, uint256 expiryTime)
        external
        payable
    {
        address buyer = msg.sender;
        uint256 value = msg.value;

        require(buyers[buyer].id != address(0), "Not a registered buyer");
        require(sellers[seller].id != address(0), "Not a registered seller");
        require(value >= 0, "Escrow value should be greater than zero");

        // apply commission
        value = ((100 * value * 10**18) / (100 + commission)) / 10**18;

        Escrow memory escrow = Escrow(
            escrowsCount.current(),
            seller,
            buyer,
            value,
            block.timestamp,
            expiryTime,
            Status.AWAITING_DELIVERY
        );

        uint256 _escrowsCount = escrowsCount.current();

        escrows[_escrowsCount] = escrow;
        buyerEscrows[buyer].push(_escrowsCount);
        sellerEscrows[seller].push(_escrowsCount);

        escrowsCount.increment();

        emit EscrowCreated(seller, buyer, value, block.timestamp);
    }

    // the buyer cancels the escrow
    function cancelEscrow(uint256 escrowId)
        external
        onlyBuyer(escrowId)
        notCancelled(escrowId)
    {
        require(
            escrows[escrowId].status == Status.AWAITING_DELIVERY,
            "The goods / service have already been delivered"
        );

        escrows[escrowId].status = Status.CANCELLED;

        emit EscrowCancelled(
            escrows[escrowId].seller,
            escrows[escrowId].buyer,
            escrows[escrowId].value,
            escrows[escrowId].createdAt,
            block.timestamp
        );
    }

    // the buyer confirms the delivery
    function confirmDelivery(uint256 escrowId)
        external
        onlyBuyer(escrowId)
        notCancelled(escrowId)
    {
        require(
            escrows[escrowId].status == Status.AWAITING_DELIVERY,
            "The escrow has already been delivered"
        );

        escrows[escrowId].status = Status.DELIVERED;
    }

    // the seller withdraws the funds
    function sellerWithdraw(uint256 escrowId) external notCancelled(escrowId) {
        Escrow memory escrow = escrows[escrowId];
        require(escrow.seller != address(0), "This escrow does not exist");
        require(
            escrow.seller == msg.sender,
            "You are not the seller in this escrow"
        );
        require(
            escrow.status == Status.DELIVERED,
            "The delivery has not yet been confirmed"
        );
        require(
            escrow.status != Status.COMPLETE,
            "The escrow is already complete"
        );

        payable(msg.sender).transfer(escrow.value);
        escrows[escrowId].status == Status.COMPLETE;
    }

    function buyerWithdraw(uint256 escrowId) external onlyBuyer(escrowId) {
        Escrow memory escrow = escrows[escrowId];

        require(escrow.buyer != address(0), "This escrow does not exist");
        require(
            escrow.status != Status.DELIVERED &&
                escrow.status != Status.CANCELLED,
            "You cannot withdraw funds at this stage"
        );

        payable(msg.sender).transfer(escrow.value);
        escrows[escrowId].status == Status.COMPLETE;
    }

    function getEscrowById(uint256 id) external view returns (Escrow memory) {
        Escrow storage escrow = escrows[id];

        require(
            escrow.buyer == msg.sender ||
                escrow.seller == msg.sender ||
                escrow.buyer == agent ||
                escrow.seller == agent,
            "No right to view this document"
        );

        return escrow;
    }

    function getEscrowsBySeller(address seller)
        external
        view
        returns (Escrow[] memory)
    {
        uint256 escrowsSellerCount = 0;
        uint256 i;
        uint256 j;

        uint256 _escrowsCount = escrowsCount.current();

        for (i = 0; i < _escrowsCount; i++) {
            if (escrows[i].seller == seller) {
                escrowsSellerCount++;
            }
        }

        Escrow[] memory memoryEscrows = new Escrow[](escrowsSellerCount);

        for (i = 0; i < _escrowsCount; i++) {
            if (escrows[i].seller == seller) {
                memoryEscrows[j] = escrows[i];
                j++;
            }
        }

        return memoryEscrows;
    }

    function getEscrowsByBuyer(address buyer)
        external
        view
        returns (Escrow[] memory)
    {
        uint256 escrowsBuyerCount = 0;
        uint256 i;
        uint256 j;

        uint256 _escrowsCount = escrowsCount.current();

        for (i = 0; i < _escrowsCount; i++) {
            if (escrows[i].buyer == buyer) {
                escrowsBuyerCount++;
            }
        }

        Escrow[] memory memoryEscrows = new Escrow[](escrowsBuyerCount);

        for (i = 0; i < _escrowsCount; i++) {
            if (escrows[i].buyer == buyer) {
                memoryEscrows[j] = escrows[i];
                j++;
            }
        }

        return memoryEscrows;
    }

    function getBuyerDetails(address buyer)
        external
        view
        returns (Buyer memory)
    {
        return buyers[buyer];
    }

    function getSellerDetails(address seller)
        external
        view
        returns (Seller memory)
    {
        return sellers[seller];
    }

    function getAllSellers() external view returns (Seller[] memory) {
        uint256 _sellersCount = sellersCount.current();
        Seller[] memory allSellers = new Seller[](_sellersCount);

        uint256 i;
        for (i = 0; i < _sellersCount; i++) {
            address addr = sellersCountToAddress[i + 1];
            allSellers[i] = sellers[addr];
        }

        return allSellers;
    }

    function getAllBuyers() external view returns (Buyer[] memory) {
        uint256 _buyersCount = buyersCount.current();

        Buyer[] memory allBuyers = new Buyer[](_buyersCount);

        uint256 i;
        for (i = 0; i < _buyersCount; i++) {
            address addr = buyersCountToAddress[i + 1];
            allBuyers[i] = buyers[addr];
        }

        return allBuyers;
    }
}
