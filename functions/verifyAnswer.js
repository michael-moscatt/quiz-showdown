const verifyAnswer = (answer, given) => {
  // Some ideas taken from https://github.com/neotenic/protobowl

  // Clean up given and answer
  given = simplify(given);
  answer = simplify(answer);

  let variants = [given];
  // Try attaching small words to the given answer
  SMALL_WORDS.forEach(word => variants.push(SMALL_WORDS + ' ' + given));

  // Attempt each of the variants
  return variants.some(variant => variant === answer);
};

const SMALL_WORDS = ['a', 'an', 'the'];

// Cleans up the given string
function simplify(string){
  string = string
    .toLowerCase()
    .replace(/'|"/g, '')  // apostrophes and quotes 
    .replace(/\./g, '')   // remove periods
    .replace(/\ +/g, ' ') // condense multiple spaces
    .trim();              // Remove leading and trailing spaces
  return string;
}

module.exports = verifyAnswer;