// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract DappToken {
    //Constructor
    //Set the total number of tokens
    //Read the total number of tokens
    uint256 public totalSupply;

    event Transfer(
        address indexed _from, 
        address indexed _to,
        uint256 _value
    );

    //approve event
    event Approval (
        address indexed _owner, 
        address indexed _spender, 
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;

    //allowance
    mapping(address => mapping(address => uint256)) public allowance;

    //token name
    string public name = "Dapp Token";
    string public symbol = "DT";
    string public standard = "Dapp Token v1.0";


    constructor(uint256 _initialSupply) public{
        //allocate the initial supply to whoever deploys this contract
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    //Transfer function must have the following according to the ERC-20 standard
    //MUST trigger exception when sender has insufficient balance
    //Return boolean
    // MUST trigger transfer event "on success" of transaction
    function transfer(address _to, uint256 _value) public returns(bool success){
        require(balanceOf[msg.sender] >= _value);
        //Transfer the balance
        balanceOf[msg.sender] -= _value; 
        //Increment the receiving account
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    //Delegated Transfer
    function transferFrom(address _from, address _to, uint256 _value)public returns(bool success){
        
        //require _from has enough tokens
        require(_value <= balanceOf[_from]);
        //require allowance is big enough
        require(_value <= allowance[_from][msg.sender]);

        //change balance
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        //update allowance
        allowance[_from][msg.sender] -= _value;
        //Transfer event
        emit Transfer(_from, _to, _value);
        //return a boolean
        return true;
    }

    function approve(address _spender, uint256 _value) public returns(bool success){
        //allowance
        allowance[msg.sender][_spender] = _value;

        //Approve event on any success call to approve
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
}
