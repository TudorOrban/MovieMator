import { Injectable } from "@angular/core";
import { CacheEntry, PaginatedResults, SearchParams } from "../../../shared/models/Search";
import { PublicUserDataDto, UserSearchDto } from "../models/User";
import { SearchCacheKeyBuilder } from "../../movies/services/search-cache-key-builder";

@Injectable({
    providedIn: "root"
})
export class UserCacheService {
    private cache = new Map<string, CacheEntry<PublicUserDataDto>>();
    
    private readonly DEFAULT_TTL_MINUTES = 10;
    private readonly MAX_CACHE_SIZE = 100;

    constructor() {}

    get(userId: number): PublicUserDataDto | undefined {
        const key = userId.toString();
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

    set(userId: number, data: PublicUserDataDto, ttlMinutes?: number): void {
        const key = userId.toString();
        const now = Date.now();
        const effectiveTtl = ttlMinutes ?? this.DEFAULT_TTL_MINUTES;

        const newEntry: CacheEntry<PublicUserDataDto> = {
            data: data,
            timestamp: now,
            expirationTime: now + (effectiveTtl * 60 * 1000)
        };

        if (this.cache.size >= this.MAX_CACHE_SIZE && !this.cache.has(key)) {
            this.evictOldestEntry(this.cache);
        }

        this.cache.set(key, newEntry);
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
    }

    invalidateSearchEntry(userId: number, searchParams: SearchParams): void {
        const key = SearchCacheKeyBuilder.buildUserSearchKey(userId, searchParams);
        this.cache.delete(key);
    }

    getCacheSize(): number {
        return this.cache.size;
    }
}