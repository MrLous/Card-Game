const pathImages = "./src/assets/icons/";

const state = {
    score:{
        duelResults:0,
                playerScore:0,
        computerScore:0,
        drawScore:0,
        scoreBox: document.getElementById("score_points")
    },
    cardSprites:{
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
        lost: document.getElementById("lost"),
        win: document.getElementById("win"),
    },
    fieldCards:{
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card")
    },
    playerSides:{
        player: "player-card",
        playerHand: document.querySelector("#player-card"),
        computer: "computer-card",
        computerHand: document.querySelector("#computer-card"),
    },
    actions:{
        button: document.getElementById("next-duel")
    }
};

const cardData = [
    {
        id:0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: pathImages + "dragon.png",
        WinOf: "Rock",
        LoseOf: "Scissors"
    },{
        id:1,
        name: "Dark Magician",
        type: "Rock",
        img: pathImages + "magician.png",
        WinOf: "Scissors",
        LoseOf: "Paper"
    },{
        id:2,
        name: "Exodia",
        type: "Scissors",
        img: pathImages + "exodia.png",
        WinOf: "Paper",
        LoseOf: "Rock"
    }
];

async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return randomIndex;
}

async function drawSelectCard(index){
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute : "+cardData[index].type;
    state.cardSprites.win.innerText = "Wins from : "+cardData[index].WinOf;
    state.cardSprites.lost.innerText = "Lose to : "+cardData[index].LoseOf;
}

async function removeAllCardImage(){
    let {computerHand, playerHand} = state.playerSides;
    let imgHand = computerHand.querySelectorAll("img");
    imgHand.forEach((img) => img.remove());

    imgHand = playerHand.querySelectorAll("img");
    imgHand.forEach((img) => img.remove());
}

async function checkDuelResults(playerCardId,computerCardId){
    let playerCard = cardData[playerCardId];
    let computerCard = cardData[computerCardId]

    if(playerCard.WinOf == computerCard.type){
        state.score.duelResults= "WIN";
        state.score.playerScore++
    } else if (playerCard.LoseOf == computerCard.type){
        state.score.duelResults = "LOSE";
        state.score.computerScore++
    } else {
        state.score.duelResults = "DRAW";
        state.score.drawScore++;
    }

    playAudio(state.score.duelResults);
    
    return state.score.duelResults
}

async function drawButton(text){
    state.actions.button.innerText = text;
    state.actions.button.style.display= "block";
}

async function updadeScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Draw: ${state.score.drawScore} | Lose: ${state.score.computerScore}`;
}

async function setCardFild(playerCardId){
    await removeAllCardImage();

    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.fieldCards.player.src = cardData[playerCardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(playerCardId, computerCardId);


    await updadeScore();
    await drawButton(duelResults);
}

async function creatCardImage(IdCard, fildSide){

    const cardImg = document.createElement("img");

    cardImg.setAttribute("height", "100px");
    cardImg.setAttribute("src", pathImages+"card-back.png");
    cardImg.setAttribute("data-id", IdCard);

    if(fildSide === state.playerSides.player){
        
        cardImg.classList.add("card");

        cardImg.addEventListener("click", () => {
            setCardFild(cardImg.getAttribute("data-id"));
        });

        cardImg.addEventListener("mouseover", () => {
            drawSelectCard(IdCard);
            cardImg.setAttribute("src",cardData[IdCard].img);
        });
        cardImg.addEventListener("mouseout", () => {
            cardImg.setAttribute("src", pathImages+"card-back.png");
        });
    };

    return cardImg;

}

async function drawCard(cardNumbers, fildSide){
    for (let i = 0; i < cardNumbers; i++){
        const randomIdCard = await getRandomCardId();
        const cardImg = await creatCardImage(randomIdCard, fildSide);

        document.getElementById(fildSide).appendChild(cardImg);
    }
}

async function playAudio(status){
    const audio = new Audio (`./src/assets/audios/${status}.wav`);
    audio.play();
}


async function restDuel(){
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
    state.cardSprites.win.innerText = "pick a card";
    state.cardSprites.type.innerText = "";
    state.cardSprites.lost.innerText = "";
    state.cardSprites.name.innerText = "";

    init();
}

function init() {
    drawCard(5, state.playerSides.player);
    drawCard(5, state.playerSides.computer);

    const music = document.getElementById("backgroudMusic");
    music.play();
}

init();