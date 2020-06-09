/* Code taken from https://gosink.in/bubble-sort-css-javascript-animation/ and modified for our purposes */

const container = document.querySelector(".animation-container");
var pauseButtonClicked = false;

function generateBlocks(num) {
  if (num && typeof num !== "number") {
    alert("First argument must be a typeof Number");
    return;
  }
  container.innerHTML=``;
  for (let i = 0; i < num; i += 1) {
    const value = Math.floor(Math.random() * 99) + 1;

    const block = document.createElement("div");
    block.classList.add("block");
    block.style.height = `${value * 3}px`;
    block.style.transform = `translateX(${i * 30}px)`;

    const blockLabel = document.createElement("label");
    blockLabel.classList.add("block__id");
    blockLabel.innerHTML = value;

    block.appendChild(blockLabel);
    container.appendChild(block);
  }
}

function swap(el1, el2) {
  return new Promise(resolve => {
    const style1 = window.getComputedStyle(el1);
    const style2 = window.getComputedStyle(el2);

    const transform1 = style1.getPropertyValue("transform");
    const transform2 = style2.getPropertyValue("transform");

    el1.style.transform = transform2;
    el2.style.transform = transform1;

    // Wait for the transition to end!
    window.requestAnimationFrame(function() {
      setTimeout(() => {
        container.insertBefore(el2, el1);
        resolve();
      }, 250);
    });
  });
}

pauseButton = document.getElementById('animation-pause');
pauseButton.addEventListener('click', function() {
    pauseButtonClicked = true;
});

function getPauseButtonStatus() {
    return pauseButtonClicked;

}

async function bubbleSort(delay) {
  if (delay && typeof delay !== "number") {
    return;
  }
  let blocks = document.querySelectorAll(".block");
  for (let i = 0; i < blocks.length - 1; i++) {
    for (let j = 0; j < blocks.length - i - 1; j++) {
      blocks[j].style.backgroundColor = "#FF4949";
      blocks[j + 1].style.backgroundColor = "#FF4949";

      resetButton.disabled = true;

      const paused = await getPauseButtonStatus();
        if (paused == true) {
          pauseButtonClicked = false;
          playButton.disabled = false;
          resetButton.disabled = false;
          return;
        }

      await new Promise(resolve =>
        setTimeout(() => {
          resolve();
        }, delay)
      );

      const value1 = Number(blocks[j].childNodes[0].innerHTML);
      const value2 = Number(blocks[j + 1].childNodes[0].innerHTML);

      if (value1 > value2) {
        await swap(blocks[j], blocks[j + 1]);
        blocks = document.querySelectorAll(".block");
      }

      blocks[j].style.backgroundColor = "#58B7FF";
      blocks[j + 1].style.backgroundColor = "#58B7FF";
    }

    blocks[blocks.length - i - 1].style.backgroundColor = "#13CE66";
  }
  playButton.disabled = false;
  resetButton.disabled = false;
}

generateBlocks(10);

var playButton = document.getElementById('animation-play');
playButton.addEventListener('click', function() {
    bubbleSort(100);
});

var resetButton = document.getElementById('animation-reset');

var slider = document.getElementById('numblocks');
var sliderOutputValue = document.getElementById("slider-value");
sliderOutputValue.innerHTML = slider.value;

slider.oninput = function() {
  sliderOutputValue.innerHTML = this.value;
}

resetButton.addEventListener('click', function() {
    var number = parseInt(slider.value, 10);
    generateBlocks(number);
});



