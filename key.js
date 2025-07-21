const myBox = document.getElementById("myBox");
const moveAmount = 1;
let x = 0;
let y = 0;


document.addEventListener("keydown", event => {
    if (event.key.startsWith("Arrow")) {

        switch (event.key) {
            case "ArrowUp":
                y -= moveAmount;
                break;
            case "ArrowDown":
                y += moveAmount;
                break;
            case "ArrowRight":
                x += moveAmount;
                break;
            case "ArrowLeft":
                x -= moveAmount;
                break;
        }
        myBox.style.top = `${y}px`;
        myBox.style.left = `${x}px`;
    }
});

