import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IInputInfos } from '../interfaces/inputs.interface';
import { HttpParams, HttpClient } from '@angular/common/http';
import { BaseUrl } from '../utils/config/config';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http: HttpClient) {
  }

  checkEmail(email: string) {
    return this.http.get<boolean>(`/users/check-email?email=${email}`);
  }

  register(inputs: any): boolean {;
    this.http.post('/users/register', {
      "email": inputs.email,
      "username": inputs.userName,
      "password": inputs.password
    }, {observe : 'response'}).subscribe( res =>{
        if(res.status == 200){
          console.log("Register Success")
          return true;
        }else{
          console.log("Something went wrong :c")
        }
      }
    );
    return false;
  }

  checkUserName(user: string): Observable<boolean> {
    return this.http.get<boolean>(`/users/check-username?username=${user}`);
  }
}
