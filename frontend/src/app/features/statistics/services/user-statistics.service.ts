import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, of, tap } from "rxjs";
import { UserStatistics } from "../models/UserStatistics";
import { MovieCacheService } from "../../movies/services/movie-search-cache.service";

@Injectable({
    providedIn: "root"
})
export class UserStatisticsService {
    private apiUrl = `${environment.apiUrl}/user-statistics`;

    constructor(
        private readonly http: HttpClient,
        private readonly movieCacheService: MovieCacheService
    ) {}

    getUserStatistics(userId: number, startDate: Date, endDate: Date): Observable<UserStatistics> {
        // 1. Try to get data from cache
        const cachedData = this.movieCacheService.getStatistics(userId, startDate, endDate);
        if (cachedData) {
            return of(cachedData);
        }

        // 2. If not in cache, make the HTTP request        
        const startParam = startDate.toISOString().substring(0, 10);
        const endParam = endDate.toISOString().substring(0, 10);

        let params = new HttpParams()
            .set("startDate", startParam)
            .set("endDate", endParam);

        return this.http.get<UserStatistics>(
            `${this.apiUrl}/user/${userId}`, 
            { params: params }
        ).pipe(
            // 3. Cache the results before returning them
            tap(data => {
                this.movieCacheService.setStatistics(userId, startDate, endDate,  data);
            })
        );
    }
}