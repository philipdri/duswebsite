"use strict";

let slideIndex1 = 0;

showslides(slideIndex1);

function plusSlides(n) {
  slideIndex1 += n;
  showslides(slideIndex1);
}

function showslides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");

  if (n + 1 > slides.length) {
    slideIndex1 = 0;
  }
  if (n < 0) {
    slideIndex1 = slides.length - 1;
  }

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  slides[slideIndex1].style.display = "block";
}
