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
        alert("LOGGED IN\nUsername: " + username + "\nPassword: " + password);
    }

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