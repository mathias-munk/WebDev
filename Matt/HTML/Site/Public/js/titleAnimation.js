"use strict";

function animatePath(path) {
    anime({
      targets: path,
      fill: '#f0f5fa',
      easing: 'easeInOutSine',
      duration: 1000,
      direction: 'alternate',
    });
}

$(document).ready(function() {
    var paths = [];
    var pathnum = 4139;
    while (pathnum <= 4335) {
        paths.push("#path" + pathnum);
        pathnum = pathnum + 2;
    }
    paths.forEach(path => animatePath(path));
});
