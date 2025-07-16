import { Subject, Subscription } from "rxjs";
import { TmdbMovieResult } from "./Tmdb";

export interface MovieSearchDto {
    id: number;
    userId: number;
    tmdbId: number;
    title: string;

    status?: MovieStatus;
    userRating?: number;
    userReview?: string;
    watchedDate?: Date;
    createdAt: Date;
    updatedAt: Date;

    releaseYear?: number;
    posterUrl?: string;
    director?: string;
    plotSummary?: string;
    genres?: string[];
    runtimeMinutes?: number;
    actors?: string[];

    // New
    watchedDates?: Date[];
}

export enum MovieStatus {
    WATCHED = "WATCHED",
    WATCHLIST = "WATCHLIST"
}

export interface MovieDataDto {
    id: number;
    userId: number;
    tmdbId: number;
    title: string;

    status?: MovieStatus;
    watchedDate?: Date;
    userRating?: number;
    userReview?: string;
    createdAt: Date;
    updatedAt: Date;

    releaseYear?: number;
    posterUrl?: string;
    director?: string;
    plotSummary?: string;
    genres?: string[];
    runtimeMinutes?: number;
    actors?: string[];

    // New
    watchedDates?: Date[];
}

export interface CreateMovieDto {
    userId: number;
    tmdbId: number;
    title: string;

    status?: MovieStatus;
    watchedDate?: Date;
    userRating?: number;
    userReview?: string;

    releaseYear?: number;
    posterUrl?: string;
    director?: string;
    plotSummary?: string;
    genres?: string[];
    runtimeMinutes?: number;
    actors?: string[];

    // New
    watchedDates?: Date[];
}

export interface UpdateMovieDto {
    id: number;
    userId: number;
    tmdbId: number;
    title: string;

    status?: MovieStatus;
    watchedDate?: Date;
    userRating?: number;
    userReview?: string;
    
    releaseYear?: number;
    posterUrl?: string;
    director?: string;
    plotSummary?: string;
    genres?: string[];
    runtimeMinutes?: number;
    actors?: string[];

    // New
    watchedDates?: Date[];
}

// UI
export interface CreateMovieDtoUi extends CreateMovieDto {
    areDetailsExpanded?: boolean;
    tmdbSearchResults: TmdbMovieResult[];
    searchTerms: Subject<string>;
    searchSubscription?: Subscription;
    isTitleUnique?: boolean;
}