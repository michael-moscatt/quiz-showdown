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

describe('Replacements', function () {
  describe('Hyphens', function () {
    it('in-the-woods | in the woods', function () {
      assert.strictEqual(verifyAnswer("in-the-woods", "in the woods"), true);
    });
    it('up-to | up to', function () {
      assert.strictEqual(verifyAnswer("up-to", "up to"), true);
    });
  });

  describe('Extra Spaces', function () {
    it('run  around | run around', function () {
      assert.strictEqual(verifyAnswer("run  around", "run around"), true);
    });
    it('jump over | jump   over', function () {
      assert.strictEqual(verifyAnswer("jump over", "jump   over"), true);
    });
  });
});

describe('Removal', function () {
  describe('Apostrophes', function () {
    it('michael\'s | michaels', function () {
      assert.strictEqual(verifyAnswer("michael's", "michaels"), true);
    });
    it('s\'s\'s\' | sss', function () {
      assert.strictEqual(verifyAnswer("s's's'", "sss"), true);
    });
  });

  describe('Quotes', function () {
    it('"James" | James', function () {
      assert.strictEqual(verifyAnswer("\"James\"", "James"), true);
    });
    it('"b"" | b', function () {
      assert.strictEqual(verifyAnswer("\"b\"\"", "b"), true);
    });
  });

  describe('Periods', function () {
    it('a.b | ab', function () {
      assert.strictEqual(verifyAnswer("a.b", "ab"), true);
    });
    it('..g | g', function () {
      assert.strictEqual(verifyAnswer("..g", "g"), true);
    });
  });

  describe('Small Words', function () {
    it('family | the family', function () {
      assert.strictEqual(verifyAnswer('family', 'the family'), true);
    });
    it('alpha | thealphathe', function () {
      assert.strictEqual(verifyAnswer('alpha', 'thealphathe'), false);
    });
    it('alpha bet | alpha the the bet', function () {
      assert.strictEqual(verifyAnswer('alpha bet', 'alpha the the bet'), false);
    });
  });

  describe('Slight Spelling Errors', function () {
    it('megellan | megellen', function () {
      assert.strictEqual(verifyAnswer('megellan', 'megellen'), true);
    });
    it('fourier | forier', function () {
      assert.strictEqual(verifyAnswer('fourier', 'forier'), true);
    });
  });
});