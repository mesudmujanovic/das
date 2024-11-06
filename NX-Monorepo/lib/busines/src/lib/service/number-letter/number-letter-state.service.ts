import { inject, Injectable } from '@angular/core';
import { MyNumberI } from 'lib/domains/src/lib/my-number/interface/my-number-inteface';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { MyNumberService } from '../my-number/my-number.service';

@Injectable({
  providedIn: 'root'
})
export class NumberLetterStateService {
  private myNumberService = inject(MyNumberService);
  private destroy$: Subject<void> = new Subject<void>();
  public numbers: MyNumberI | undefined;
  public letters: string[] = [] ;
  allNumber$: Observable<MyNumberI[]> = this.myNumberService.getAllNumber();
  private resultSubject: BehaviorSubject<number | undefined> = new BehaviorSubject<number | undefined>(undefined);
  result$: Observable<number | undefined> = this.resultSubject.asObservable();

  constructor() {
    this.fetchNumbers();
    // this.getLetter()
  }
  // private letterService: LetterWordService

  // getLetter(): string[] {
  //   this.letterService.getRandomLetterWord().subscribe(a => {
  //     if (a.letters) {
  //       this.letters = a.letters;
  //     }
  //   });
  //   return this.letters
  // }

  fetchNumbers() {
    this.allNumber$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      numbers => {
        if (numbers.length > 0) {
          const randIndex = Math.floor(Math.random() * numbers.length);
          this.numbers = numbers[randIndex];
          this.resultSubject.next(this.numbers.result);
        }
      },
      error => {
        console.error("Error fetching numbers", error);
      }
    );
  }

  getNumbers(): (number | undefined)[] {
    return [this.numbers?.number1, this.numbers?.number2, this.numbers?.number3, this.numbers?.number4, this.numbers?.number5, this.numbers?.number6, this.numbers?.result];
  }

  getResult(): Observable<number | undefined> {
    return this.result$;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
