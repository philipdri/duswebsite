"use strict";
const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector(".menu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  menu.classList.toggle("active");
});

document.querySelectorAll(".nav-link").forEach((n) =>
  n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    menu.classList.remove("active");
  })
);

function addToPortfolio(image, imgtext, location, url) {
  let portfolio = document.getElementById("portfolio");
  let port = document.createElement("div");
  port.setAttribute("class", "port");

  let container = document.createElement("div");
  container.setAttribute("class", "container");

  let a = document.createElement("a");
  container.setAttribute("href", url);

  let img = document.createElement("img");
  img.setAttribute("src", image);
  img.setAttribute("class", "image");
  img.setAttribute("alt", "prosjektbilde");
  a.appendChild(img);
  container.appendChild(a);

  let p = document.createElement("p");
  p.setAttribute("class", "imgtext");
  p.innerHTML(location);
  container.appendChild(p);

  port.appendChild(container);

  let h3 = document.createElement("h3");
  h3.innerHTML(imgtext);

  port.appendChild(h3);

  portfolio.appendChild(port);
}
