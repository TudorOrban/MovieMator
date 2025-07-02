import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment.dev";
import { Observable } from "rxjs";
import { CreateUserDto, UpdateUserDto, UserDataDto } from "../models/User";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: "root"
})
export class UserService {
    private apiUrl = `${environment.apiUrl}/users`;

    constructor(private http: HttpClient) {}

    getUserById(id: number): Observable<UserDataDto> {
        return this.http.get<UserDataDto>(`${this.apiUrl}/${id}`);
    }

    getUserByCognitoUserId(cognitoUserId: string): Observable<UserDataDto> {
        return this.http.get<UserDataDto>(`${this.apiUrl}/cognito-id/${cognitoUserId}`);
    }

    createUser(userDto: CreateUserDto): Observable<UserDataDto> {
        return this.http.post<UserDataDto>(this.apiUrl, userDto);
    }

    updateUser(userDto: UpdateUserDto): Observable<UserDataDto> {
        return this.http.put<UserDataDto>(this.apiUrl, userDto);
    }

    deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

}