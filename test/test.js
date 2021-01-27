var assert = require('assert');
const verifyAnswer = require('../functions/verifyAnswer');

describe('Basic Answer Verification', function() {
  describe('Same word', function() {
    it('hi | hi', function() {
      assert.strictEqual(verifyAnswer("hi", "hi"), true);
    });
    it('johnson | johnson', function() {
      assert.strictEqual(verifyAnswer("johnson", "johnson"), true);
    });
    it('alphabet | alphabet', function() {
      assert.strictEqual(verifyAnswer("alphabet", "alphabet"), true);
    });
  });

  describe('Different word', function() {
    it('hi | bike', function() {
      assert.strictEqual(verifyAnswer("hi", "bike"), false);
    });
    it('johnson | turkey', function() {
      assert.strictEqual(verifyAnswer("johnson", "turkey"), false);
    });
    it('alphabet | power', function() {
      assert.strictEqual(verifyAnswer("alphabet", "power"), false);
    });
  });
});