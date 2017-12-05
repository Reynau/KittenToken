var Kitten = artifacts.require("Kitten");

module.exports = function(deployer) {
  deployer.deploy(Kitten);
};