
for (let element of document.querySelectorAll(".drum")) {
    element.addEventListener("click", function () {
        makeSound(element.innerHTML);
        buttonAnimation(element.innerHTML);
    });
}

document.addEventListener("keydown", function (event) {
    makeSound(event.key);
    buttonAnimation(event.key);
});

function makeSound(key) {
    switch (key) {
        case "w":
            playSound("sounds/tom-1.mp3");
            break;
        case "a":
            playSound("sounds/tom-2.mp3");
            break;
        case "s":
            playSound("sounds/tom-3.mp3");
            break;
        case "d":
            playSound("sounds/tom-4.mp3");
            break;
        case "j":
            playSound("sounds/snare.mp3");
            break;
        case "k":
            playSound("sounds/crash.mp3");
            break;
        case "l":
            playSound("sounds/kick-bass.mp3");
            break;
        default:
            console.log(element);
            break;
    }
}

function playSound(soundFile) {
    var audio = new Audio(soundFile);
    audio.play();
}

function buttonAnimation(key) {
    document.querySelector("." + key).classList.add("pressed");
    setTimeout(() => {
        document.querySelector("." + key).classList.remove("pressed");
    }, 100);
}
