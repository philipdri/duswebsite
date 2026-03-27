"use strict";
document.addEventListener("DOMContentLoaded", function () {
  let mybutton = document.getElementById("myBtn");
  let slogan = document.getElementById("slogan");
  let portfolio = document.getElementById("portfolio");
  var omoss = document.querySelector(".omoss");
  var activation = portfolio.offsetHeight + 300;
  const scrollDistance = window.scrollY;
  const viewportHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const documentHeight1 = document.body.scrollHeight;
  //logo som scroller

  window.addEventListener("scroll", function () {
    const logo = document.querySelector(".logo");
    const scrollY = window.scrollY;
    const maxScroll = 200; // Hvor langt brukeren må scrolle for at logoen skal flytte seg helt
    const progress = Math.min(scrollY / maxScroll, 1); // Progresjon mellom 0 og 1

    // Dynamisk oppdatering av stil basert på skjermstørrelse
    if (window.innerWidth <= 600) {
      // For mobilskjermer
      logo.style.top = `${50 - 45 * progress}%`; // Flytt fra 50% til 5%
      logo.style.left = `${50 - 45 * progress}%`; // Flytt fra 50% til 5%
      logo.style.transform = `translate(-${50 - 50 * progress}%, -50%)`;
      logo.style.width = `${30 - 15 * progress}%`; // Reduser bredde fra 30% til 15%
    } else {
      // For større skjermer
      logo.style.top = `${50 - 45 * progress}%`; // Flytt fra 50% til 5%
      logo.style.left = `${50 - 45 * progress}%`; // Flytt fra 50% til 5%
      logo.style.transform = `translate(-${50 - 50 * progress}%, -50%)`;
      logo.style.width = `${20 - 15 * progress}%`; // Reduser bredde fra 20% til 5%
    }
  });

  // When the user scrolls down 20px from the top of the document, show the button
  window.onscroll = function () {
    scrollFunction();
  };

  function scrollFunction() {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      mybutton.style.display = "block";
      slogan.style.opacity = "0";
    } else {
      mybutton.style.display = "none";
      slogan.style.opacity = "1";
    }
  }
  const maxScroll = documentHeight - 100; // Stop 100px before the bottom
  const maxScroll1 = documentHeight1 - 100;
  if (scrollDistance >= maxScroll || scrollDistance >= maxScroll1) {
    mybutton.style.bottom = "100px";
  } else {
    mybutton.style.bottom = "40px"; // Default bottom position
  }
});

mybutton.addEventListener("click", function () {
  topFunction();
});

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

document.querySelectorAll("*").forEach((el) => {
  if (el.offsetWidth > document.documentElement.offsetWidth) {
    console.log("Found the worst element ever: ", el);
  }
});
