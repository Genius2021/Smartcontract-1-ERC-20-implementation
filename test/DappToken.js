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

    it("approves tokens for delegated transfer", function(){
        return DappToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.approve.call(accounts[1], 100);
        }).then(function(success){
            assert.equal(success, true, "it returns true");
            return tokenInstance.approve(accounts[1], 100, {from: accounts[0]});
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, "triggers one event");
            assert.equal(receipt.logs[0].event, "Approval", 'should be the "Approval" event');
            assert.equal(receipt.logs[0].args._owner, accounts[0], "Logs the account the tokens are authorized by");
            assert.equal(receipt.logs[0].args._spender, accounts[1], "Logs the account tokens are authorized to");
            assert.equal(receipt.logs[0].args._value, 100, "Logs the approved amount");
            return tokenInstance.allowance(accounts[0], accounts[1]);
        }).then(function(allowance){
            assert.equal(allowance.toNumber(), 100, "stores the allowance for delegated transfer");
        })
    })

    it("handles delegated transfers", function(){
        return DappToken.deployed().then(function(instance){
            tokenInstance = instance;
            fromAccount = accounts[2];
            toAccount = accounts[3];
            spendingAccount = accounts[4];
            //Transfer some tokens to fromAccount
            return tokenInstance.transfer(fromAccount, 100, {from: accounts[0]});
        }).then(function(receipt){
            // Approve spendingAccount to spend 10 tokens from fromAccount
            return tokenInstance.approve(spendingAccount, 10, {from: fromAccount})
        }).then(function(receipt){
            //try transfering something larger than sender's balance
            return tokenInstance.transferFrom(fromAccount, toAccount, 9999, {from: spendingAccount})
        }).then(assert.fail).catch(function(error){
            assert(error.message, "cannot transfer value larger than balance");
            //try transfering something larger than the approved amount
            return tokenInstance.transferFrom(fromAccount, toAccount, 20, {from: spendingAccount})
        }).then(assert.fail).catch(function(error){
            assert(error.message, "cannot transfer value larger than approved amount");
            return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, {from: spendingAccount})
        }).then(function(success){
            assert.equal(success, true)
            return tokenInstance.transferFrom(fromAccount, toAccount, 10, {from: spendingAccount})
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, "triggers one event");
            assert.equal(receipt.logs[0].event, "Transfer", 'should be the "Transfer" event');
            assert.equal(receipt.logs[0].args._from, fromAccount, "Logs the account the tokens are tranferred from");
            assert.equal(receipt.logs[0].args._to, toAccount, "Logs the transferred tokens are authorized to");
            assert.equal(receipt.logs[0].args._value, 10, "Logs the transfer amount");
            return tokenInstance.balanceOf(fromAccount);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 90, "deducts the amount from the sending account");
            return tokenInstance.balanceOf(toAccount);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 10, "adds the amount from the receiving account");
            return tokenInstance.allowance(fromAccount, spendingAccount);
        }).then(function(allowance){
            assert.equal(allowance.toNumber(), 0, "deducts amount from the allowance ")
        })
    })
})






