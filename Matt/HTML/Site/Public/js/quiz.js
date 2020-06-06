"use strict";
var myQuestions;
var iQuestions = [];
function getData(){
  fetch("/data").then(receive);
}
function receive(response){
  iQuestions = response.json().then(data=> {
    console.log(data);
    myQuestions = data;
    console.log(myQuestions);
  })
}
getData();
// Immediately invoked function expression
(
  
  setTimeout(function(){
  // Functions
  

  function buildQuiz(){
    // variable to store the HTML output
    
    const quizText = [];
    const pageNumbers = [];

    // Start Quiz page
    quizText.push(
        `<div class="slide active-slide">
         <div class="title"> BubbleSort Quiz</div>
         <h2> When ready, click Start to begin!</h2>
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
              <input id="radioButton" type="radio" name="question${questionNumber}" value="${letter}">
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
    resultsContainer.innerHTML = `<div style="visibility : hidden;">Placeholder Text</div>`
  }

  function showResults(){

    submitButton.style.visibility = 'hidden';
    previousButton.removeEventListener("click", showPreviousSlide);
    previousButton.innerHTML = `<a href="/testhome">< Back</a>`;
    // gather answer containers from our quiz
    const answerContainers = quizContainer.querySelectorAll('.answers');
    // keep track of user's answers
    let numCorrect = 0;
    let i = 0;

    // for each question...
    myQuestions.forEach( (currentQuestion, questionNumber) => {

      // find selected answer
      const answerContainer = answerContainers[questionNumber];
      const selector = `input[name=question${questionNumber}]:checked`;
      const userAnswer = (answerContainer.querySelector(selector) || {}).value;

      // Get id for that answer's page number
      var questionID = "quiz-q" + (questionNumber + 1);
      console.log(currentQuestion.correctAnswer);
      // if answer is correct
      if(userAnswer === currentQuestion.correctAnswer){
        // add to the number of correct answers
        numCorrect++;

        // color the answers green
        answerContainers[questionNumber].style.color = 'lightgreen';
        document.getElementById(questionID).style.background = 'lightgreen';
        document.getElementById(questionID).style.color = 'white';
      }
      // if answer is wrong or blank
      else{
        // color the answers red
        answerContainers[questionNumber].style.color = 'red';
        document.getElementById(questionID).style.background = 'red';
        document.getElementById(questionID).style.color = 'white';
      }

      var radioList = document.getElementsByName("question" + i);
      for (var j=0; j < radioList.length; j++) {
        radioList[j].disabled = true;
      }
      i++;

    });

    // show number of correct answers out of total
    resultsContainer.innerHTML = `${numCorrect} out of ${myQuestions.length}`;
    fetch("result/1/1/" + numCorrect);
  }

  function showSlide(n) {
    slides[currentSlide].classList.remove('active-slide');
    slides[currentSlide].classList.add('hidden-slide');

    slides[n].classList.add('active-slide');
    slides[n].classList.remove('hidden-slide');
    currentSlide = n;

    if(currentSlide === 0) {
      previousButton.style.visibility = 'hidden';
      paginationContainer.style.visibility = 'hidden';
      nextButton.style.display = 'none';
      submitButton.style.display = 'none';
      startButton.style.display = 'inline-block';
    }
    else if (currentSlide === 1) {
      nextButton.style.display = 'inline-block';
      startButton.style.display = 'none';
      paginationContainer.style.visibility = 'visible';
      submitButton.style.display = 'none';
      previousButton.style.visibility = 'hidden';
    }
    else {
      previousButton.style.visibility = 'visible';
      nextButton.style.display = 'inline-block';
      submitButton.style.display = 'none';
    }

    if (currentSlide  === slides.length-1) {
      nextButton.style.display = 'none';
      submitButton.style.display = 'inline-block';
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
  const startButton = document.getElementById('quiz-start');
//
//  const myQuestions = [
//    {
//      question: "Who invented JavaScript?",
//      answers: {
//        a: "Douglas Crockford",
//        b: "Sheryl Sandberg",
//        c: "Brendan Eich"
//      },
//      correctAnswer: "c"
//    },
//    {
//      question: "Which one of these is a JavaScript package manager?",
//      answers: {
//        a: "Node.js",
//        b: "TypeScript",
//        c: "npm"
//      },
//      correctAnswer: "c"
//    },
//            {
//              question: "Which tool can you use to ensure code quality?",
//              answers: {
//                a: "Angular",
//                b: "jQuery",
//                c: "RequireJS",
//                d: "ESLint"
//              },
//              correctAnswer: "d"
//            }
//  ];
 
  // Kick things off
  getData();
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
  startButton.addEventListener("click", showNextSlide);

  // Add event listeners for all the page buttons
  for (let i=1; i <= myQuestions.length; i++) {
    var questionID = "quiz-q" + i;
    document.getElementById(questionID).addEventListener("click", function() {showSlide(i); });
  }


},500));

