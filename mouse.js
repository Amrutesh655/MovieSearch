const myBox = document.getElementById("myBox");


//click
/*function changeColor(event) {
    event.target.style.backgroundColor = "black";
    event.target.textContent = "😒";
}
myBox.addEventListener("click", changeColor);*/

// mouseover
myBox.addEventListener("mouseover", event => {
    event.target.style.backgroundColor = "black";
    event.target.textContent = "😒";
});

//mouseout
myBox.addEventListener("mouseout", event => {
    event.target.style.backgroundColor = "red";
    event.target.textContent = "😒";
});