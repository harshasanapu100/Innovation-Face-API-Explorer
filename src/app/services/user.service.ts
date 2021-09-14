import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models/user';

@Injectable()
export class UserService {
    baseURL:string= "http://localhost:5000";
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${this.baseURL}/users`);
    }

    register(user: User) {
        return this.http.post(`${this.baseURL}/users/register`, user);
    }

    delete(id: number) {
        return this.http.delete(`${this.baseURL}/users/${id}`);
    }
}