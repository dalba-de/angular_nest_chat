import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import User from '../components/chat/user';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  API_SERVER = "http://localhost:3000";

  public createUser(user: User) {
    return this.httpClient.post(`${this.API_SERVER}/users/create`, user);
  }

  public getUsers() {
    return this.httpClient.get(`${this.API_SERVER}/users/`);
  }

  public getGroups() {
    return this.httpClient.get(`${this.API_SERVER}/groups/`);
  }
}
