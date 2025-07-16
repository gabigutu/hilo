import { Component } from '@angular/core';

@Component({
  selector: 'app-game',
  imports: [],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {

  gameTitle = 'Hi & Lo';
  cardNumber = 0;
  lastCardNumber = -1;
  score = 0;
  cardTypes = ['hearts', 'spades', 'clubs', 'diamonds'];
  cardSrc = '';
  guessedHi = false;
  animationGuessClasses = '';
  animationScore = '';
  timeLeft = 5 * 60 * 1000; // 5 minutes

  ngOnInit() {
    this.newGame();
  }

  newGame() {
    this.generateCard();
    this.passTime();
  }

  generateCard() {
    this.lastCardNumber = this.cardNumber;
    // [0; 1) * 13 + 2 => [2; 15)
    this.cardNumber = Math.floor(Math.random() * 13 + 2);
    // [0; 1) => [0; 4)
    let cardTypeNo = Math.floor(Math.random() * 4);
    console.log(this.cardTypes[cardTypeNo]);
    // this.cardSrc = '2_of_clubs.svg';
    this.cardSrc = `${this.cardNumber}_of_${this.cardTypes[cardTypeNo]}.svg`;
  }

  checkCards() {
    if (this.guessedHi) { // if guessed hi
      if (this.cardNumber >= this.lastCardNumber) {
        // increase score
        this.score++;
        this.animateCorrect();
      } else {
        // decrease score
        this.score--;
        this.animateWrong();
      }
    } else { // else (guess lo)
      if (this.cardNumber <= this.lastCardNumber) {
        // increase score
        this.score++;
        this.animateCorrect();
      } else {
        // decrease score
        this.score--;
        this.animateWrong();
      }
    }
  }

  guessHi() {
    this.guessedHi = true;
    console.log('guess higher');
    this.generateCard();
    this.checkCards();
  }

  guessLo() {
    this.guessedHi = false;
    console.log('guess lower');
    this.generateCard();
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

  passTime() {
    setInterval(() => {
        // console.log('a mai trecut o secunda');
        this.timeLeft -= 1000;
      }, 1000);
  }

}

