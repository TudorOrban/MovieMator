import { Injectable } from "@angular/core";
import { MovieFilters, PaginatedResults, SearchParams } from "../../../shared/models/Search";
import { MovieSearchDto } from "../models/Movie";
import { SearchCacheKeyBuilder } from "./search-cache-key-builder";

@Injectable({
    providedIn: "root"
})
export class MovieSearchCacheService {
    private cache = new Map<string, PaginatedResults<MovieSearchDto>>();

    get(userId: number, searchParams: SearchParams, movieFilters: MovieFilters): PaginatedResults<MovieSearchDto> | undefined {
        const key = SearchCacheKeyBuilder.buildMovieSearchKey(userId, searchParams, movieFilters);
        const cachedData = this.cache.get(key);
        return cachedData;
    }

    set(userId: number, searchParams: SearchParams, movieFilters: MovieFilters, data: PaginatedResults<MovieSearchDto>): void {
        const key = SearchCacheKeyBuilder.buildMovieSearchKey(userId, searchParams, movieFilters);
        this.cache.set(key, data);
    }

    invalidateCache(): void {
        this.cache.clear();
    }
}