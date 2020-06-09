"use strict";

function addSmoothScroll() {
  // Add to all <a> tags
  $("a").on('click', function(event) {

    // check this.hash has a value before overriding default behavior
    if (this.hash !== "") {

      // Store hash
      var hash = this.hash;

      // jQuery animate() method
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 500, function(){

        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
      return false;
    }
  });
}

// Hide the placeholder image, show the embedded video
function setupVideos() {
  $('.video-placeholder').on('click', function() {
      console.log("clicked");

      // Get id of the placeholder clicked, stop displaying it
      var id = $(this).attr('id');
      var placeholder = document.getElementById(id);
      placeholder.style.display = 'none';

      // Get video of respective placeholder, start showing it
      var video = document.getElementById(id + '-video');
      video.style.display = 'inline-block';
  });
}

function addWaypoints(element, startPos) {
    let waypoint = new Waypoint({
      element: element,
      handler: function() {
            element.style.visibility = 'visible';
            anime({
                targets: element,
                duration: 4000,
                easing: 'easeOutExpo',
                translateX: [startPos, 0],
                opacity: [0, 1],
                delay: 200,
            })

            this.destroy();
      },
        offset: '100%',
    })
}

window.onload = function() {
    setupVideos();
    addSmoothScroll();

    // Get all elements tagged with 'waypoint'
    var waypoints = document.querySelectorAll('.waypoint');
    waypoints.forEach((element) => {
        addWaypoints(element, -100);
    });
}