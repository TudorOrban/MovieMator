import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { MovieFilters, PaginatedResults, SearchParams } from "../../../shared/models/Search";
import { Observable, of, tap } from "rxjs";
import { CreateMovieDto, MovieDataDto, MovieSearchDto, UpdateMovieDto } from "../models/Movie";
import { MovieSearchCacheService } from "./movie-search-cache.service";

@Injectable({
    providedIn: "root"
})
export class MovieService {
    private apiUrl: string = `${environment.apiUrl}/movies`;

    constructor(
        private readonly http: HttpClient,
        private readonly movieSearchCacheService: MovieSearchCacheService
    ) {}

    searchMovies(userId: number, searchParams: SearchParams, movieFilters: MovieFilters): Observable<PaginatedResults<MovieSearchDto>> {
        // Look for data in cache
        const cachedData = this.movieSearchCacheService.get(userId, searchParams, movieFilters);
        if (cachedData) {
            return of(cachedData); 
        }

        // If not found, make HTTP request
        const params = {
            ...searchParams,
            ...(movieFilters.releaseYearFrom != null ? { releaseYearFrom: movieFilters.releaseYearFrom } : {}),
            ...(movieFilters.releaseYearTo != null ? { releaseYearTo: movieFilters.releaseYearTo } : {}),
            ...(movieFilters.director != null ? { director: movieFilters.director } : {}),
            ...(movieFilters.userRatingFrom != null ? { userRatingFrom: movieFilters.userRatingFrom } : {}),
            ...(movieFilters.userRatingTo != null ? { userRatingTo: movieFilters.userRatingTo } : {}),
            ...(movieFilters.watchedDateFrom != null ? { watchedDateFrom: movieFilters.watchedDateFrom } : {}),
            ...(movieFilters.watchedDateTo != null ? { watchedDateTo: movieFilters.watchedDateTo } : {}),
            ...(movieFilters.status != null ? { status: movieFilters.status } : {}),
            ...(movieFilters.runtimeMinutesLessThan != null ? { runtimeMinutesLessThan: movieFilters.runtimeMinutesLessThan } : {}),
            ...(movieFilters.runtimeMinutesMoreThan != null ? { runtimeMinutesMoreThan: movieFilters.runtimeMinutesMoreThan } : {}),
            ...(movieFilters.genresIncluding?.length ? { genresIncluding: movieFilters.genresIncluding } : {}),
            ...(movieFilters.actorsIncluding?.length ? { actorsIncluding: movieFilters.actorsIncluding } : {}),
        };

        return this.http.get<PaginatedResults<MovieSearchDto>>(
            `${this.apiUrl}/search/user/${userId}`,
            { params: params as any }
        ).pipe(
            tap(data => {
                this.movieSearchCacheService.set(userId, searchParams, movieFilters, data);
            })
        );
    }

    getMovieById(id: number): Observable<MovieDataDto> {
        return this.http.get<MovieDataDto>(`${this.apiUrl}/${id}`);
    }

    createMovie(movieDto: CreateMovieDto): Observable<MovieDataDto> {
        return this.http.post<MovieDataDto>(this.apiUrl, movieDto).pipe(
            tap(() => {
                this.movieSearchCacheService.invalidateCache();
            })
        );
    }

    updateMovie(movieDto: UpdateMovieDto): Observable<MovieDataDto> {
        return this.http.put<MovieDataDto>(this.apiUrl, movieDto).pipe(
            tap(() => {
                this.movieSearchCacheService.invalidateCache();
            })
        );
    }

    deleteMovie(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
    
    deleteMovies(ids: number[]): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/bulk`, { body: ids }).pipe(
            tap(() => {
                this.movieSearchCacheService.invalidateCache();
            })
        );
    }
}