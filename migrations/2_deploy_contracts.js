const DappToken = artifacts.require("DappToken");
const DappTokenSale = artifacts.require("DappTokenSale");

module.exports = function (deployer) {
  deployer.deploy(DappToken, 1000000).then(function(){
    //Token price is 0.001 Ether
    let tokenPrice = 1000000000000000;
    deployer.deploy(DappTokenSale, DappToken.address, tokenPrice);
  });


};
