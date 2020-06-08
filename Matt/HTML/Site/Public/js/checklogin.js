var myQuestions;
var iQuestions = [];
var loggedIn = false;
function getData(){
  fetch("/loggedIn").then(receive);
}
function receive(response){
  iQuestions = response.json().then(data=> {
    if(data.length > 0){
        loggedIn = true;
    }
    console.log(myQuestions);
  })
}
getData();
function checkLogin(respons){
    return loggedIn;
}