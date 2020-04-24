import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IInputInfos } from '../interfaces/inputs.interface';
import { HttpParams, HttpClient } from '@angular/common/http';
import { BaseUrl } from '../utils/config/config';
@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http: HttpClient) {
  }

  checkEmail(email: string) {
    return this.http.get<boolean>(`/users/check-email?email=${email}`);
  }

  register(inputs: Array<IInputInfos>): Observable<any> {
    return of(true)
  }

  checkUserName(user: string): Observable<boolean> {
    return this.http.get<boolean>(`/users/check-username?username=${user}`);
  }
}
