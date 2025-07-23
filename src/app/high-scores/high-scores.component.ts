import { Component, Input } from '@angular/core';
import { Winner } from '../helpers/winner';

@Component({
  selector: 'app-high-scores',
  imports: [],
  templateUrl: './high-scores.component.html',
  styleUrl: './high-scores.component.css'
})
export class HighScoresComponent {

  @Input()
  winners: Winner[] = [];

}
