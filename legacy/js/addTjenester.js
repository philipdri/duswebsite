function addToTjenester(image, h1Text, beskrivelseTekst) {
  // Hent hoveddiv for tjenester
  let tjenester = document.getElementById("tjenester");

  // Opprett tjenesterboks
  let tjenesterboks = document.createElement("div");
  tjenesterboks.setAttribute("class", "tjenesterboks");//div nr 2, med bilde og tekst

  // Opprett containertjenester (tekst-container)
  let containertjenester = document.createElement("div");
  containertjenester.setAttribute("class", "containertjenester");

  // Opprett overskrift (h1)
  let h1 = document.createElement("h1");
  h1.innerHTML = h1Text;

  //tjenesterboks.appendChild(h1);

  // Opprett beskrivelse
  let beskrivelseDiv = document.createElement("div");
  beskrivelseDiv.setAttribute("class", "beskrivelse");
  beskrivelseDiv.innerHTML = beskrivelseTekst;

  // Legg til h1 og beskrivelse inne i containertjenester
  containertjenester.appendChild(h1);
  containertjenester.appendChild(beskrivelseDiv);

  // Opprett bilde-element
  let img = document.createElement("img");
  img.setAttribute("src", image);
  img.setAttribute("class", "imagetjenester");
  img.setAttribute("alt", "tjenestebilde");

  // Legg til containertjenester først, deretter img i tjenesterboks
  tjenesterboks.appendChild(containertjenester); // Teksten først
  tjenesterboks.appendChild(img);// Bildet til høyre

  // Legg tjenesterboks til hoveddiven
  tjenester.appendChild(tjenesterboks);
}

