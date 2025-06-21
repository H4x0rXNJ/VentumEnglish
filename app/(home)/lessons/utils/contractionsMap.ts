export const contractionsMap: Record<string, string> = {
  "i'm": "i am",
  im: "i am",
  "you're": "you are",
  youre: "you are",
  "he's": "he is",
  hes: "he is",
  "she's": "she is",
  shes: "she is",
  "it's": "it is",
  its: "it is",
  "we're": "we are",
  were: "we are",
  "they're": "they are",
  theyre: "they are",
  "name's": "name is",
  names: "name is",
  "that's": "that is",
  thats: "that is",
  "there's": "there is",
  theres: "there is",
  "what's": "what is",
  whats: "what is",
  "who's": "who is",
  whos: "who is",
  "how's": "how is",
  hows: "how is",
  "where's": "where is",
  wheres: "where is",
  "when's": "when is",
  whens: "when is",
  "why's": "why is",
  whys: "why is",

  "i've": "i have",
  ive: "i have",
  "you've": "you have",
  youve: "you have",
  "we've": "we have",
  weve: "we have",
  "they've": "they have",
  theyve: "they have",
  "could've": "could have",
  couldve: "could have",
  "should've": "should have",
  shouldve: "should have",
  "would've": "would have",
  wouldve: "would have",

  "i'd": "i would",
  id: "i would",
  "you'd": "you would",
  youd: "you would",
  "he'd": "he would",
  hed: "he would",
  "she'd": "she would",
  shed: "she would",
  "we'd": "we would",
  wed: "we would",
  "they'd": "they would",
  theyd: "they would",

  "i'll": "i will",
  ill: "i will",
  "you'll": "you will",
  youll: "you will",
  "he'll": "he will",
  hell: "he will",
  "she'll": "she will",
  shell: "she will",
  "we'll": "we will",
  well: "we will",
  "they'll": "they will",
  theyll: "they will",

  "can't": "cannot",
  cant: "cannot",
  "won't": "will not",
  wont: "will not",
  "don't": "do not",
  dont: "do not",
  "doesn't": "does not",
  doesnt: "does not",
  "didn't": "did not",
  didnt: "did not",
  "isn't": "is not",
  isnt: "is not",
  "aren't": "are not",
  arent: "are not",
  "wasn't": "was not",
  wasnt: "was not",
  "weren't": "were not",
  werent: "were not",
  "haven't": "have not",
  havent: "have not",
  "hasn't": "has not",
  hasnt: "has not",
  "hadn't": "had not",
  hadnt: "had not",
  "wouldn't": "would not",
  wouldnt: "would not",
  "shouldn't": "should not",
  shouldnt: "should not",
  "couldn't": "could not",
  couldnt: "could not",
  "mustn't": "must not",
  mustnt: "must not",
  "mightn't": "might not",
  mightnt: "might not",
  "needn't": "need not",
  neednt: "need not",
};

export function expandContractions(text: string): string {
  return text.replace(/\b[\w']+\b/g, (word) => {
    const lower = word.toLowerCase();
    return contractionsMap[lower] || word;
  });
}

export function normalizeText(text: string): string {
  return expandContractions(text)
    .replace(/\b[A-Za-z](?:\.\s*[A-Za-z])*\.?\b/g, (match) => {
      if (match.includes(".")) {
        const letters = match.match(/[A-Za-z]/g);
        return letters ? letters.join("").toLowerCase() : match;
      }
      return match;
    })
    .toLowerCase()
    .replace(/[.,!?;:'"()-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
