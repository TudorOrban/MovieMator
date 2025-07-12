import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { UserStatistics } from "../models/UserStatistics";

@Injectable({
    providedIn: "root"
})
export class UserStatisticsService {
    private apiUrl = `${environment.apiUrl}/user-statistics`;

    constructor(
        private readonly http: HttpClient
    ) {}

    getUserStatistics(userId: number, startDate: Date, endDate: Date): Observable<UserStatistics> {
        const startParam = startDate.toISOString().substring(0, 10);
        const endParam = endDate.toISOString().substring(0, 10);

        let params = new HttpParams()
            .set('startDate', startParam)
            .set('endDate', endParam);

        return this.http.get<UserStatistics>(`${this.apiUrl}/user/${userId}`, { params: params });
    }
}