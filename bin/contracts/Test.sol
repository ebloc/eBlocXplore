/**
 * The Test contract does this and that...
 */
contract Test {

  mapping (address => uint) balances;

  constructor() public payable {
  }

  function deposit() public payable {
    balances[msg.sender] += msg.value;
  }

  function withdraw(uint amount) public {
    if(balances[msg.sender] > amount) {
      balances[msg.sender] -= amount;
      msg.sender.transfer(amount);
    }
  }

  function testTransfer(address receiver) public payable {
    receiver.transfer(msg.value);
  }
}
