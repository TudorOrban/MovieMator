import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment.dev";
import { HttpClient } from "@angular/common/http";
import { MovieFilters, PaginatedResults, SearchParams } from "../../../shared/models/Search";
import { Observable } from "rxjs";
import { CreateMovieDto, MovieDataDto, MovieSearchDto, UpdateMovieDto } from "../models/Movie";

@Injectable({
    providedIn: "root"
})
export class MovieService {
    private apiUrl: string = `${environment.apiUrl}/movies`;

    constructor(private readonly http: HttpClient) {}

    searchMovies(userId: number, searchParams: SearchParams, movieFilters: MovieFilters): Observable<PaginatedResults<MovieSearchDto>> {
        return this.http.get<PaginatedResults<MovieSearchDto>>(
            `${this.apiUrl}/search/user/${userId}`,
            {
                params: {
                    ...searchParams,
                    ...(movieFilters.releaseYearFrom != null ? { releaseYearFrom: movieFilters.releaseYearFrom } : {}),
                    ...(movieFilters.releaseYearTo != null ? { releaseYearTo: movieFilters.releaseYearTo } : {}),
                    ...(movieFilters.director != null ? { director: movieFilters.director } : {}),
                    ...(movieFilters.userRatingFrom != null ? { userRatingFrom: movieFilters.userRatingFrom } : {}),
                    ...(movieFilters.userRatingTo != null ? { userRatingTo: movieFilters.userRatingTo } : {}),
                    ...(movieFilters.watchedDateFrom != null ? { watchedDateFrom: movieFilters.watchedDateFrom } : {}),
                    ...(movieFilters.watchedDateTo != null ? { watchedDateTo: movieFilters.watchedDateTo } : {}),
                }
            }
        );
    }

    getMovieById(id: number): Observable<MovieDataDto> {
        return this.http.get<MovieDataDto>(`${this.apiUrl}/${id}`);
    }

    createMovie(movieDto: CreateMovieDto): Observable<MovieDataDto> {
        return this.http.post<MovieDataDto>(this.apiUrl, movieDto);
    }

    updateMovie(movieDto: UpdateMovieDto): Observable<MovieDataDto> {
        return this.http.put<MovieDataDto>(this.apiUrl, movieDto);
    }

    deleteMovie(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
    
    deleteMovies(ids: number[]): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/bulk`, { body: ids });
    }
}