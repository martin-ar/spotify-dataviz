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
  element.scrollTop = 0;
};

const hideScrollElement = (element) => {
  element.classList.remove("scrolled");
  element.scrollTop = 0;
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
let goUp = document.getElementById("go-up");

// When the user scrolls down ()px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (
    document.body.scrollTop > 2400 ||
    document.documentElement.scrollTop > 2400
  ) {
    goUp.style.display = "block";
  } else {
    goUp.style.display = "none";
  }
}
goUp.addEventListener("click", topFunction);
// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTo({ top: 0, behavior: "smooth" }); // For Safari
  document.documentElement.scrollTo({ top: 0, behavior: "smooth" }); // For Chrome, Firefox, IE and Opera
}

var line = document.getElementById("line");
var length = line.getTotalLength();

// The start position of the drawing
line.style.strokeDasharray = length;

// Hide the triangle by offsetting dash. Remove this line to show the triangle before scroll draw
line.style.strokeDashoffset = length;

// Find scroll percentage on scroll (using cross-browser properties), and offset dash same amount as percentage scrolled
window.addEventListener("scroll", drawLine);

function drawLine() {
  var scrollpercent =
    (document.body.scrollTop + document.documentElement.scrollTop) /
    (document.documentElement.scrollHeight -
      document.documentElement.clientHeight);

  var draw = length * scrollpercent * 0.90;

  // Reverse the drawing (when scrolling upwards)
  line.style.strokeDashoffset = length - draw;
}

//JSON
var json = null;
loadJsonAndFillCards("small-card");

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
//Create cards
function fillCards(templateId, jsonBars) {
  // Get the HTML template
  const template = document.querySelector(`#${templateId}`);
  // Clone the template content
  jsonBars.forEach((bar) => {
    // Clone the template content
    const previewCard = template.content.cloneNode(true);
    //Set card bg color
    const card = previewCard.querySelector('.card');
    card.style.backgroundColor = `#${bar.hexColor.primary[1]}`;
    card.style.border = `2px solid #${bar.hexColor.primary[1]}`;

    // Get the card content elements
    const title = previewCard.querySelector(".title");

    if (title) {
      title.textContent = bar.name;
      title.style.color = `#${bar.hexColor.primary[0]}`;
    }

    const tags = previewCard.querySelector(".tags-wrapper");
    if (tags) {
      tags.innerHTML = bar.tags
        .map((tag) => `<span class="tag" style="color:#${bar.hexColor.primary[0]} !important;border-color:#${bar.hexColor.primary[0]} !important;" >${tag}</span>`)
        .join("");
      const knowMoreButton = document.createElement("div");
      knowMoreButton.innerHTML =
        `<span class="button is-primary nobr open-full-size" id="open-bar-${bar.id}" style="background-color:#${bar.hexColor.primary[0]} !important;color:#${bar.hexColor.primary[1]} !important;">En savoir plus sur les playlists...</span>`;
      // knowMoreButton.classList.add("open-full-size");
      tags.appendChild(knowMoreButton);
    }

    const description = previewCard.querySelector(".description");
    if (description) {
      description.innerHTML = bar.detail;
    }
    const aside = previewCard.querySelector('.info');
    const asideColor = bar.name === 'Atomic Cat' ? `#${bar.hexColor.alternative[1]}` : `#${bar.hexColor.primary[0]}`;

    aside.style.backgroundColor = asideColor;
    aside.style.color = '#FFFFFF';

    const address = previewCard.querySelector(".container:nth-child(1)");
    if (address) {
      address.innerHTML = `<p><span class='nobr'>${bar.address.addressLine1}</span><br>${bar.address.zip} ${bar.address.city}</p>`;
    }

    const openHours = previewCard.querySelector(".container:nth-child(2)");
    if (openHours) {
      openHours.innerHTML = `<p><span class='nobr'>${bar.openDay}</span><br><span class='nobr'>${bar.openTime}</span></p>`;
    }

    const transports = previewCard.querySelector(".container:nth-child(3)");
    if (transports) {
      const metroLines = `<p>${bar.transports.join(' ')}</p>`;
      transports.innerHTML = `<div class="directions">${metroLines}<p><span class="nobr">${bar.metroStationName}</p></span></div>`;
    }

    // Add the preview card to the document
    const preview = document.getElementById("bar_" + bar.id.toString());
    if (preview) {
      preview.appendChild(previewCard);
    }
  });
}

//greensock
gsap.registerPlugin(Flip, Draggable);

const scrollSection = document.querySelector(".scroll-section");

scrollSection.addEventListener("click", (event) => {
  var clickedElement = event.target;

  if (clickedElement.classList.contains("open-full-size")) {
    const container = clickedElement.closest(".element-container");
    const fullSize = container.querySelector(".full-size");
    const thumbnail = container.querySelector(".thumbnail");
    const closeButton = container.querySelector(".close-full-size");

    thumbnail.classList.toggle("active");
    fullSize.classList.toggle("active");

    Draggable.create(fullSize);
    Draggable.create(clickedElement);

    clickedElement.fullSize = fullSize;
    clickedElement.thumbnail = thumbnail;
    clickedElement.close = closeButton;

    clickedElement.scrollTop = 0;
    window.addEventListener("mousedown", closeFullSizeHandler);
    closeButton.addEventListener("click", closeFullSizeHandler);
  }
  function closeFullSizeHandler() {
    const fullSize = clickedElement.fullSize;
    const thumbnail = clickedElement.thumbnail;
    const closeButton = clickedElement.close;
  
    closeFullSize(fullSize, thumbnail);
    window.removeEventListener("mousedown", closeFullSizeHandler);
    closeButton.removeEventListener("click", closeFullSizeHandler);
  }
});


function closeFullSize(fullSize, thumbnail) {

  fullSize.scrollTop = 0;
  thumbnail.scrollTop = 0;
  fullSize.classList.toggle("active");
  thumbnail.classList.toggle("active");
}
