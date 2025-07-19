// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

error RentalNotFound(string message);

contract CarRentalUpgradeable is Initializable, ReentrancyGuardUpgradeable {
    address payable public chaindriveWallet;

    struct TermsConfig {
        uint256 lateFeePerHour; // 0.001 ETH per hour
        uint256 maxLateFeeMultiplier; // 3x
        uint256 damageAssessmentPeriod; // 48 hours
        uint256 violationPenaltyRate; // 50% of security deposit
    }

    struct Rental {
        uint256 id;
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

    string constant termsAndConditions =
        "1. LATE RETURN: Late fees apply for every hour past the agreed return time. "
        "2. DAMAGE RESPONSIBILITY: Renter is fully responsible for any damage to the vehicle during rental period. "
        "3. ILLEGAL ACTIVITIES: Any criminal or illegal activity using the rented vehicle makes the renter fully liable. "
        "4. SECURITY DEPOSIT: May be partially or fully forfeited for violations or damages. ";

    event RentalInitiated(
        uint256 rentalId,
        address renter,
        address owner,
        uint256 totalAmount
    );

    event RentalCompleted(uint256 rentalId, address renter, address owner);

    event RentalCancelled(uint256 rentalId, address renter, address owner);

    modifier onlyValidRental(uint256 rentalId) {
        if (rentals[rentalId].renter == address(0))
            revert RentalNotFound("Rental not found");
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address payable _chaindriveWallet) public initializer {
        __ReentrancyGuard_init();
        chaindriveWallet = _chaindriveWallet;
    }

    function initiateRental(
        uint256 id,
        address payable owner,
        uint256 rentalFee,
        uint256 securityDeposit,
        uint256 platformFee
    ) external payable {
        uint256 totalAmount = rentalFee + securityDeposit + platformFee;
        require(msg.value == totalAmount, "Incorrect ETH amount");
        require(rentals[id].renter == address(0), "Rental ID already exists");

        rentals[id] = Rental({
            id: id,
            renter: payable(msg.sender),
            owner: owner,
            rentalFee: rentalFee,
            securityDeposit: securityDeposit,
            platformFee: platformFee,
            renterConfirmed: false,
            ownerConfirmed: false,
            isCompleted: false
        });

        emit RentalInitiated(id, msg.sender, owner, totalAmount);
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

    function getTermsAndConditions() external pure returns (string memory) {
        return termsAndConditions;
    }

    function getTermsConfig() external pure returns (TermsConfig memory) {
        return
            TermsConfig({
                lateFeePerHour: 0.001 ether,
                maxLateFeeMultiplier: 3,
                damageAssessmentPeriod: 48 hours,
                violationPenaltyRate: 50
            });
    }

    function calculateLateFee(
        uint256 rentalId,
        uint256 hoursLate
    ) internal view returns (uint256) {
        Rental storage rental = rentals[rentalId];
        require(!rental.isCompleted, "Rental already completed");

        TermsConfig memory terms = TermsConfig({
            lateFeePerHour: 0.001 ether,
            maxLateFeeMultiplier: 3,
            damageAssessmentPeriod: 48 hours,
            violationPenaltyRate: 50
        });

        uint256 lateFee = terms.lateFeePerHour * hoursLate;
        uint256 maxLateFee = rental.rentalFee * terms.maxLateFeeMultiplier;

        return lateFee > maxLateFee ? maxLateFee : lateFee;
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
