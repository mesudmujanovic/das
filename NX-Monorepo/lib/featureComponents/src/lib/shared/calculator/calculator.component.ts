import { CalculationService } from '../../../../../busines/src/lib/service/calculator/index';
import { NumberLetterStateService } from '../../../../../busines/src/lib/service/number-letter/index';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss',
})
export class CalculatorComponent {
  private calculationService = inject(CalculationService);
  private numberStateService = inject(NumberLetterStateService);
  constructor(){}

  ngOnInit() {
    this.numberStateService.fetchNumbers();
  }

  get toShow(): string {
    return this.calculationService.toShow;
  }

  set toShow(value: string) {
    this.calculationService.toShow = value;
  }
  equals() {
      const [number1, number2, number3, number4, number5, number6, result] = this.numberStateService.getNumbers();

      this.calculationService.equals({
        number1: number1 ?? 0,
        number2: number2 ?? 0,
        number3: number3 ?? 0,
        number4: number4 ?? 0,
        number5: number5 ?? 0,
        number6: number6 ?? 0,
        result: result ?? 0
      });
  }

  writeToInput(value: string) {
    this.calculationService.writeToInput(value);
  }

  clear() {
    this.calculationService.clear();
  }

  back() {
    this.calculationService.back();
  }
}
