import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

interface Coord {
  x: number;
  y: number;
}

@Injectable({
  providedIn: 'root'
})
export class HandTrackerService {
  private messageSource = new Subject<string>();
  private coordSource = new Subject<Coord>();

  constructor() { }

  public onMessageEmit(): Observable<string> {
    return this.messageSource.asObservable();
  }

  public setMessage(message: string) {
    return this.messageSource.next(message);
  }

  public onCoordEmit(): Observable<Coord> {
    return this.coordSource.asObservable();
  }

  public setCoord(message: Coord) {
    return this.coordSource.next(message);
  }
}
