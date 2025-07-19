import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { PaginatedResults, SearchParams } from "../../../shared/models/Search";
import { Observable } from "rxjs";
import { CreateRankingDto, RankingDataDto, RankingSearchDto, UpdateRankingDto } from "../models/Ranking";

@Injectable({
    providedIn: "root"
})
export class RankingService {
    private apiUrl: string = `${environment.apiUrl}/rankings`;

    constructor(
        private readonly http: HttpClient,
    ) {}

    searchRankings(userId: number, searchParams: SearchParams): Observable<PaginatedResults<RankingSearchDto>> {
        return this.http.get<PaginatedResults<RankingSearchDto>>(`${this.apiUrl}/search/user/${userId}`, { params: { ...searchParams } });
    }

    getRankingById(id: number): Observable<RankingDataDto> {
        return this.http.get<RankingDataDto>(`${this.apiUrl}/${id}`);
    }

    getWatchedDatesByUserId(userId: number): Observable<Date[]> {
        return this.http.get<Date[]>(`${this.apiUrl}/watched-dates/user/${userId}`);
    }

    isRankingTitleUnique(userId: number, title: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.apiUrl}/ranking-title/${title}/user/${userId}`);
    }

    createRanking(rankingDto: CreateRankingDto): Observable<RankingDataDto> {
        return this.http.post<RankingDataDto>(this.apiUrl, rankingDto);
    }

    createRankings(rankingDtos: CreateRankingDto[]): Observable<RankingDataDto[]> {
        return this.http.post<RankingDataDto[]>(`${this.apiUrl}/bulk`, rankingDtos);
    }

    updateRanking(rankingDto: UpdateRankingDto): Observable<RankingDataDto> {
        return this.http.put<RankingDataDto>(this.apiUrl, rankingDto);
    }

    deleteRanking(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
    
    deleteRankings(ids: number[]): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/bulk`, { body: ids });
    }
}