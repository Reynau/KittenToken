pragma solidity ^0.4.0;

contract ERC20 {
    function balanceOf(address _owner) public constant returns (uint256 balance);
    function transfer(address _to, uint256 _amount) public returns (bool success);
    function transferFrom(address _from, address _to, uint256 _amount) public returns (bool success);
    function approve(address _spender, uint256 _amount) public returns (bool success);
    function allowance(address _owner, address _spender) public constant returns (uint256 remaining);
    event Transfer(address indexed _from, address indexed _to, uint256 _amount);
    event Approval(address indexed _owner, address indexed _spender, uint256 _amount);
}

contract Kitten is ERC20 {

    // Owner of this contract
    address public owner;

    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowed;

    function Kitten() public {
        owner = msg.sender;
        balances[owner] = 100;
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
}
