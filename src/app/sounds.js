const counter = (() =>{
  let timerId;
  const counterContainer = document.getElementById("counter-container");
  const counterImgData = [
    './static/assets/img/soundtracks/7.png',
    './static/assets/img/soundtracks/6.png',
    './static/assets/img/soundtracks/5.png',
    './static/assets/img/soundtracks/4.png',
    './static/assets/img/soundtracks/3.png',
    './static/assets/img/soundtracks/2.png',
    './static/assets/img/soundtracks/1.png',
  ];
  let startCount = 0;
  const next = () => {
    if(startCount < counterImgData.length - 1){
      startCount ++;
    } else {
      startCount = 0;
      clearInterval(timerId);
    }
    counterContainer.src=counterImgData[startCount];
  }
  const start = () => {
    timerId = setInterval(next, 1000);
  }
  const stop = () => {
    startCount = 0;
    clearInterval(timerId);
    counterContainer.src=counterImgData[startCount];
  }
  return {
    start, stop
  }
})();

const soundsData = [
  {
    question: 'Do You know what movie is this music from?',
    a: 'Frozen',
    b: '',
    c: '',
    d: '',
    correct: 'a',
    soundSource: '../static/assets/sounds/frozen.mp3',
  },
  {
    question: 'Do You know what movie is this music from?',
    a: '',
    b: '',
    c: 'Batman',
    d: '',
    correct: 'c',
    soundSource: '../static/assets/sounds/batman1989.mp3',
  },
  {
    question: 'Do You know what movie is this music from?',
    a: '',
    b: 'Turning Forty',
    c: '',
    d: '',
    correct: 'b',
    soundSource: '../static/assets/sounds/czterdziestolatek.mp3',
  },
  {
    question: 'Do You know what movie is this music from?',
    a: '',
    b: 'Edward Scissorhands',
    c: '',
    d: '',
    correct: 'b',
    soundSource: '../static/assets/sounds/edwardScissorhands.mp3',
  },
  {
    question: 'Do You know what movie is this music from?',
    a: '',
    b: '',
    c: '',
    d: 'Hannibal',
    correct: 'd',
    soundSource: '../static/assets/sounds/hannibal.mp3',
  },
  {
    question: 'Do You know what movie is this music from?',
    a: 'Home Alone',
    b: '',
    c: '',
    d: '',
    correct: 'a',
    soundSource: '../static/assets/sounds/homeAlone.mp3',
  },
  {
    question: 'Do You know what movie is this music from?',
    a: "The Queen's Gambit",
    b: '',
    c: '',
    d: '',
    correct: 'a',
    soundSource: '../static/assets/sounds/queensGambit.mp3',
  },
  {
    question: 'Do You know what movie is this music from?',
    a: '',
    b: '',
    c: '',
    d: 'The Mission',
    correct: 'd',
    soundSource: '../static/assets/sounds/mission.mp3',
  },
  {
    question: 'Do You know what movie is this music from?',
    a: '',
    b: '',
    c: '',
    d: 'Master Thaddeus: The Last Foray in Lithuania',
    correct: 'd',
    soundSource: '../static/assets/sounds/panTadeusz.mp3',
  },
  {
    question: 'Do You know what movie is this music from?',
    a: '',
    b: '',
    c: 'Our Folks',
    d: '',
    correct: 'c',
    soundSource: '../static/assets/sounds/samiSwoi.mp3',
  },
];

// Array that will store invalid movie soundtrack answers
let wrongAnswers = [];

// Getting info from API for movie names
async function loadWrongMovieNames() {
  // Making 8 different calls to API because single one contains only 20 movie names
  for (let i = 1; i <= 8; i++) {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=e0add4835a4a4c34f08aeb4c32425f01&language=en-US&page=${i}`,
    );
    const data = await response.json();

    // Filtering array to have movies only in English
    let wrongAnswersFromThisLoop = data.results.map((arr) => {
      if (arr.original_language === 'en') {
        return arr.original_title;
      }
    });

    // Getting rid of all non-English deleted movies turned to "undefined"
    wrongAnswersFromThisLoop = wrongAnswersFromThisLoop.filter(
      (x) => x !== undefined,
    );

    // Adding current API call to overall wrongAnswers array
    wrongAnswers = wrongAnswers.concat(wrongAnswersFromThisLoop);
  }

  // Randomizing wrong answers order
  wrongAnswers = wrongAnswers.sort(() => Math.random() - 0.5);

  // Function returns array with invalid movie names
  return wrongAnswers;
}
loadWrongMovieNames();

const quiz = document.getElementById('quiz');

const soundItem = document.getElementById('sound');
const questionElement = document.getElementById('question');
const answerElements = document.querySelectorAll('.answer');
const a_text = document.getElementById('a-text');
const b_text = document.getElementById('b-text');
const c_text = document.getElementById('c-text');
const d_text = document.getElementById('d-text');
const playBtn = document.getElementById("soundtrackplay");
const submitBtn = document.getElementById('submit');

let delayId;

playBtn.addEventListener("click", function() {
  soundItem.play();
  delayId = setTimeout(counter.start, 10000);
});



// Choosing soundtrack box (button) and appending the soundtrack to it
// const playSoundButton = document.querySelector('.play-button');
// // const soundItem = document.createElement('audio');
// playSoundButton.append(soundItem);

let shuffleQuiz = soundsData.sort(() => Math.random() - 0.5);

let currentQuestion = 0;
let score = 0;

window.setTimeout(loadQuiz, 150);

function loadQuiz() {
  deselectInputs();

  const currentQuizData = soundsData[currentQuestion];

  // Adding source to paste on the page
  soundItem.src = currentQuizData.soundSource;
  questionElement.innerHTML = currentQuizData.question;

  // Making a, b, c, d options display as the correct answer or random wrong answer + making sure that displayed names are not repeating
  a_text.innerHTML =
    currentQuizData.a || wrongAnswers[Math.floor(Math.random() * 91)];
  do {
    b_text.innerHTML =
      currentQuizData.b || wrongAnswers[Math.floor(Math.random() * 91)];
  } while (b_text.innerHTML === a_text.innerHTML);
  do {
    c_text.innerHTML =
      currentQuizData.c || wrongAnswers[Math.floor(Math.random() * 91)];
  } while (
    c_text.innerHTML === a_text.innerHTML ||
    c_text.innerHTML === b_text.innerHTML
  );
  do {
    d_text.innerHTML =
      currentQuizData.d || wrongAnswers[Math.floor(Math.random() * 91)];
  } while (
    d_text.innerHTML === a_text.innerHTML ||
    d_text.innerHTML === b_text.innerHTML ||
    d_text.innerHTML === c_text.innerHTML
  );
}

function selectAnswer() {
  let answer = undefined;

  answerElements.forEach((answerEl) => {
    if (answerEl.checked) {
      answer = answerEl.id;
    }
  });
  return answer;
}

function deselectInputs() {
  answerElements.forEach((answerEl) => {
    answerEl.checked = false;
  });
}

const submitFunction = () => {
  const answer = selectAnswer();

  if (answer) {
    if (answer === soundsData[currentQuestion].correct) {
      score++;
    }

    currentQuestion++;

    soundItem.pause();
    counter.stop();
    clearTimeout(delayId);

    if (currentQuestion < soundsData.length) {
      loadQuiz();
    } else {
      quiz.innerHTML = `<h2>Your final score is: ${score} / ${soundsData.length}</h2><button onClick="location.reload()">Reload</button>`;
    }
  }
}

submitBtn.addEventListener('click', submitFunction);