export const randomWord = [
      'Titanic', 'Star Wars', 'Thor', 'Red Sparrow', 'Se7en',
      'Oldboy','Matrix', 'Tomb Raider', 'Alien',
      'Psycho', 'Hulk', 'Inception', 'Taxi', 'Casablanca',
      'Dunkirk', 'Rambo', 'Notebook', 'John Wick', 'Taken', 'Interstellar',
      'Rashomon', 'Up', 'Inside Out', 'Gran Torino', 'Whiplash'
]

// returns a random category's name and available choices
export const randomBoard = (randomWord) => {
  randomWord.sort(() => Math.random() - 0.5);
  return randomWord;
}


export const turnWord = (randomWord) => {
  return randomWord[Math.floor(Math.random() * randomWord.length)]
}
