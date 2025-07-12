export interface UserStatistics {
    startDate: Date;
    endDate: Date;
    totalWatchedMovies: number;
    totalWatchTimeMinutes: number;
    averageUserRating: number;
    movieCountByDirector: Record<string, number>;
    movieCountByGenre: Record<string, number>;
    movieCountByActor: Record<string, number>;
    movieCountByReleaseYear: Record<number, number>;
    userRatingDistribution: Record<number, number>;
    totalUniqueWatchedDays: number;
    movieCountByWatchedMonth: Record<string, number>;
    averageMoviesPerWeek: number;
    averageMoviesPerMonth: number;
}