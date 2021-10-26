import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models/user';

@Injectable()
export class UserService {
    baseURL:string= "http://localhost:5000";
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${this.baseURL}/user`);
    }

    register(user: any) {
        user.balance = 10000;
        return this.http.post(`${this.baseURL}/user`, user);
    }

    delete(id: number) {
        return this.http.delete(`${this.baseURL}/user/${id}`);
    }

    uploadImage(file:any){
        return this.http.post(`${this.baseURL}/user/UploadImage`, file);
    }

    voiceEnroll(file:any){
        return this.http.post(`${this.baseURL}/user/VoiceEnroll`, file);
    }
}