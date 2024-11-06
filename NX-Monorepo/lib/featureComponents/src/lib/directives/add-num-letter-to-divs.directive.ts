import { Directive, ElementRef, HostListener, inject, Input, QueryList, Renderer2 } from '@angular/core';
import { NumberLetterStateService } from 'lib/busines/src/lib/service/number-letter';

@Directive({
  selector: '[libAddNumLetterToDivs]',
  standalone: true,
})
export class AddNumLetterToDivsDirective {
  private numberStateService = inject(NumberLetterStateService);
  private renderer = inject(Renderer2);
  @Input() currentDivIndex: number = 0;
  @Input() counterButton: number = 0;
  @Input() numDivs: QueryList<ElementRef> = new QueryList<ElementRef>();
  @Input() containerCalc: ElementRef | undefined;
  @Input() operationType: 'numbers' | 'letters' = 'numbers';

  @HostListener('click') onClick() {
    let currentContent: any = "";
    const currentDiv = this.numDivs.toArray()[this.currentDivIndex - 1]?.nativeElement;

    const dataSource = this.operationType === 'numbers'
      ? currentContent = (this.numberStateService.numbers as any)['number' + this.currentDivIndex]?.toString() ?? ''
      : currentContent = this.numberStateService.letters[this.currentDivIndex]?.toString();

    if (currentDiv) {
      const spinClass = this.operationType === 'numbers' ? 'numSpin' : 'letterSpin'.toString();
      if (currentDiv.classList.contains(spinClass)) {
        currentDiv.textContent = currentContent;
        this.renderer.removeClass(currentDiv, spinClass);
        this.currentDivIndex++;
        const nextDiv = this.numDivs.toArray()[this.currentDivIndex - 1]?.nativeElement;
        if (nextDiv) {
          this.renderer.addClass(nextDiv, spinClass);
        }
      } else {
        this.renderer.addClass(currentDiv, spinClass);
      }
    }
  }}
