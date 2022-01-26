let DappToken = artifacts.require("DappToken");

// contract (DappToken , accounts =>{
//     let tokenInstance;

//     it("Sets the total supply upon deployment", ()=>{
//         return DappToken.deployed().then(function(instance){
//             tokenInstance = instance;
//             return tokenInstance.totalSupply();
//         }).then(totalSupply =>{
//             assert.equal(totalSupply.toNumber(), 1000000, "Sets the total supply to 1,000,000")
//             return tokenInstance.balanceOf(accounts[0]);
//         }
// ).then(adminBalance =>{
//     assert.equal(adminBalance.toNumber(), 1000000, "It allocates the initial supply of token to the admin")
// })

// }

// )})

contract (DappToken , accounts =>{
    let tokenInstance;

    it("Initializes the contract with the correct values", function(){
        return DappToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.name();
        }).then(function(name){
            assert.equal(name, "Dapp Token", "has the correct name");
            return tokenInstance.symbol();
        }).then(function(symbol){
            assert.equal(symbol, "DT", "has th correct symbol");
            return tokenInstance.standard();
        }).then(function(standard){
            assert.equal(standard, "Dapp Token v1.0", "has the correct standard")
        })
    })

    it("allocates the initial supply upon deployment", ()=>{
        return DappToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(totalSupply =>{
            assert.equal(totalSupply.toNumber(), 1000000, "Sets the total supply to 1,000,000")
            return tokenInstance.balanceOf(accounts[0]);
        }
        ).then(adminBalance =>{
            assert.equal(adminBalance.toNumber(), 1000000, "It allocates the initial supply of token to the admin")
        })

    })


    it("transfers token ownership", function(){
        return DappToken.deployed().then(async function(instance){
        tokenInstance = instance;
        return tokenInstance.transfer.call(accounts[1], 99999999999999999999999)
    }).then(assert.fail).catch(function(error){
        assert(error.message, "error message must contain revert")
        return tokenInstance.transfer.call(accounts[1], 250000, {from: accounts[0] });
    }).then(function(success){
        assert.equal(success, true, "the success value is equal to true")
        return tokenInstance.transfer(accounts[1], 250000, {from: accounts[0] });
    }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, "triggers one event");
            assert.equal(receipt.logs[0].event, "Transfer", 'should be the "Transfer" event');
            assert.equal(receipt.logs[0].args._from, accounts[0], "Logs the account tokens are transferred from");
            assert.equal(receipt.logs[0].args._to, accounts[1], "Logs the account tokens are transferred to");
            assert.equal(receipt.logs[0].args._value, 250000, "Logs the transfer amount");
            return tokenInstance.balanceOf(accounts[1]);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 250000, "adds the amount to the receiving account")
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 750000, "The new balance of 750,000 for account[0]")
        })
    })
})






