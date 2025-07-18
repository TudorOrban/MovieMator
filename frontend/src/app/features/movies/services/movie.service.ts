import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { MovieFilters, PaginatedResults, SearchParams } from "../../../shared/models/Search";
import { Observable, of, tap } from "rxjs";
import { CreateMovieDto, MovieDataDto, MovieSearchDto, UpdateMovieDto } from "../models/Movie";
import { MovieCacheService } from "./movie-cache.service";

@Injectable({
    providedIn: "root"
})
export class MovieService {
    private apiUrl: string = `${environment.apiUrl}/movies`;

    constructor(
        private readonly http: HttpClient,
        private readonly movieCacheService: MovieCacheService
    ) {}

    searchMovies(userId: number, searchParams: SearchParams, movieFilters: MovieFilters): Observable<PaginatedResults<MovieSearchDto>> {
        // 1. Try to get data from cache
        const cachedData = this.movieCacheService.get(userId, searchParams, movieFilters);
        if (cachedData) {
            return of(cachedData); 
        }

        // 2. If not in cache, make the HTTP request
        const params = this.getSearchParams(searchParams, movieFilters);

        return this.http.get<PaginatedResults<MovieSearchDto>>(
            `${this.apiUrl}/search/user/${userId}`,
            { params: params }
        ).pipe(
            // 3. Cache the results before returning them
            tap(data => {
                this.movieCacheService.set(userId, searchParams, movieFilters, data);
            })
        );
    }

    getMovieById(id: number): Observable<MovieDataDto> {
        return this.http.get<MovieDataDto>(`${this.apiUrl}/${id}`);
    }

    getWatchedDatesByUserId(userId: number): Observable<Date[]> {
        // 1. Try to get data from cache
        const cachedData = this.movieCacheService.getWatchedDates(userId);
        if (cachedData) {
            return of(cachedData);
        }

        // 2. If not in cache, make the HTTP request
        return this.http.get<Date[]>(`${this.apiUrl}/watched-dates/user/${userId}`).pipe(
            // 3. Cache the results before returning them
            tap(data => {
                this.movieCacheService.setWatchedDates(userId, data);
            })
        );
    }

    isMovieTitleUnique(userId: number, title: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.apiUrl}/movie-title/${title}/user/${userId}`);
    }

    createMovie(movieDto: CreateMovieDto): Observable<MovieDataDto> {
        return this.http.post<MovieDataDto>(this.apiUrl, movieDto).pipe(
            tap(() => {
                this.movieCacheService.invalidateCache();
            })
        );
    }

    createMovies(movieDtos: CreateMovieDto[]): Observable<MovieDataDto[]> {
        return this.http.post<MovieDataDto[]>(`${this.apiUrl}/bulk`, movieDtos).pipe(
            tap(() => {
                this.movieCacheService.invalidateCache();
            })
        );
    }

    updateMovie(movieDto: UpdateMovieDto): Observable<MovieDataDto> {
        return this.http.put<MovieDataDto>(this.apiUrl, movieDto).pipe(
            tap(() => {
                this.movieCacheService.invalidateCache();
            })
        );
    }

    deleteMovie(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
    
    deleteMovies(ids: number[]): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/bulk`, { body: ids }).pipe(
            tap(() => {
                this.movieCacheService.invalidateCache();
            })
        );
    }

    private getSearchParams(searchParams: SearchParams, movieFilters: MovieFilters) {
        return {
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
    }
}