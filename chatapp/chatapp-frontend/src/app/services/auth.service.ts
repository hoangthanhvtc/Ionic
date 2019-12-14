import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BackendURL = 'http://localhost:3000/api/chatapp';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  registerUser(account): Observable<any> {
    return this.http.post(`${BackendURL}/register`, account);
  }

  loginUser(account): Observable<any> {
    return this.http.post(`${BackendURL}/login`, account);
  }
}
