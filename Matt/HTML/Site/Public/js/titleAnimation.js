"use strict";


function animatePath(path) {
    console.log(path);
    anime({
      targets: path,
      fill: '#f0f5fa',
      easing: 'linear',
      duration: 2000,
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
    console.log(paths.length);
    paths.forEach(path => animatePath(path));
    document.getElementById("webpage-title").addEventListener('mouseover', function() {
        paths.forEach(path => animatePath(path)) }
    );

});
