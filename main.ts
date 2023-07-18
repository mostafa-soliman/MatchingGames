//#region Imports
import { ICard } from "./dist/models/card.model.js";
import { IPerpare } from "./dist/models/perpare.model.js";
//#endregion

//#region variables Declaration
const prepare: IPerpare = {};
prepare.progress = 0;
// prepare.fullTrack=new Audio('./assets/audio');
prepare.flipAudio = new Audio("./assets/audio/flip.wav");
prepare.goodAudio = new Audio("./assets/audio/secsses.wav");
prepare.gameOverAudio = new Audio("./assets/audio/gameover.wav");

const numberOfCards = 20;
const TempNumbers = [];
let cardsHtmlContent = "";
//#endregion

//#region function Declaration
const getRandomInt = (min, max) => {
  let result: number;
  let exists = true;
  min = Math.ceil(min);
  max = Math.floor(max);
  while (exists) {
    result = Math.floor(Math.random() * (max - min + 1)) + min;
    if (!TempNumbers.find((no) => no === result.toString())) {
      exists = false;
      TempNumbers.push(result.toString());
    }
  }
  return result;
};
const toggleFlip = (index) => {
  prepare.fullTrack.play();
  const card = prepare.cards[index];
  if (!card.flip && card.clickable) {
    flip(card, index);
    selectCard(card, index);
  }
};

const flip = (card: ICard, index: number) => {
  prepare.flipAudio.play();
  if (card) {
    card.flip = card.flip === "" ? "flip" : "";
    document.getElementById(`card-flip-${index}`);
  }
};
const selectCard = (card: ICard, index: number) => {
  if (!prepare.selectedCard_2) {
    prepare.selectedCard_2 = card;
    prepare.selectedIndex_2 = index;
  }
  if (prepare.selectedCard_1 && prepare.selectedCard_2) {
    if (prepare.selectedCard_1.src === prepare.selectedCard_2.src) {
      prepare.selectedCard_1.clickable = false;
      prepare.selectedCard_2.clickable = false;
      prepare.selectedCard_1 = null;
      prepare.selectedCard_2 = null;
      stopAudio(prepare.flipAudio);
      stopAudio(prepare.goodAudio);
      prepare.goodAudio.play();
      changeProgress();
      checkfinish();
    } else {
      setTimeout(() => {
        stopAudio(prepare.flipAudio);
        stopAudio(prepare.goodAudio);
        prepare.flipAudio.play();
        flip(prepare.selectedCard_1, prepare.selectedIndex_1);
        flip(prepare.selectedCard_2, prepare.selectedIndex_2);
        prepare.selectedCard_1 = null;
        prepare.selectedCard_2 = null;
      }, 1000);
    }
  }
};

const stopAudio = (audio: HTMLAudioElement) => {
  if (audio && audio.play) {
    audio.pause();
    audio.currentTime = 0;
  }
};

const changeProgress = () => {
  const progress =
    (prepare.cards.filter((card) => !card.clickable).length / numberOfCards) *
    100;
  const progressElement = document.getElementById("progress");
  progressElement.style.width = `${progress}%`;
  progressElement.innerText = `${progress}%`;
};

const checkfinish = () => {
  if (
    prepare.cards.filter((card) => !card.clickable).length === numberOfCards
  ) {
    // stopAudio(prepare.fullTrack);
    stopAudio(prepare.flipAudio);
    stopAudio(prepare.goodAudio);
    prepare.gameOverAudio.play();
  }
};

//#endregion

//#region Game Logic
for (let index = 0; index < numberOfCards; index++) {
  prepare.cards.push({
    id: getRandomInt(0, numberOfCards),
    src: `./assets/images/${index}.png`,
    flip: "",
    clickable: true,
    index,
  });
  prepare.cards.push({
    id: getRandomInt(0, numberOfCards),
    src: `./assets/images/${index}.png`,
    flip: "",
    clickable: true,
    index,
  });
}

prepare.cards.sort((a, b) => (a.id > b.id ? 1 : -1));

prepare.cards.forEach((item, index) => {
  cardsHtmlContent += `
  <span class="col-sm-3 col-lg-2">
  <!-- card flip -->
  <div onclick="toggleFlip(${index})" class="card-flip">
    <div id="card-flip-${index}">
      <div class="front">
        <!-- front content -->
        <div class="card">
          <img class="card-image" src="./assets/back.webp" alt="">
          <span class="card-contenr">${index + 1}</span>
        </div>
        <div class="back">
          <!-- back content -->
          <img class="" src="./assets/images/${
            item.index
          }.png" alt="Image [100%×180]" data-holder-rended="" srcset="" style="height: 120px;width: 100%;display: block;">
        </div>
      </div>
    </div>
  
  </div>
</span>
  `;
});

document.getElementById("cards").innerHTML = cardsHtmlContent;

//#endregion
