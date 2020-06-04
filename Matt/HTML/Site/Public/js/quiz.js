"use strict";

// Immediately invoked function expression
(function(){
  // Functions
  function buildQuiz(){
    // variable to store the HTML output
    const quizText = [];
    const pageNumbers = [];

    // Start Quiz page
    quizText.push(
        `<div class="slide active-slide">
         <div class="question"> BubbleSort Quiz</div>
         <div class="answers"> When ready, click Start to begin!</div>
         <button class = "btn-primary btn-lg" id="quiz-start">Start</button>
         </div>`
    )

    // for each question...
    myQuestions.forEach(
      (currentQuestion, questionNumber) => {

        // variable to store the list of possible answers
        const answers = [];
        var letter;
        // and for each available answer...
        for(letter in currentQuestion.answers){

          // ...add an HTML radio button
          answers.push(
            `<label>
              <input type="radio" name="question${questionNumber}" value="${letter}">
              ${letter} :
              ${currentQuestion.answers[letter]}
            </label>`
          );
        }

        // add this question and its answers to the output
        quizText.push(
          `<div class="slide hidden-slide">
            <div class="question">Q${questionNumber + 1}) ${currentQuestion.question} </div>
            <div class="answers"> ${answers.join("")} </div>
          </div>`
        );

        pageNumbers.push(
          `<li><a href="#" id="quiz-q${questionNumber + 1}">${questionNumber + 1}</a></li>`
        )

      }

    );

    // combine output list into one string of HTML and put it on the page
    quizContainer.innerHTML = quizText.join('');
    paginationContainer.innerHTML = pageNumbers.join('');
  }

  function showResults(){

    // gather answer containers from our quiz
    const answerContainers = quizContainer.querySelectorAll('.answers');

    // keep track of user's answers
    let numCorrect = 0;

    // for each question...
    myQuestions.forEach( (currentQuestion, questionNumber) => {

      // find selected answer
      const answerContainer = answerContainers[questionNumber];
      const selector = `input[name=question${questionNumber}]:checked`;
      const userAnswer = (answerContainer.querySelector(selector) || {}).value;

      // if answer is correct
      if(userAnswer === currentQuestion.correctAnswer){
        // add to the number of correct answers
        numCorrect++;

        // color the answers green
        answerContainers[questionNumber].style.color = 'lightgreen';
      }
      // if answer is wrong or blank
      else{
        // color the answers red
        answerContainers[questionNumber].style.color = 'red';
      }
    });

    // show number of correct answers out of total
    resultsContainer.innerHTML = `${numCorrect} out of ${myQuestions.length}`;
  }

  function showSlide(n) {
    slides[currentSlide].classList.remove('active-slide');
    slides[currentSlide].classList.add('hidden-slide');

    slides[n].classList.add('active-slide');
    slides[n].classList.remove('hidden-slide');
    currentSlide = n;

    if(currentSlide === 0){
      previousButton.style.visibility = 'hidden';
    }
    else{
      previousButton.style.visibility = 'visible';
    }

    if(currentSlide === slides.length-1){
      nextButton.style.display = 'none';
      submitButton.style.display = 'inline-block';
    }
    else{
      nextButton.style.display = 'inline-block';
      submitButton.style.display = 'none';
    }
  }

  function showNextSlide() {
    showSlide(currentSlide + 1);
  }

  function showPreviousSlide() {
    showSlide(currentSlide - 1);
  }

  // Variables
  const quizContainer = document.getElementById('quiz');
  const paginationContainer = document.getElementById('pagination');
  const resultsContainer = document.getElementById('results');
  const submitButton = document.getElementById('quiz-submit');
  const dbConfig = require("/createDB");

 

  

  const myQuestions = [
    {
      question: "Who invented JavaScript?",
      answers: {
        a: "Douglas Crockford",
        b: "Sheryl Sandberg",
        c: "Brendan Eich"
      },
      correctAnswer: "c"
    },
    {
      question: "Which one of these is a JavaScript package manager?",
      answers: {
        a: "Node.js",
        b: "TypeScript",
        c: "npm"
      },
      correctAnswer: "c"
    },
    {
      question: "Which tool can you use to ensure code quality?",
      answers: {
        a: "Angular",
        b: "jQuery",
        c: "RequireJS",
        d: "ESLint"
      },
      correctAnswer: "d"
    }
  ];

  // Kick things off
  buildQuiz();

  // Pagination
  const previousButton = document.getElementById("quiz-previous");
  const nextButton = document.getElementById("quiz-next");
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  // Show the first slide
  showSlide(currentSlide);

  // Event listeners
  submitButton.addEventListener('click', showResults);
  previousButton.addEventListener("click", showPreviousSlide);
  nextButton.addEventListener("click", showNextSlide);

  for (let i=1; i <= myQuestions.length; i++) {
    var questionID = "quiz-q" + i;
    console.log(questionID);
    document.getElementById(questionID).addEventListener("click", function() {showSlide(i-1); });
  }


})();

