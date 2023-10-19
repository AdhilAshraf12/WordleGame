const tileDisplay = document.querySelector('.tile-container')
let wordle = '';
let hint = '';

const fetchData = async () => {
  try {
    const res = await fetch("https://api.masoudkf.com/v1/wordle", {
      headers: {
        "x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",
      },
    });
    const data = await res.json();
    console.log(data); // Add this line to log the response object

    // Choose a random word from the array
    const words = data.dictionary;
    const randomIndex = Math.floor(Math.random() * words.length);
    const randomWord = words[randomIndex].word;
    const randomHint = words[randomIndex].hint;
    wordle = randomWord.toUpperCase();
    hint = randomHint.toUpperCase();
    console.log('The wordle is:', wordle);
    console.log('The hint is:', hint);
  } catch (error) {
    console.error(error);
  }
};

fetchData();



  
  
  
  
  

const keys = [
    'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q',
    'r','s','t','u','v','w','x','y','z','Backspace','Enter'
]

const handleKeyDown = (event) => {
    const key = event.key;
    console.log('Pressed',key);
    if (keys.includes(key))
    {
        event.preventDefault();
        if (key === 'Backspace')
        {
            deleteLetter();
            return;
        }
        if (key === 'Enter')
        {
            checkRow();
            console.log('check row');
            return;
        }
        addLetter(key.toUpperCase());
    }
}

let currentRow = 0
let currentTile = 0
let isGameOver = false

const addLetter = (letter) => {
    if (currentTile < 4 && currentRow < 6) {
    const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
    tile.textContent = letter;
    guessRows[currentRow][currentTile] = letter
    tile.setAttribute('data',letter)
    currentTile++;
    }
}

const deleteLetter = () => {
    if (currentTile > 0){
    currentTile--;
    const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
    tile.textContent = '';
    guessRows[currentRow][currentTile] = '';
    tile.setAttribute('data','')
    }
}

const checkRow = () => {
  const guess = guessRows[currentRow].join('');
  if (currentTile < 4) {
      message('You must complete the guess before checking.');
      return;
    }
  if (currentTile === 4) {
    console.log('Guess is ' + guess);
    addColorTile()
    if (wordle === guess) {
      message('You have guessed correctly!');
      isGameOver = true;
      return;
    } 
    else {
      if (currentRow >= 5)
      {
        isGameOver = true;
        message('Game Over!')
        return;
      }
      if (currentRow < 5)
      {
        currentRow++;
        currentTile = 0;
      }
    }
  }
};

  

const message = (msg) => {
    alert(msg);
}

const addColorTile = () => {
  const TilesRow = document.querySelector('#guessRow-' + currentRow).childNodes
  TilesRow.forEach((tile,index) => {
    const letterData = tile.getAttribute('data')
    if (letterData === wordle[index])
    {
      tile.classList.add('correct')
    } 
    else if (wordle.includes(letterData))
    {
      tile.classList.add('almost')
    } 
    else
    {
      tile.classList.add('greybg')
    } 
})
}
document.addEventListener('keydown', handleKeyDown);

const guessRows = [
    ['','','',''],
    ['','','',''],
    ['','','',''],
    ['','','',''],
    ['','','',''],
    ['','','','']
]

guessRows.forEach((guessRow,guessRowIndex) => {
  const rowElement = document.createElement('div')
  rowElement.setAttribute('id','guessRow-'+ guessRowIndex)
  guessRow.forEach((guess,guessIndex) => {
    const tileElement = document.createElement('div')
    tileElement.setAttribute('id','guessRow-' + guessRowIndex + '-tile-' + guessIndex)
    tileElement.classList.add('tile')
    rowElement.append(tileElement)
  })
  tileDisplay.append(rowElement)
})

//night mode v1

function toggleNightMode() {
  const body = document.querySelector('body');
  body.classList.toggle('night-mode');
}

const nightModeButton = document.querySelector('#night-mode-button');
nightModeButton.addEventListener('click', toggleNightMode);


const startOverButton = document.querySelector('#startover-button');
startOverButton.addEventListener('click', () => {
  location.reload();
});

const hintButton = document.querySelector('#hint-button');
hintButton.addEventListener('click', () => {
  message('Hint: ' + hint);
});

const infoButton = document.querySelector('#info-button');
infoButton.addEventListener('click', () => {
  message('- You have six tries to guess the four-letter Wordle. \n\n- Type in your guess and submit your word by hitting the “enter” key on the keyboard. \n\n-The color of the tiles will change after you submit your word. A yellow tile indicates that you picked the right letter but it’s in the wrong spot. The green tile indicates that you picked the right letter in the correct spot. The gray tile indicates that the letter you picked is not included in the word at all. \n\n-Continue until you solve the Wordle or run out of guesses. Good luck!');
});
