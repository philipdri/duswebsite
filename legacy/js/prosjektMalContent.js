function addProsjektContent(title, pictureArray, infoListArray, articletxt) {
  let pageTitle = document.getElementsByTagName("title");
  pageTitle[0].innerHTML = "Dus | " + title;

  let h1 = document.getElementsByTagName("h1");
 /* h1[0].innerHTML = title;*/

  let galleri = document.getElementById("galleri");
  let sscontainer = document.getElementById("slideshow-container");
  for (let i = 0; i < pictureArray.length; i++) {
    let myslides = document.createElement("div");
    myslides.setAttribute("class", "mySlides fade");
    let img = document.createElement("img");
    img.setAttribute("src", pictureArray[i][0]);
    img.setAttribute("alt", pictureArray[i][1]);
    let p = document.createElement("p");
    p.innerHTML = pictureArray[i][1];

    myslides.appendChild(img);
    myslides.appendChild(p);
    sscontainer.appendChild(myslides);
  }

  let info = document.getElementsByTagName("ul")[1];
  for (let i = 0; i < infoListArray.length; i++) {
    let li = document.createElement("li");
    let p1 = document.createElement("p");
    let p2 = document.createElement("p");
    p1.innerHTML = infoListArray[i][0];
    p2.innerHTML = infoListArray[i][1];
    li.appendChild(p1);
    li.appendChild(p2);
    info.appendChild(li);
  }

  let article = document.getElementsByTagName("article")[0];
  let p = document.createElement("p");
  p.innerHTML = articletxt;
  article.appendChild(p);
}
