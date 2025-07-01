
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
}