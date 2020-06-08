"use strict";
window.addEventListener('load', start);

function start() {
    /* Add event listener to login & signup buttons */
    document.getElementById("login").addEventListener("click", login);
    document.getElementById("signUp").addEventListener("click", signUp);
    /* Add enter key press listener for all input fields */
    keyListenEnter(document.getElementById("login-username"), "loginA");
    keyListenEnter(document.getElementById("login-password"), "loginA");
    keyListenEnter(document.getElementById("signUp-firstname"), "signUpB");
    keyListenEnter(document.getElementById("signUp-lastname"), "signUpB");
    keyListenEnter(document.getElementById("signUp-email"), "signUpB");
    keyListenEnter(document.getElementById("signUp-username"), "signUpB");
    keyListenEnter(document.getElementById("signUp-password"), "signUpB");

}

// Add key listener for enter to input field which clicks buttonname
function keyListenEnter(input, buttonName) {
    // Execute a function when the user releases a key on the keyboard
    input.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById(buttonName).click();
        }
    });
}



function loginA() {
    var username = document.getElementById('login-username').value;
    var password = document.getElementById('login-password').value;
    var flag = true;
    if (username.length == 0) {
        document.getElementById("login-username").style.borderColor = "red";
        flag = false;
    }
    if (password.length == 0) {
        document.getElementById("login-password").style.borderColor = "red";
        flag = false;
    }
    if (flag == true) {
        return true;
    }
    return false;

}

function signUpB() {
    var firstname = document.getElementById('signUp-firstname').value;
    var lastname = document.getElementById('signUp-lastname').value;
    var email = document.getElementById('signUp-email').value;
    var username = document.getElementById('signUp-username').value;
    var password = document.getElementById('signUp-password').value;
    
    var flag = true;
    if (firstname.length == 0) {
        document.getElementById("signUp-firstname").style.borderColor = "red";
        flag=false;
    }
    if (lastname.length == 0) {
        document.getElementById("signUp-lastname").style.borderColor = "red";
        flag=false;
    }
    if (email.length == 0) {
        document.getElementById("signUp-email").style.borderColor = "red";
        flag=false;
    }
    if (username.length == 0) {
        document.getElementById("signUp-username").style.borderColor = "red";
        flag=false;
    }
    if (password.length == 0) {
        document.getElementById("signUp-password").style.borderColor = "red";
        flag=false;
    }

    let check = /^[A-Za-z]\w{7,14}$/
    if(!password.match(check)){
        document.getElementById("signUp-password").style.borderColor = "red";
        flag=false;
        alert("Password must be at least 8");
    }
    if (flag == true) {
        alert("CREATED ACCOUNT\nUsername: " + username + "\nPassword: " + password);
        return true;
    }
    if (flag == false){
        console.log("false");
        alert("FUCK YOU");
        return false;
    }
}
function signUpA() {
    var firstname = document.getElementById('register-firstname').value;
    var lastname = document.getElementById('register-lastname').value;
    var email = document.getElementById('register-email').value;
    var username = document.getElementById('register-username').value;
    var password = document.getElementById('register-password').value;
    
    var flag = true;
    if (firstname.length == 0) {
        document.getElementById("register-firstname").style.borderColor = "red";
        flag=false;
    }
    if (lastname.length == 0) {
        document.getElementById("register-lastname").style.borderColor = "red";
        flag=false;
    }
    if (email.length == 0) {
        document.getElementById("register-email").style.borderColor = "red";
        flag=false;
    }
    if (username.length == 0) {
        document.getElementById("register-username").style.borderColor = "red";
        flag=false;
    }
    if (password.length == 0) {
        document.getElementById("register-password").style.borderColor = "red";
        flag=false;
    }

    let check = /^[A-Za-z]\w{7,14}$/
    if(!password.match(check)){
        document.getElementById("register-password").style.borderColor = "red";
        flag=false;
        alert("Password must be between 7 and 14 in length and contain at least one upper and lower case character");
    }
    if (flag == true) {
        return true;
    }
    if (flag == false){
        return false;
    }
}