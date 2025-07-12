import { Injectable } from "@angular/core";
import { CacheEntry, MovieFilters, PaginatedResults, SearchParams } from "../../../shared/models/Search";
import { MovieSearchDto } from "../models/Movie";
import { SearchCacheKeyBuilder } from "./search-cache-key-builder"; // Assuming this handles movie search keys
import { UserStatistics } from "../../statistics/models/UserStatistics";

@Injectable({
    providedIn: "root"
})
export class MovieCacheService {
    private cache = new Map<string, CacheEntry<PaginatedResults<MovieSearchDto>>>();
    private watchedDatesCache = new Map<string, CacheEntry<Date[]>>();
    private statisticsCache = new Map<string, CacheEntry<UserStatistics>>();
    
    private readonly DEFAULT_TTL_MINUTES = 10;
    private readonly HEATMAP_TTL_MINUTES = 60 * 24;
    private readonly STATISTICS_TTL_MINUTES = 60 * 24;
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

        if (this.cache.size >= this.MAX_CACHE_SIZE && !this.cache.has(key)) {
            this.evictOldestEntry(this.cache);
        }

        this.cache.set(key, newEntry);
    }

    getWatchedDates(userId: number): Date[] | undefined {
        const key = this.buildWatchedDatesKey(userId);
        const cachedEntry = this.watchedDatesCache.get(key);

        if (cachedEntry) {
            const now = Date.now();
            if (cachedEntry.expirationTime > now) {
                return cachedEntry.data;
            } else {
                this.watchedDatesCache.delete(key);
                return undefined;
            }
        }
        return undefined;
    }

    setWatchedDates(userId: number, data: Date[], ttlMinutes?: number): void {
        const key = this.buildWatchedDatesKey(userId);
        const now = Date.now();
        const effectiveTtl = ttlMinutes ?? this.HEATMAP_TTL_MINUTES; 

        const newEntry: CacheEntry<Date[]> = {
            data: data,
            timestamp: now,
            expirationTime: now + (effectiveTtl * 60 * 1000)
        };

        this.watchedDatesCache.set(key, newEntry);
    }


    getStatistics(userId: number, startDate: Date, endDate: Date): UserStatistics | undefined {
        const key = this.buildStatisticsKey(userId, startDate, endDate);
        const cachedEntry = this.statisticsCache.get(key);

        if (cachedEntry) {
            const now = Date.now();
            if (cachedEntry.expirationTime > now) {
                return cachedEntry.data;
            } else {
                this.statisticsCache.delete(key);
                return undefined;
            }
        }
        return undefined;
    }

    setStatistics(userId: number, startDate: Date, endDate: Date, data: UserStatistics, ttlMinutes?: number): void {
        const key = this.buildStatisticsKey(userId, startDate, endDate);
        const now = Date.now();
        const effectiveTtl = ttlMinutes ?? this.STATISTICS_TTL_MINUTES; 

        const newEntry: CacheEntry<UserStatistics> = {
            data: data,
            timestamp: now,
            expirationTime: now + (effectiveTtl * 60 * 1000)
        };

        this.statisticsCache.set(key, newEntry);
    }

    private evictOldestEntry<T>(cacheMap: Map<string, CacheEntry<T>>): void {
        let oldestKey: string | undefined;
        let oldestTimestamp = Infinity;

        for (const [key, entry] of cacheMap.entries()) {
            if (entry.timestamp < oldestTimestamp) {
                oldestTimestamp = entry.timestamp;
                oldestKey = key;
            }
        }

        if (oldestKey) {
            cacheMap.delete(oldestKey);
        }
    }

    // Invalidation
    invalidateCache(): void {
        this.cache.clear();
        this.watchedDatesCache.clear();
        this.statisticsCache.clear();
    }

    invalidateSearchEntry(userId: number, searchParams: SearchParams, movieFilters: MovieFilters): void {
        const key = SearchCacheKeyBuilder.buildMovieSearchKey(userId, searchParams, movieFilters);
        this.cache.delete(key);
    }

    invalidateWatchedDates(userId: number): void {
        const key = this.buildWatchedDatesKey(userId);
        this.watchedDatesCache.delete(key);
    }

    invalidateStatistics(userId: number, startDate: Date, endDate: Date): void {
        const key = this.buildStatisticsKey(userId, startDate, endDate);
        this.statisticsCache.delete(key);
    }

    private buildWatchedDatesKey(userId: number): string {
        return `watchedDates_user_${userId}`;
    }

    private buildStatisticsKey(userId: number, startDate: Date, endDate: Date): string {
        return `userId=${userId}&startDate=${startDate}&endDate=${endDate}`;
    }

    getCacheSize(): number {
        return this.cache.size + this.watchedDatesCache.size;
    }
}