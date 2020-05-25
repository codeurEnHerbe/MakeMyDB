import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
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

  login(username: string, password: string){

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'});
    let options = { headers: headers };
    
    return this.http.post('/login', {
      "username": username,
      "password": password
    }, options);
  }
}