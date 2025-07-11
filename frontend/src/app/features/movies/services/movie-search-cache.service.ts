import { Injectable } from "@angular/core";
import { CacheEntry, MovieFilters, PaginatedResults, SearchParams } from "../../../shared/models/Search";
import { MovieSearchDto } from "../models/Movie";
import { SearchCacheKeyBuilder } from "./search-cache-key-builder";


@Injectable({
    providedIn: "root"
})
export class MovieSearchCacheService {
    private cache = new Map<string, CacheEntry<PaginatedResults<MovieSearchDto>>>();
    private readonly DEFAULT_TTL_MINUTES = 10;
    private readonly MAX_CACHE_SIZE = 100;

    constructor() {}

    get(userId: number, searchParams: SearchParams, movieFilters: MovieFilters): PaginatedResults<MovieSearchDto> | undefined {
        const key = SearchCacheKeyBuilder.buildMovieSearchKey(userId, searchParams, movieFilters);
        const cachedEntry = this.cache.get(key);

        if (cachedEntry) {
            const now = Date.now();
            if (cachedEntry.expirationTime > now) {
                cachedEntry.timestamp = now;
                return cachedEntry.data;
            } else {
                this.cache.delete(key);
                return undefined;
            }
        }
        return undefined;
    }

    set(userId: number, searchParams: SearchParams, movieFilters: MovieFilters, data: PaginatedResults<MovieSearchDto>, ttlMinutes?: number): void {
        const key = SearchCacheKeyBuilder.buildMovieSearchKey(userId, searchParams, movieFilters);
        const now = Date.now();
        const effectiveTtl = ttlMinutes ?? this.DEFAULT_TTL_MINUTES;

        const newEntry: CacheEntry<PaginatedResults<MovieSearchDto>> = {
            data: data,
            timestamp: now,
            expirationTime: now + (effectiveTtl * 60 * 1000)
        };

        // Least Recently Used (LRU) eviction policy
        if (this.cache.size >= this.MAX_CACHE_SIZE && !this.cache.has(key)) {
            this.evictOldestEntry();
        }

        this.cache.set(key, newEntry);
    }

    private evictOldestEntry(): void {
        let oldestKey: string | undefined;
        let oldestTimestamp = Infinity;

        for (const [key, entry] of this.cache.entries()) {
            if (entry.timestamp < oldestTimestamp) {
                oldestTimestamp = entry.timestamp;
                oldestKey = key;
            }
        }

        if (oldestKey) {
            this.cache.delete(oldestKey);
        }
    }

    invalidateCache(): void {
        this.cache.clear();
    }

    invalidateEntry(userId: number, searchParams: SearchParams, movieFilters: MovieFilters): void {
        const key = SearchCacheKeyBuilder.buildMovieSearchKey(userId, searchParams, movieFilters);
        this.cache.delete(key);
    }

    getCacheSize(): number {
        return this.cache.size;
    }
}