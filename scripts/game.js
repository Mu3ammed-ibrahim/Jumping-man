displayElement = document.querySelector("#display");

console.log(displayElement);

let character = document.createElement("div");

character.setAttribute("style", "position: absolute; bottom: 10px; left: 10px; height: 50px; width: 50px; background-color: blue");

displayElement.appendChild(character);



