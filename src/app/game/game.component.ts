import { Component } from '@angular/core';

@Component({
  selector: 'app-game',
  imports: [],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {

  // General Settings
  gameTitle = 'Hi & Lo';
  cardTypes = ['hearts', 'spades', 'clubs', 'diamonds'];

  // Game Status
  isGameOver = false;

  // Game Data
  cardNumber = 0;
  cardTypeNo = -1;
  lastCardNumber = -1;
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
  }

  newGame() {
    this.isGameOver = false;
    this.score = 0;
    this.noStrakes = 0;
    this.timeLeft = 2 * 60 * 1000; // 2 minutes
    this.generateCard();
    this.drawCard();
    this.passTime();
  }

  generateCard() {
    this.lastCardNumber = this.cardNumber;
    // [0; 1) * 13 + 2 => [2; 15)
    this.cardNumber = Math.floor(Math.random() * 13 + 2);
    // [0; 1) => [0; 4)
    this.cardTypeNo = Math.floor(Math.random() * 4);
    console.log(this.cardTypes[this.cardTypeNo]);
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
  }

  loadGame() {
    this.score = Number(localStorage.getItem('score'));
    this.timeLeft = Number(localStorage.getItem('timeLeft'));
    this.cardNumber = Number(localStorage.getItem('cardNumber'));
    this.cardTypeNo = Number(localStorage.getItem('cardTypeNo'));
    this.noStrakes = Number(localStorage.getItem('noStrakes'));
    this.drawCard();
    this.passTime();
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
      this.timeLeft += 10 * 1000;
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
    let response = confirm('Game Over! Start a new game?');
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
    console.log(`seconds: ${seconds}`);
    let minutes = Math.floor(seconds / 60);
    console.log(`minutes: ${minutes}`);

    let secondsInMinutes = minutes * 60;
    let diffSeconds = seconds - secondsInMinutes;
    console.log(`dif seconds: ${diffSeconds}`);

    this.humanTimeLeft = `${minutes > 0 ? minutes + ' min, ' : ''}${diffSeconds} sec`;
  }

}

