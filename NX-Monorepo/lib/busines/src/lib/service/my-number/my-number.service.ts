import { MyNumberI } from '../../../../../domains/src/lib/my-number/interface/my-number-inteface';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyNumberService {

  constructor( private http: HttpClient,
               @Inject('environment') private environment: Record<string, string | boolean | number>) {
  }

  public getAllNumber(): Observable<MyNumberI[]> {
    return this.http.get<MyNumberI[]>(`http://localhost:8080/number-game/my-numbers`).pipe(
      tap(data => console.log('Data received from API:', data)), 
      catchError(err => {
        console.error('Error problwm:', err);
        return of([]);;
      })
    )
  }
}
