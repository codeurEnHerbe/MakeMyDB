import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  public isUserConnected: Subject<boolean> = new Subject<boolean>(); 
  constructor(private http: HttpClient) {
    this.isUserConnected.next(false);
  }

  checkEmail(email: string) {
    return this.http.get<boolean>(`/users/check-email?email=${email}`);
  }

  register(inputs: any): boolean {;
    this.http.post('/users/register', {
      "email": inputs.email,
      "username": inputs.userName,
      "password": inputs.password
    }, {observe : 'response',}).subscribe( res =>{
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
    let options = { observe: "response" , headers: headers };
    
    return this.http.post('/login', {
      "username": username,
      "password": password
    }, { observe: "response" , headers: headers, withCredentials: true});
  }

  userInfos(){
    return this.http.get('/users/me', {withCredentials: true});
  }

  public getIsUserConnected(): Observable<boolean>{
    return this.isUserConnected.asObservable();
  }
}