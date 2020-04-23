import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }


  checkUserName(user: string): Observable<boolean> {
    return of(false)
  }
}
