var Kitten = artifacts.require("Kitten");

contract('Kitten', function(accounts){
  var kitten;
  var initialSupply = 100;
  it("Should use first account as owner", function () {
    return Kitten.new(initialSupply).then(function (instance) {
      return instance.owner.call();
    }).then(function (owner) {
      assert.equal(owner, accounts[0], "The owner is not the first account")
    });
  });

  it("Should return the initial supply", function () {
    return Kitten.new(initialSupply).then(function (instance) {
      return instance.balanceOf.call(accounts[0]);
    }).then(function (balance) {
      assert.equal(balance, initialSupply, "Not returning initial supply");
    })
  });

  it("Should return empty balance", function () {
    return Kitten.new(initialSupply).then(function (instance) {
      return instance.balanceOf.call(accounts[1]);
    }).then(function (balance) {
      assert.equal(balance, 0, "Not returning empty balance");
    })
  });

  it("Should return correct balance", function () {
    var transferAmount = 25;
    return Kitten.new(initialSupply).then(function (instance) {
      if (instance.transfer(accounts[1], transferAmount)) return instance.balanceOf.call(accounts[1]);
      else assert.fail("Transfer not done");
    }).then(function (balance) {
      assert.equal(balance, transferAmount, "Not returning correct balance");
    })
  });

  it("Should approve to use tokens to another account", function () {
    var approveAmount = 30;
    return Kitten.new(initialSupply).then(function (instance) {
      kitten = instance;

      return instance.approve(accounts[1], approveAmount);
    }).then(function(results) {
      assert.equal(results.logs.length, 1); // Just one event triggered

      var approveEvent = results.logs[0];
      assert.equal(approveEvent.args._owner, accounts[0], "Event owner is not correct");
      assert.equal(approveEvent.args._spender, accounts[1], "Event spender is not correct");
      assert.equal(approveEvent.args._amount, approveAmount, "Event amount is not correct");

      return kitten.allowance.call(accounts[0], accounts[1]);
    }).then(function(remaining) {
      assert.equal(remaining, approveAmount, "Allowance not equal to approved amount");
    });
  });

  it("Should transfer with allowance", function() {
    var approveAmount = 30;
    var transferAmount = 25;
    return Kitten.new(initialSupply).then(function (instance) {
      kitten = instance;

      if (instance.approve(accounts[1], approveAmount))
        return instance.transferFrom(accounts[0], accounts[1], transferAmount, {from: accounts[1]});
      else assert.fail("Failed to approve or return value is not valid");
    }).then(function(results) {
      assert.equal(results.logs.length, 1); // Just one event triggered

      var approveEvent = results.logs[0];
      assert.equal(approveEvent.args._from, accounts[0], "Event owner is not correct");
      assert.equal(approveEvent.args._to, accounts[1], "Event spender is not correct");
      assert.equal(approveEvent.args._amount, transferAmount, "Event amount is not correct");

      return kitten.balanceOf.call(accounts[1]);
    }).then(function(balance) {
      assert.equal(balance, transferAmount, "Not returning correct balance");
    });
  });
});