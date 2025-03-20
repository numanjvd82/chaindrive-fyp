// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CarRental {
    address payable public chaindriveWallet;

    event FundsReceived(address sender, uint256 amount);
    event FundsForwarded(address recipient, uint256 amount);

    constructor(address payable _chaindriveWallet) {
        chaindriveWallet = _chaindriveWallet;
    }

    receive() external payable {
        require(msg.value > 0, "Must send Ether");

        emit FundsReceived(msg.sender, msg.value);

        // Forward Ether to Chaindrive wallet
        (bool success, ) = chaindriveWallet.call{value: msg.value}("");
        require(success, "Transfer failed");

        emit FundsForwarded(chaindriveWallet, msg.value);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
