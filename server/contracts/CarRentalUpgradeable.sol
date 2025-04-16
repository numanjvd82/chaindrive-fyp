// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

contract CarRentalUpgradeable is Initializable, ReentrancyGuardUpgradeable {
    address payable public chaindriveWallet;

    struct Rental {
        address payable renter;
        address payable owner;
        uint256 rentalFee;
        uint256 securityDeposit;
        uint256 platformFee;
        bool renterConfirmed;
        bool ownerConfirmed;
        bool isCompleted;
    }

    mapping(uint256 => Rental) public rentals;
    uint256 public rentalCounter;

    event RentalInitiated(
        uint256 rentalId,
        address renter,
        address owner,
        uint256 totalAmount
    );

    event RentalCompleted(uint256 rentalId, address renter, address owner);

    event RentalCancelled(uint256 rentalId, address renter, address owner);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address payable _chaindriveWallet) public initializer {
        __ReentrancyGuard_init();
        chaindriveWallet = _chaindriveWallet;
    }

    function initiateRental(
        address payable owner,
        uint256 rentalFee,
        uint256 securityDeposit,
        uint256 platformFee
    ) external payable {
        uint256 totalAmount = rentalFee + securityDeposit + platformFee;
        require(msg.value == totalAmount, "Incorrect ETH amount");

        rentalCounter++;
        rentals[rentalCounter] = Rental({
            renter: payable(msg.sender),
            owner: owner,
            rentalFee: rentalFee,
            securityDeposit: securityDeposit,
            platformFee: platformFee,
            renterConfirmed: false,
            ownerConfirmed: false,
            isCompleted: false
        });

        emit RentalInitiated(rentalCounter, msg.sender, owner, totalAmount);
    }

    function completeRentalByRenter(uint256 rentalId) external {
        Rental storage rental = rentals[rentalId];
        require(msg.sender == rental.renter, "Unauthorized");
        require(!rental.isCompleted, "Rental already completed");

        rental.renterConfirmed = true;

        if (rental.ownerConfirmed) {
            _completeRental(rentalId);
        }
    }

    function completeRentalByOwner(uint256 rentalId) external {
        Rental storage rental = rentals[rentalId];
        require(msg.sender == rental.owner, "Unauthorized");
        require(!rental.isCompleted, "Rental already completed");

        rental.ownerConfirmed = true;

        if (rental.renterConfirmed) {
            _completeRental(rentalId);
        }
    }

    function cancelRental(uint256 rentalId) external nonReentrant {
        Rental storage rental = rentals[rentalId];
        require(msg.sender == rental.renter, "Only renter can cancel");
        require(!rental.isCompleted, "Rental already completed");
        require(!rental.ownerConfirmed, "Cannot cancel after owner confirmed");

        rental.isCompleted = true;

        uint256 refundAmount = rental.rentalFee +
            rental.securityDeposit +
            rental.platformFee;
        (bool success, ) = rental.renter.call{value: refundAmount}("");
        require(success, "Refund failed");

        emit RentalCancelled(rentalId, rental.renter, rental.owner);
    }

    function _completeRental(uint256 rentalId) internal nonReentrant {
        Rental storage rental = rentals[rentalId];
        rental.isCompleted = true;

        (bool sentPlatform, ) = chaindriveWallet.call{
            value: rental.platformFee
        }("");
        require(sentPlatform, "Platform fee transfer failed");

        (bool sentOwner, ) = rental.owner.call{value: rental.rentalFee}("");
        require(sentOwner, "Rental fee transfer failed");

        (bool sentRenter, ) = rental.renter.call{value: rental.securityDeposit}(
            ""
        );
        require(sentRenter, "Security deposit refund failed");

        emit RentalCompleted(rentalId, rental.renter, rental.owner);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
