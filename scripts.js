/**
 * This function renders preview cards
 */
// function renderModules() {

//   // get data from json
//   // insert data into template
//   // create cards and append DOM
//   var temp = document.getElementsByTagName("template")[1];
//   var clon = temp.content.cloneNode(true);

//   // document.body.appendChild(clon);
//   // console.log(clon);
//   var thumbnail = document.getElementById("big-box");
//   thumbnail.appendChild(clon);
//   // thumbnail.innerHTML = clon;
// }
const scrollElements = document.querySelectorAll(".js-scroll");
const throttleCount = document.getElementById("throttle-count");
const scrollCount = document.getElementById("scroll-count");

var throttleTimer;

const throttle = (callback, time) => {
  if (throttleTimer) return;

  throttleTimer = true;
  setTimeout(() => {
    callback();
    throttleTimer = false;
  }, time);
};

const elementInView = (el, dividend = 1) => {
  const elementTop = el.getBoundingClientRect().top;

  return (
    elementTop <=
    (window.innerHeight || document.documentElement.clientHeight) / dividend
  );
};

const elementOutofView = (el) => {
  const elementTop = el.getBoundingClientRect().top;

  return (
    elementTop > (window.innerHeight || document.documentElement.clientHeight)
  );
};

const displayScrollElement = (element) => {
  element.classList.add("scrolled");
};

const hideScrollElement = (element) => {
  element.classList.remove("scrolled");
};

const handleScrollAnimation = () => {
  scrollElements.forEach((el) => {
    if (elementInView(el, 1)) {
      displayScrollElement(el);
    } else if (elementOutofView(el)) {
      hideScrollElement(el);
    }
  });
};
var timer = 0;
var count = 0;
var scroll = 0;

window.addEventListener("scroll", () => {
  scrollCount.innerHTML = scroll++;
  throttle(() => {
    handleScrollAnimation();
    throttleCount.innerHTML = count++;
  }, 250);
});

// bouton pour remonter la page
let mybutton = document.getElementById("go-up");

// When the user scrolls down ()px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (
    document.body.scrollTop > 2700 ||
    document.documentElement.scrollTop > 2700
  ) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}
mybutton.addEventListener("click", topFunction);
// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTo({ top: 0, behavior: "smooth" }); // For Safari
  document.documentElement.scrollTo({ top: 0, behavior: "smooth" }); // For Chrome, Firefox, IE and Opera
}

// document.getElementById("1").onclick = function () {
//   var barDiv = document.createElement('div');
//   barDiv.className = "barDiv";
//   document.getElementById('1').appendChild(barDiv);
// }

//greensock
gsap.registerPlugin(Flip, Draggable);

const fullSize = document.querySelector(".full-size"),
  thumbnail = document.querySelector(".thumbnail"),
  article = document.querySelector(".scroll-section");

Draggable.create(thumbnail);
Draggable.create(fullSize);

article.addEventListener("click", () => {
  const state = Flip.getState(".thumbnail, .full-size");
  fullSize.classList.toggle("active");
  thumbnail.classList.toggle("active");

  Flip.from(state, {
    duration: 0.1,
    fade: true,
    absolute: true,
    toggleClass: "flipping",
    ease: "power1.inOut",
  });
  // renderModules();
});

var line = document.getElementById("line");
var length = line.getTotalLength();

// The start position of the drawing
line.style.strokeDasharray = length;

// Hide the triangle by offsetting dash. Remove this line to show the triangle before scroll draw
line.style.strokeDashoffset = length;

// Find scroll percentage on scroll (using cross-browser properties), and offset dash same amount as percentage scrolled
window.addEventListener("scroll", myFunction);

function myFunction() {
  var scrollpercent =
    (document.body.scrollTop + document.documentElement.scrollTop) /
    (document.documentElement.scrollHeight -
      document.documentElement.clientHeight);

  var draw = length * scrollpercent * 0.85;

  // Reverse the drawing (when scrolling upwards)
  line.style.strokeDashoffset = length - draw;
}

var json = null;

async function loadJsonAndFillCards(_id) {
  if (json == null) {
    try {
      const response = await fetch("data.json"); // Fetch the JSON file
      json = await response.json(); // Parse the JSON response

      fillCards(_id, json.bars); // Call the 'fillCards' function with the JSON data
    } catch (error) {
      console.error(error);
    }
  }
}

function fillCards(templateId, jsonBars) {
  // Get the HTML template
  const template = document.querySelector(`#${templateId}`);
  // Clone the template content
  jsonBars.forEach((bar) => {
    // Clone the template content
    const previewCard = template.content.cloneNode(true);
    // Get the card content elements
    const title = previewCard.querySelector(".title");

    if (title) {
      title.textContent = bar.name;
    }

    const tags = previewCard.querySelector(".tags");
    if (tags) {
      tags.innerHTML = bar.tags
        .map((tag) => `<span class="tag">${tag}</span>`)
        .join("");
    }

    const description = previewCard.querySelector(".description");
    if (description) {
      description.innerHTML = bar.detail;
    }

    const address = previewCard.querySelector(".container:nth-child(1)");
    if (address) {
      address.innerHTML = `<p><span class='nobr'>${bar.address.addressLine1}</span></p><p>${bar.address.zip} ${bar.address.city}</p>`;
    }

    const openHours = previewCard.querySelector(".container:nth-child(2)");
    if (openHours) {
      openHours.innerHTML = `<p><span class='nobr'>${bar.openDay}</span></p><p><span class='nobr'>${bar.openTime}</span></p>`;
    }

    const transports = previewCard.querySelector(".container:nth-child(3)");
    if (transports) {
      transports.innerHTML = `<div class='directions'<p>${bar.transports.join(" ")}</p></br><p><span class='nobr'>${bar.metroStationName}</p></span></div>`;
    }

    // Add the preview card to the document
    const preview = document.getElementById("bar_"+bar.id.toString());
    if (preview) {
      preview.appendChild(previewCard);
    }
  });
}

loadJsonAndFillCards("small-card");
