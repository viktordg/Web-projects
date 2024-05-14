function rollDice() {
    // Generate a random number between 1 and 6
    return Math.floor(Math.random() * 6) + 1;
}
function setImage(element){
    //Sets the correct image

    var randomNumber = rollDice();
    var randomImageSource = "images/dice" + randomNumber + ".png"; 
    //----images/dice1.png - images/dice6.png----

    element.setAttribute("src", randomImageSource);

    return randomNumber;
}
function defineWinner(randomNumber1, randomNumber2){
    if ( randomNumber1 > randomNumber2) {
        document.querySelector("h1").innerHTML = "🚩 Play 1 Wins!";
    }else if (randomNumber2 > randomNumber1) {
        document.querySelector("h1").innerHTML = "Player 2 Wins! 🚩";
    }else {
        document.querySelector("h1").innerHTML = "Draw!";
    }
}

//Get element and update image
const dice1 = document.getElementById("dice1");
const dice2 = document.getElementById("dice2");


defineWinner(setImage(dice1), setImage(dice2));