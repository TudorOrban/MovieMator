import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { TmdbMovieCredits, TmdbMovieDetails, TmdbMovieResult } from "../models/Tmdb";

@Injectable({
    providedIn: "root"
})
export class TmdbService {
    private readonly API_KEY = environment.tmdbApiKey;
    private readonly BASE_URL = "https://api.themoviedb.org/3";
    private readonly IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

    constructor(private http: HttpClient) {}

    searchMovies(query: string): Observable<TmdbMovieResult[]> {
        const url = `${this.BASE_URL}/search/movie?api_key=${this.API_KEY}&query=${encodeURIComponent(query)}`;
        return this.http.get<any>(url).pipe(
            map(response => response.results)
        );
    }

    getMovieDetails(tmdbId: number): Observable<TmdbMovieDetails> {
        const url = `${this.BASE_URL}/movie/${tmdbId}?api_key=${this.API_KEY}`;
        return this.http.get<TmdbMovieDetails>(url);
    }

    getMovieCredits(tmdbId: number): Observable<TmdbMovieCredits> {
        const url = `${this.BASE_URL}/movie/${tmdbId}/credits?api_key=${this.API_KEY}`;
        return this.http.get<TmdbMovieCredits>(url);
    }

    getPosterUrl(posterPath?: string): string | undefined {
        return posterPath ? `${this.IMAGE_BASE_URL}${posterPath}` : undefined;
    }
}