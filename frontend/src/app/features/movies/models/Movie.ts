export interface MovieSearchDto {
    id: number;
    userId: number;
    tmdbId: number;
    title: string;
    releaseYear?: number;
    posterUrl?: string;
    director?: string;
    plotSummary?: string;
    userRating?: number;
    userReview?: string;
    watchedDate?: Date;
    createdAt: Date;
    updatedAt: Date;

    // New
    status?: MovieStatus;
    genres?: string[];
    runtimeMinutes?: number;
    actors?: string[];
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
    releaseYear?: number;
    posterUrl?: string;
    director?: string;
    plotSummary?: string;
    userRating?: number;
    userReview?: string;
    watchedDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    // New
    status?: MovieStatus;
    genres?: string[];
    runtimeMinutes?: number;
    actors?: string[];
}

export interface CreateMovieDto {
    userId: number;
    tmdbId: number;
    title: string;
    releaseYear?: number;
    posterUrl?: string;
    director?: string;
    plotSummary?: string;
    userRating?: number;
    userReview?: string;
    watchedDate?: Date;
    // New
    status?: MovieStatus;
    genres?: string[];
    runtimeMinutes?: number;
    actors?: string[];
}

export interface UpdateMovieDto {
    id: number;
    userId: number;
    tmdbId: number;
    title: string;
    releaseYear?: number;
    posterUrl?: string;
    director?: string;
    plotSummary?: string;
    userRating?: number;
    userReview?: string;
    watchedDate?: Date;
    // New
    status?: MovieStatus;
    genres?: string[];
    runtimeMinutes?: number;
    actors?: string[];
}