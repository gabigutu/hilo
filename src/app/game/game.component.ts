import { Component } from '@angular/core';
import { Winner } from '../helpers/winner';
import { HighScoresComponent } from '../high-scores/high-scores.component';

@Component({
  selector: 'app-game',
  imports: [HighScoresComponent],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {

  // General Settings
  gameTitle: string = 'Hi & Lo';
  cardTypes: string[] = ['hearts', 'spades', 'clubs', 'diamonds'];
  deck: number[][] = []; // [[2, 0], [2, 1], [2, 2], ..., [5, 0], [5, 1]] // 6 * 52 = 312

  // Game Status
  isGameOver = false;

  winners: Winner[] = [];

  // Game Data
  cardNumber: number = 0;
  cardTypeNo: number = -1;
  lastCardNumber: number = -1;
  score: number = 0;
  timeLeft = 0;
  timeLeftInterval: any = null;
  noStrakes = 0;

  guessedHi = false;

  // View Data
  cardSrc = '';
  animationGuessClasses = '';
  animationScore = '';
  humanTimeLeft = 'Loading...';
  scoreClass = '';

  ngOnInit() {
    // this.newGame();
    this.loadGame();
    this.loadWinners();
  }

  fillDeck(noDecks = 1) { // fill one deck
    let deck = [];
    for (let k = 1; k <= noDecks; k++) {
      for (let i = 2; i <= 14; i++) {
        for (let j = 0; j < 4; j++) {
          let card = [i, j];
          deck.push(card);
        }
      }
    }
    return deck;
  }

  newGame() {
    this.isGameOver = false;
    this.deck = this.fillDeck(6);
    console.log(this.deck);
    this.score = 0;
    this.noStrakes = 0;
    this.timeLeft = 2 * 60 * 1000; // 2 minutes
    this.generateCard();
    this.drawCard();
    this.passTime();
  }

  generateCard() {
    // get a random card from this.deck
    this.lastCardNumber = this.cardNumber;

    let index = Math.floor(Math.random() * this.deck.length); // [0; 1) => [0; deck_length)
    this.cardNumber = this.deck[index][0]; // [8, 2] // [12, 1]
    this.cardTypeNo = this.deck[index][1];
    console.log(this.cardTypes[this.cardTypeNo]);

    // remove card from deck
    // remove element from pos index from this.deck array
    this.deck.splice(index, 1);
    console.log('index = ' + index);
    console.log(this.deck);
  }

  drawCard() {
    this.cardSrc = `${this.cardNumber}_of_${this.cardTypes[this.cardTypeNo]}.svg`;
  }

  saveGame() {
    localStorage.setItem('score', this.score.toString());
    localStorage.setItem('timeLeft', this.timeLeft.toString());
    localStorage.setItem('cardNumber', this.cardNumber.toString());
    localStorage.setItem('cardTypeNo', this.cardTypeNo.toString());
    localStorage.setItem('noStrakes', this.noStrakes.toString());
    localStorage.setItem('deck', JSON.stringify(this.deck));
  }

  loadGame() {
    this.score = Number(localStorage.getItem('score'));
    this.timeLeft = Number(localStorage.getItem('timeLeft'));
    this.cardNumber = Number(localStorage.getItem('cardNumber'));
    this.cardTypeNo = Number(localStorage.getItem('cardTypeNo'));
    this.noStrakes = Number(localStorage.getItem('noStrakes'));
    let tmpDeck = localStorage.getItem('deck');
    if (tmpDeck == null) {
      this.deck = [];
    } else {
      this.deck = JSON.parse(tmpDeck);
    }
    this.drawCard();
    this.passTime();
  }

  loadWinners() {
    // load string value from "winners" key in local storage

    let winnersAsJson = localStorage.getItem('winners');
    if (winnersAsJson == null) {
      winnersAsJson = '';
    }
    // convert json string to object (array)
    const winnersLS = JSON.parse(winnersAsJson);

    // set winners in component
    this.winners = winnersLS;
  }

  saveWinners() {
    // convert winners object (array) to json string
    let winnersAsJson = JSON.stringify(this.winners);
    // save this string to the "winners" key in local storage
    localStorage.setItem('winners', winnersAsJson);
  }

  decreaseScore() {
    this.score--;
    this.noStrakes = 0;
    if (this.score <= 0) {
      this.gameOver();
    }
    this.animateWrong();
  }

  increaseScore() {
    this.score++;
    this.noStrakes++;
    if (this.noStrakes % 5 == 0) {
      this.timeLeft += 10 * 1000; // add 10 more seconds
    }
    this.animateCorrect();

  }

  checkCards() {
    if (this.guessedHi) { // if guessed hi
      if (this.cardNumber >= this.lastCardNumber) {
        this.increaseScore();
      } else {
        this.decreaseScore();
      }
    } else { // else (guess lo)
      if (this.cardNumber <= this.lastCardNumber) {
        this.increaseScore();
      } else {
        this.decreaseScore();
      }
    }
  }

  guessHi() {
    if (this.isGameOver) return;
    this.guessedHi = true;
    console.log('guess higher');
    this.generateCard();
    this.drawCard();
    this.checkCards();
  }

  guessLo() {
    if (this.isGameOver) return;
    this.guessedHi = false;
    console.log('guess lower');
    this.generateCard();
    this.drawCard();
    this.checkCards();
  }

  animateWrong() {
    this.animationGuessClasses = 'animate__animated animate__shakeX';
    this.animationScore = 'animate__animated animate__flash guessed-wrong';
    // remove wrong class after 1 sec
    setTimeout(() => {
      this.animationGuessClasses = '';
      this.animationScore = '';
    }, 1000);
  }

  animateCorrect() {
    this.animationGuessClasses = 'animate__animated animate__heartBeat';
    this.animationScore = 'animate__animated animate__flash guessed-correct';
    // remove wrong class after 1 sec
    setTimeout(() => {
      this.animationGuessClasses = '';
      this.animationScore = '';
    }, 1000);
  }

  gameOver() {
    this.isGameOver = true;
    this.timeLeft = 0;
    clearInterval(this.timeLeftInterval);
    this.saveGame();
    this.cardSrc = 'red_joker.svg';
    this.scoreClass = 'guessed-wrong';
    // do you want to save score?
    let name = prompt("Would you like to save score? Write your name:");
    if (name != null) {
      this.addWinner(name, this.score);
      this.saveWinners();
    }
    this.confirmNewGame('Game Over! Start a new game?');
  }

  addWinner(name: string, score: number) {
    if (name.length == 0) return;
    if (score <= 0) return;

    // add new Winner to winners array
    let winner: Winner = {} as Winner;
    winner.name = name;
    winner.score = score;

    this.winners.push(winner);
  }

  confirmNewGame(message: string) {
    let response = confirm(message);
    if (response == true) {
      this.newGame();
    }
  }

  passTime() {
    this.timeLeftInterval = setInterval(() => {
      // console.log('a mai trecut o secunda');
      this.timeLeft -= 1000;
      if (this.timeLeft <= 0) {
        this.gameOver();
      }
      this.computeHumanTimeLeft();
      this.saveGame();
    }, 1000);
  }

  computeHumanTimeLeft() {
    let seconds = this.timeLeft / 1000;
    // console.log(`seconds: ${seconds}`);
    let minutes = Math.floor(seconds / 60);
    // console.log(`minutes: ${minutes}`);

    let secondsInMinutes = minutes * 60;
    let diffSeconds = seconds - secondsInMinutes;
    // console.log(`dif seconds: ${diffSeconds}`);

    this.humanTimeLeft = `${minutes > 0 ? minutes + ' min, ' : ''}${diffSeconds} sec`;
  }

}

