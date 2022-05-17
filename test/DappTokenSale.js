let DappToken = artifacts.require("DappToken");
let DappTokenSale = artifacts.require("DappTokenSale");

contract (DappTokenSale , (accounts) =>{
    let tokenInstance;
    let tokenSaleInstance;
    let admin = accounts[0];
    let buyer = accounts[1];
    let tokenPrice = 1000000000000000; //in wei
    let tokensAvailable = 750000;
    let numberOfTokens;

    it("it initializes the contract with the correct values", ()=>{
        return DappTokenSale.deployed().then(function(instance){
            tokenSaleInstance = instance; 
            return tokenSaleInstance.address
        }).then(function(address){
            assert.notEqual(address, 0x0, "has contract address");
            return tokenSaleInstance.tokenContract()
        }).then(function(address){
            assert.notEqual(address, 0x0, "has token contract address")
            return tokenSaleInstance.tokenPrice();
        }).then(function(price){
            assert.equal(price, tokenPrice, "token price is")
        })
    })

    it("facilitates token buying", function(){
        return DappToken.deployed().then(function(instance){
            //Grab token instance first
            tokenInstance = instance;
            return DappTokenSale.deployed();
        }).then(function(instance){
            //then grab token sale instance;
            tokenSaleInstance = instance;
            //Provision 75% of all tokens to the token sale
            return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, {from: admin})
        }).then(function(receipt){
            numberOfTokens = 10;
            return tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer, value: numberOfTokens * tokenPrice})
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, "triggers one event");
            assert.equal(receipt.logs[0].event, "Sell", 'should be the "Sell" event');
            assert.equal(receipt.logs[0].args._buyer, buyer, "Logs the account that purchased the tokens");
            assert.equal(receipt.logs[0].args._amount, numberOfTokens, "Logs the number of tokens purchased");
            return tokenSaleInstance.tokensSold();
        }).then(function(amount){
            assert.equal(amount.toNumber(), numberOfTokens, "increments the number of tokens sold")
            return tokenInstance.balanceOf(buyer)
        }).then(function(balance){
            assert.equal(balance.toNumber(), numberOfTokens)

            return tokenInstance.balanceOf(tokenSaleInstance.address)
        }).then(function(balance){
            assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens)
            //try to buy tokens different from the ether value
            return tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer, value: 1})

        }).then(assert.fail).catch(function(error){
            assert(error.message, "msg.value must equal number of tokens in wei")
            return tokenSaleInstance.buyTokens(800000, {from: buyer, value: numberOfTokens * tokenPrice})
        }).then(assert.fail).catch(function(error){
            assert(error.message, "cannot purchase more tokens than available")
        })
    })


})