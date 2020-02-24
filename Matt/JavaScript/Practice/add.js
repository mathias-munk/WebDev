"use strict";
var list = [3, 9, 7, 5, 10, 8];
console.log(add(list));

function add(list) {
    var sum = 0;
    for (var i = 0; i < list.length; i++) {
        sum += list[i];
    }
    return sum;
}