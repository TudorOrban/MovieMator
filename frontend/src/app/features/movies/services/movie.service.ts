import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment.dev";
import { HttpClient } from "@angular/common/http";
import { PaginatedResults, SearchParams } from "../../../shared/models/Search";
import { Observable } from "rxjs";
import { CreateMovieDto, MovieDataDto, MovieSearchDto, UpdateMovieDto } from "../models/Movie";

@Injectable({
    providedIn: "root"
})
export class MovieService {
    private apiUrl: string = `${environment.apiUrl}/movies`;

    constructor(private readonly http: HttpClient) {}

    searchMovies(userId: number, searchParams: SearchParams): Observable<PaginatedResults<MovieSearchDto>> {
        return this.http.get<PaginatedResults<MovieSearchDto>>(`${this.apiUrl}/search/user/${userId}`, { params: { ...searchParams } });
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