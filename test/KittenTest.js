var Kitten = artifacts.require("Kitten");

contract('Kitten', function(accounts){
  it("Should use first account as creator", function () {
    return Kitten.deployed().then(function (instance) {
      return instance.owner.call();
    }).then(function (owner) {
      assert.equal(owner, accounts[0], "The owner is not the first account")
    });
  });

  it("Should return empty balance", function () {
    return Kitten.deployed().then(function (instance) {
      return instance.balanceOf.call(accounts[1]);
    }).then(function (balance) {
      assert.equal(balance, 0, "Not returning empty balance");
    })
  });

  it("Should return correct balance", function () {
    return Kitten.deployed().then(function (instance) {
      if (instance.transfer(accounts[1], 25)) return instance.balanceOf.call(accounts[1]);
      else assert.fail("Transfer not done");
    }).then(function (balance) {
      assert.equal(balance, 25, "Not returning correct balance");
    })
  });

  it("Should approve to use tokens to another account", function () {
    return Kitten.deployed().then(function (instance) {
      if (instance.approve(accounts[1], 30)) {
        return instance.allowance.call(accounts[0], accounts[1]);
      } else {
        assert.fail("Doesn't approve properly")
      }
    }).then(function(remaining) {
      assert.equal(remaining, 30, "Allowance not equal to approved amount");
    });
  });

  it("Should transfer with allowance", function() {
    return Kitten.deployed().then(function (instance) {
      return { approved: instance.approve.call(accounts[1], 30), instance: instance };
    }).then(function(data) {
      if (data.approved) return { approved: data.instance.transferFrom.call(accounts[0], accounts[1], 25), instance: data.instance };
      else assert.fail("Allowance not approved");
    }).then(function(data) {
      if (data.approved) return data.instance.balanceOf.call(accounts[1]);
      else assert.fail("Transfer not done");
    }).then(function(balance) {
      assert.equal(balance, 25, "Not returning correct balance");
    });
  });
});