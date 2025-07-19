import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { CreateUserDto, PublicUserDataDto, UpdateUserDto, UserDataDto, UserSearchDto } from "../models/User";
import { HttpClient } from "@angular/common/http";
import { PaginatedResults, SearchParams } from "../../../shared/models/Search";

@Injectable({
    providedIn: "root"
})
export class UserService {
    private apiUrl = `${environment.apiUrl}/users`;

    constructor(private http: HttpClient) {}

    getUserById(id: number): Observable<UserDataDto> {
        return this.http.get<UserDataDto>(`${this.apiUrl}/${id}`);
    }

    getPublicUserById(id: number): Observable<PublicUserDataDto> {
        return this.http.get<PublicUserDataDto>(`${this.apiUrl}/public/${id}`);
    }

    getUserByCognitoUserId(cognitoUserId: string): Observable<UserDataDto> {
        return this.http.get<UserDataDto>(`${this.apiUrl}/cognito-id/${cognitoUserId}`);
    }

    searchPublicUsers(searchParams: SearchParams): Observable<PaginatedResults<UserSearchDto>> {
        return this.http.get<PaginatedResults<UserSearchDto>>(`${this.apiUrl}/search`, { params: { ...searchParams } });
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