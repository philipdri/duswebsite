  function addToPortfolio(image, h3Text, imgtext, url) {
  let portfolio = document.getElementById("portfolio");
  let port = document.createElement("div");
  port.setAttribute("class", "port");

  let container = document.createElement("div");
  container.setAttribute("class", "container");

  let a = document.createElement("a");
  a.setAttribute("href", url);

  let img = document.createElement("img");
  img.setAttribute("src", image);
  img.setAttribute("class", "image");
  img.setAttribute("alt", "prosjektbilde");
  a.appendChild(img);
  container.appendChild(a);

  // Legg til tekst-div for bildeteksten
  let imgTextDiv = document.createElement("div");
  imgTextDiv.setAttribute("class", "imgtext");
  imgTextDiv.innerHTML = imgtext;
  a.appendChild(imgTextDiv); //slutt bildetekst add

// Legg "a" inni container
container.appendChild(a);

  port.appendChild(container);

  let h3 = document.createElement("h3");
  h3.innerHTML = h3Text;
  port.appendChild(h3);

  portfolio.appendChild(port);
}


//animasjon port
const elements = document.querySelectorAll('.port');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'animate-in 2s ease-out forwards';  // Kjør animasjonen
    } else {
      entry.target.style.animation = 'none';  // Stopper animasjonen hvis elementet forsvinner
    }
  });
}, { threshold: 0.1 });  // 10% av elementet må være synlig for å trigge

elements.forEach((el) => observer.observe(el));