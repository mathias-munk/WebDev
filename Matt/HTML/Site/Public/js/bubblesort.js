"use strict";
var originalString = "mASbeborutBl lgorith";
var startOrder = [21,13,8,3,6,4,9,10,2,11,1,5, 12, 14, 15, 16, 17,18,19,20];


// start order is array of numbers which indicate which position
// each letter from the final string is in
// e.g. "olleh" --- [4,3,2,1,0]
function bubbleSort(stringInput, startOrder) {
    var input = stringInput.toString().split("");
    var order = startOrder;
    var length = input.length-1;
    for (let j = 0; j < length*length; j++) {
        setTimeout(function() {
            for (let i=0; i < length; i++) {
                swapNumbers(order, i);
            }
            length--;
        }, 200*j);
    }
}

function swapNumbers(currentOrder, i) {
    setTimeout(function() {
        var currentString = document.getElementById("page-title").innerText.split("");
        if (currentOrder[i] > currentOrder[i+1]) {
            var temp = currentOrder[i];
            currentOrder[i] = currentOrder[i+1];
            currentOrder[i+1] = temp;
            temp = currentString[i];
            currentString[i] = currentString[i+1].fontcolor('red');
            currentString[i+1] = temp.fontcolor('red');
            document.getElementById("page-title").innerHTML=currentString.join("");
        }
        else {
            document.getElementById("page-title").innerHTML=currentString.join("").fontcolor("white");
        }
    }, 100*i);
}

document.addEventListener("DOMContentLoaded",  function() {
    document.getElementById("page-title").innerText= originalString;
    bubbleSort(originalString, startOrder);
    let animation = anime({
        targets: ".page-title",
        translateY: -10,
        loop: 2,
        direction: 'alternate',
        duration: 1000,
        easing: 'easeInOutSine'
    });
});