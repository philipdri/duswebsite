let slideIndex1 = 0;
let slideIndex2 = 1;
showslides(slideIndex1);
showslides(slideIndex2);

function plusSlides(n) {
  slideIndex1 += n;
  slideIndex2 += n;
  showslides(slideIndex1);
  showslides(slideIndex2);
}

function showslides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");

  if (n + 1 > slides.length) {
    slideIndex1 = 0;
    slideIndex2 = 1;
  }
  if (n < 0) {
    slideIndex1 = slides.length - 2;
    slideIndex2 = slides.length - 1;
  }

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  slides[slideIndex1].style.display = "block";
  slides[slideIndex2].style.display = "block";
}
