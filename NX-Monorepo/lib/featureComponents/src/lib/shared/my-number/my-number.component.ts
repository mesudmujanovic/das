import { Component, ElementRef, inject, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberLetterStateService } from 'lib/busines/src/lib/service/number-letter';
import { Observable } from 'rxjs';
import { CalculatorComponent } from '../calculator/calculator.component';
import { AddNumLetterToDivsDirective } from '../../directives/add-num-letter-to-divs.directive';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'lib-my-number',
  standalone: true,
  imports: [CommonModule, CalculatorComponent, AddNumLetterToDivsDirective],
  templateUrl: './my-number.component.html',
  styleUrl: './my-number.component.scss',
})
export class MyNumberComponent {
  private numberStateService = inject(NumberLetterStateService);

  @ViewChildren('numDiv') numDivs!: QueryList<ElementRef>;
  @ViewChild('containerCalc') containerCalc: ElementRef | undefined;

  currentDivIndex: number = 1;
  public counter: number = 60;
  public toShow: string | undefined;
  public counterButton: number = 0;
  numbers: (number | undefined)[] = [undefined, undefined, undefined, undefined, undefined, undefined];
  result$: Observable<number | undefined>;
  currentPlayer: number = 1;
  playerResults: number[] = [0, 0];
  messageInput: string = '';
  userId: string = "";
  messageList: any[] = [];

  constructor(
  ) {
    this.result$ = this.numberStateService.getResult();
  }
}
