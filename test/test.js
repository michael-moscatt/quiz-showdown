var assert = require('assert');
const verifyAnswer = require('../functions/verifyAnswer');

describe('Basic Answer Verification', function() {
  describe('Same word', function() {
    it('hi | hi', function() {
      assert.equal(verifyAnswer("hi", "hi"), true);
    });
    it('johnson | johnson', function() {
      assert.equal(verifyAnswer("johnson", "johnson"), true);
    });
    it('alphabet | alphabet', function() {
      assert.equal(verifyAnswer("alphabet", "alphabet"), true);
    });
  });

  describe('Different word', function() {
    it('hi | bike', function() {
      assert.equal(verifyAnswer("hi", "bike"), false);
    });
    it('johnson | turkey', function() {
      assert.equal(verifyAnswer("johnson", "turkey"), false);
    });
    it('alphabet | power', function() {
      assert.equal(verifyAnswer("alphabet", "power"), false);
    });
  });
});