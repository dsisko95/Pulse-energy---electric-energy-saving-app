import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private isUserLogged: boolean = false;
  private url: string = "http://localhost:63236/api/login";
  constructor(private http: HttpClient) { }
  resetRequest(username: string, secQuestion: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}/${username}/${secQuestion}/checkUser`);
  }
  updatePassword(username: string, password: string): Observable<Object> {
    return this.http.put(`${this.url}/updateUserPassword`,
      {
        "Username": `${username}`,
        "Password": `${password}`,
      }
    )
  }
  loginRequest(username: string, password: string): Observable<Object> {
    return this.http.get<Object>(`${this.url}/${username}/${password}/login`);
  }
  setUserLogged(): void {
    this.isUserLogged = true;
  }
  checkIfUserIsLogged(): boolean {
    return this.isUserLogged;
  }
}
