var stringSimilarity = require("string-similarity");

const verifyAnswer = (answer, given) => {

  // Clean up given and answer
  given = simplify(given);
  answer = simplify(answer);

  // Generate variants on the given answer
  let variants = [given];

  // Try attaching small words to the given answer
  SMALL_WORDS.forEach(word => variants.push(word + ' ' + given));

  // Try removing small words from the start of the given answer
  variants.push(given.replace(SMALL_WORDS_START_REGEX, ''));

  // Find the variant most similar to the real answer, see if it is close enough
  console.log(JSON.stringify(stringSimilarity.findBestMatch(answer, variants)));
  return stringSimilarity.findBestMatch(answer, variants).bestMatch.rating > 0.70;
};

const SMALL_WORDS = ['a', 'an', 'the'];
const pattern = SMALL_WORDS.reduce((acc, cur) => {
  let pipe = acc.length == 0 ? '' : '|';
  return acc + pipe + '^' + cur + ' ';
}, "");
const SMALL_WORDS_START_REGEX = new RegExp(pattern, 'g');


// Cleans up the given string
function simplify(string){
  string = string
    .toLowerCase()
    .replace(/'|"|\./g, '')  // remove apostrophes, quotes, periods
    .replace(/\ +/g, ' ') // Change multiple spaces to one space
    .replace(/\-/g, ' ') // Change hyphens to one spaces
    .trim();              // Remove leading and trailing spaces
  return string;
}

module.exports = verifyAnswer;