"use strict";

document.addEventListener('DOMContentLoaded', () => {
    // Add waypoints to all sections on the page
	addWaypoint('#HTML-section', -100);
	addWaypoint('#CSS-section', 100);
	addWaypoint('#JS-section', -100);
	addWaypoint('#PNG-section', 100);
	addWaypoint('#SVG-section', -100);
	addWaypoint('#server-section', 100);
	addWaypoint('#database-section', -100);
	addWaypoint('#dynamic-section', 100);

});

// Creates a waypoint which activates when the user scrolls down
// to the element
function addWaypoint(target, startPos) {
    let waypoint = new Waypoint({
      element: document.querySelector(target),
      handler: function() {
            anime({
                targets: target,
                duration: 3000,
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