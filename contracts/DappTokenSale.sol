// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./DappToken.sol";

contract DappTokenSale {
    address admin;
    DappToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;
    event Sell(address _buyer, uint256 _amount);

    constructor(DappToken _tokenContract, uint256 _tokenPrice) public {
        //assign an admin
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
        //token price
    }

    //multiply
    function multiply(uint x, uint y) internal pure returns (uint z){
        require(y == 0 || (z = x * y) / y == x);
    }

    //BUY TOKENS
  function buyTokens(uint _numberOfTokens) public payable {
      //Require that value is equal to tokens
      require(msg.value == multiply(_numberOfTokens, tokenPrice));
      //Require that the contract has enough tokens
      require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
      //Require that a transfer is successful
      require(tokenContract.transfer(msg.sender, _numberOfTokens));

      //keep track of tokens sold
      tokensSold += _numberOfTokens;

      //Trigger sell event
      emit Sell(msg.sender, _numberOfTokens);
  }
}