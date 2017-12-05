pragma solidity ^0.4.0;

import './ERC20.sol';
import './Owned.sol';

contract Kitten is ERC20, Owned {
    uint256 totalSupply;

    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowed;

    function Kitten(uint256 initialSupply) public {
        balances[owner] = initialSupply;
        totalSupply = initialSupply;
    }

    function _transfer(address _from, address _to, uint256 _amount) internal returns (bool success){
        if (_to != 0x0
            && _amount > 0
            && balances[_from] >= _amount
            && balances[_to] + _amount > balances[_to]) {

            uint256 previousBalance = balances[_from] + balances[_to];

            balances[_from] -= _amount;
            balances[_to] += _amount;
            Transfer(_from, _to, _amount);

            assert(balances[_from] + balances[_to] == previousBalance);
            return true;
        } else {
            return false;
        }
    }

    function balanceOf(address _owner) public constant returns (uint256 balance) {
        return balances[_owner];
    }

    function transfer(address _to, uint256 _amount) public returns (bool success) {
        return _transfer(msg.sender, _to, _amount);
    }

    function transferFrom(address _from, address _to, uint256 _amount) public returns (bool success) {
        if (allowed[_from][_to] >= _amount && _transfer(_from, _to, _amount)) {
            allowed[_from][_to] -= _amount;
            return true;
        } else {
            return false;
        }
    }

    function approve(address _spender, uint256 _amount) public returns (bool success) {
        allowed[msg.sender][_spender] = _amount;
        Approval(msg.sender, _spender, _amount);
        return true;
    }

    function allowance(address _owner, address _spender) public constant returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }

    function mintTokens(address _minter, uint256 _amount) public onlyOwner returns (bool success) {
        if (_minter != 0x0
            && _amount > 0
            && balances[_minter] + _amount > balances[_minter]) {

            balances[_minter] += _amount;
            totalSupply += _amount;
            Transfer(0, owner, _amount);
            Transfer(owner, _minter, _amount);
            return true;
        } else {
            return false;
        }
    }
}
