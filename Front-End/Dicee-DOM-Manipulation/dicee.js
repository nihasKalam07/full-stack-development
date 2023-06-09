const numberOfFaces = 6

window.addEventListener("load", setUpScreen);


function setUpScreen() {
    console.log("Hello");
    var dice1Face = generateRandom();
    var dice2Face = generateRandom();
    console.log(dice1Face);
    console.log(dice2Face);
    setHeader(dice1Face, dice2Face);
    setDiceFaces(dice1Face, dice2Face);
}

function setDiceFaces(dice1Face, dice2Face) {
    document.querySelector(".img1").setAttribute("src", "images/dice" + dice1Face + ".png");
    document.querySelector(".img2").src = "images/dice" + dice2Face + ".png";
}

function setHeader(dice1Face, dice2Face) {
    if (dice1Face > dice2Face) {
        document.querySelector("h1").innerHTML = "🚩Player 1 Wins!";
    } else if (dice2Face > dice1Face) {
        document.querySelector("h1").innerHTML = "Player 2 Wins!🚩";
    } else {
        document.querySelector("h1").innerHTML = "Draw!";
    }
}


function generateRandom() {
    return Math.floor(Math.random() * numberOfFaces) + 1;
}

