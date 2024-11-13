import { StorageService } from './../../../../../../busines/src/lib/service/storage/storage.service';
import { AssociationService } from './../../../../../../busines/src/lib/service/association/index';
import { ChangeDetectorRef, Component, ElementRef, inject, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, EMPTY, interval, map, of, Subject, Subscription, switchMap, takeUntil, tap, timer } from 'rxjs';
import { AssociationI, FieldI } from 'lib/domains/src/lib/association/interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-association',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './association.component.html',
  styleUrl: './association.component.scss',
})
export class AssociationComponent {

  private assocService = inject(AssociationService);
  private sessionStorage = inject(StorageService);
  private renderer = inject(Renderer2);
  private cdr = inject(ChangeDetectorRef);

  @ViewChildren('itemA') itemElementsA!: QueryList<ElementRef>;
  @ViewChildren('itemB') itemElementsB!: QueryList<ElementRef>;
  @ViewChildren('itemC') itemElementsC!: QueryList<ElementRef>;
  @ViewChildren('itemD') itemElementsD!: QueryList<ElementRef>;
  @ViewChild('finall') finall!: ElementRef;
  @ViewChild('timebar') timeBar!: ElementRef;

  private destroy$ = new Subject<void>();
  private associationId: number = 1;
  randIndexAssoc: AssociationI | undefined;
  finallResult: string | undefined;
  itemText: { [key: string]: string[] };
  columnInput: { [key: string]: string } = { A: '', B: '', C: '', D: '' };
  isColumnGuessed: { [key: string]: boolean } = { A: false, B: false, C: false, D: false };
  revealedItems: any = {
    A: [false, false, false, false], B: [false, false, false, false],
    C: [false, false, false, false], D: [false, false, false, false]
  };
  counter: number = 30;

  constructor() {
    this.itemText = {
      A: ["A1", "A2", "A3", "A4"], B: ["B1", "B2", "B3", "B4"],
      C: ["C1", "C2", "C3", "C4"], D: ["D1", "D2", "D3", "D4"]
    };
  }
  private timerSubscription?: Subscription | undefined;

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit() {
    this.startTimer();
    this.assocService.getRandomAssociationOnlyById().pipe(
      takeUntil(this.destroy$),
      switchMap((assocId: number) => {
        this.associationId = 1;
        return this.assocService.getAssociationById(this.associationId);
      })
    ).subscribe();
  }

  private startTimer() {
    this.assocService.getCounter().subscribe(
      serverCounter => {
        this.counter = serverCounter;
        console.log("funkcija", this.counter);        
      }
    )
    const stopAfter30s$ = timer(33000);
    this.timerSubscription = interval(1000).pipe(
      takeUntil(stopAfter30s$),
      tap(() => {
        if (this.counter != null && this.counter > 0) {
          console.log(this.counter);
          this.counter--;
        } else {
          this.timerSubscription?.unsubscribe();
          this.assocService.getAssociationById(1).subscribe((a) => {
            const getFinalSolutionIfGameIsOver = a.finalSolutions;
            this.finalColumn(getFinalSolutionIfGameIsOver);
          });
        }
      })
    ).subscribe();
    interval(1000).pipe(
      takeUntil(stopAfter30s$),
      switchMap(() => this.assocService.getCounter())
    ).subscribe(counterFromServer => {
      this.updateTimerBar(counterFromServer);
      console.log("counterFromServer", counterFromServer);
    });
  }

  private updateTimerBar(counterFromServer: number) {
    const percentage = ((30 - counterFromServer) / 29) * 100;
    const timerBar = this.timeBar.nativeElement as HTMLElement;
    timerBar.style.height = `${percentage}%`;
  }

  private endGame() {
    this.timerSubscription.unsubscribe();
    this.counter = 0; 
    console.log("Tajmer zaustavljen, counter postavljen na 0.");
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  showText(item: string, column: string, index: number): void {
    console.log(this.associationId);

    this.assocService.getPosition(this.associationId, item).pipe(
      map((field: FieldI) => field.text),
      catchError(error => {
        console.error('Greška pri pretrazi:', error);
        return of('');
      }),
      takeUntil(this.destroy$)
    ).subscribe(
      text => {
        this.itemText[column] = this.itemText[column] || [];
        this.itemText[column][index] = text;
        this.revealedItems[column] = this.revealedItems[column] || [];
        this.revealedItems[column][index] = true;
      }
    );
  }

  finalColumn(finallSolution: string): void {
    if (this.associationId === null) {
      console.error("No association ID available");
      return;
    }

    this.assocService.checkFinalSolution(this.associationId, finallSolution).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (result) => {
        console.log('Final solution checked:', result);
        this.sessionStorage.removeItem("randomAssociationId");
        this.assocService.getAssociationById(this.associationId).subscribe(res => {
          if (res) {
            this.associationId = res.id;
            if(this.finallResult !== undefined) {
              this.finallResult = res.finalSolutions;
              this.assocService.stopCounter();
            }
            this.sessionStorage.setItem("randomAssociationId", this.associationId.toString());
            this.columnInput = (({ A, B, C, D }) => ({ A, B, C, D }))(res.solutions);
            Object.keys(this.isColumnGuessed).forEach(key => {
              this.isColumnGuessed[key] = true;

            });
            res.fields.forEach(field => {
              const column = field.columnPosition;
              const position = field.position;
              const index = this.itemText[column].indexOf(position);
              ////                       [A,A,A,A]         (0,1,2,3)
              if (index != -1) {
                this.itemText[column][index] = field.text;
                this.cdr.detectChanges();
                this.updateElements(column);
                this.renderer.addClass(this.finall.nativeElement, 'background-class');
                ////  [A]     [0 prvi field]   = prvi field -> field.text
                // this.router.navigate(['/number']);
              }
            });
          }
        });
      },
      error: (error) => {
        console.error('Error checking final solution:', error);
      }
    });
  }

  handleInputChange(column: string): void {
    const input = this.columnInput[column];

    this.assocService.checkColumnSolution(this.associationId, column, input).pipe(
      switchMap(checkSolution => {
        if (checkSolution.message) {
          return this.assocService.getColumnByColumnPosition(this.associationId, column);
        } else {
          return EMPTY;
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (fields) => {
        this.itemText[column] = fields.map(field => field.text);
        this.isColumnGuessed[column.toUpperCase()] = true;
        this.cdr.detectChanges();
        this.updateElements(column);
      },
      error: (error) => {
        this.columnInput[column] = ""
        console.error('Error handling input change:', error);
      }
    });
  }

  updateElements(column?: string): void {
    let elements: QueryList<ElementRef> | undefined;
    switch (column) {
      case 'A':
        elements = this.itemElementsA;
        break;
      case 'B':
        elements = this.itemElementsB;
        break;
      case 'C':
        elements = this.itemElementsC;
        break;
      case 'D':
        elements = this.itemElementsD;
        break;
    }

    if (elements) {
      elements.forEach((item) => {
        this.renderer.addClass(item.nativeElement, 'background-class');
      });
    }
  }
}
