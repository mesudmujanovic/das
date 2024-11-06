import { AssociationI, MessageResponseI, FieldI } from '../../../../../domains/src/lib/association/interface/index';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, interval, Observable, switchMap, takeUntil, throwError, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AssociationService {

  constructor( private http: HttpClient,
              @Inject('environment') private environment: Record<string, string | boolean | number>){
  }

  getCounter(): Observable<number> {
    const stopAfter30s$ = timer(33000);
    return interval(1000).pipe(
      switchMap(() => this.http.get<number>(`${this.environment['ENDPOINT']}/counter`)),
      takeUntil(stopAfter30s$)
    );
  }

  getRandomAssociationOnlyById(): Observable<number> {
    return this.http.get<number>(`${this.environment['ENDPOINT']}/random`);
  }

  getAssociationById(associationId: number): Observable<AssociationI> {
    return this.http.get<AssociationI>(`${this.environment['ENDPOINT']}/associations/${associationId}`).pipe(
      catchError((error) => {
        console.error('Error details', error)
        return throwError(() => new Error(error.message || 'An unexpected error occured'));
      })
    )
  }

  getPosition(associationId: number, position: string): Observable<FieldI> {
    return this.http.get<FieldI>(`${this.environment['ENDPOINTField']}/search/${associationId}/${position}`);
  }

  getColumnByColumnPosition(associationId: number, columnPosition: string): Observable<FieldI[]> {
    return this.http.get<FieldI[]>(`${this.environment['ENDPOINTField']}/association/${associationId}/column/${columnPosition}`);
  }

  checkFinalSolution(associationId: number, userInput: string): Observable<boolean> {
    const url = `${this.environment['ENDPOINT']}/checkFinalSolution/${associationId}/${userInput}`;
    return this.http.get<boolean>(url).pipe(
      catchError((error) => {
        console.error('Error details:', error);
        return throwError(() => new Error(error.message || 'An unexpected error occurred'));
      })
    );
  }

  checkColumnSolution(associationId: number, column: string, userInput: string): Observable<MessageResponseI> {
    return this.http.get<MessageResponseI>(`${this.environment['ENDPOINT']}/checkSolution/${associationId}/${column}/${userInput}`)
      .pipe(
        catchError(error => {
          console.error('Error', error);
          return throwError(() => new Error('An error occurred while checking the solution.'));
        })
      )
  }
}
