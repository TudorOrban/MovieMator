package com.moviemator.features.statistics.model;

import com.moviemator.features.movie.model.MovieStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserStatistics {
    private LocalDate startDate;
    private LocalDate endDate;

    private Long totalWatchedMovies;
    private Long totalWatchTimeMinutes;
    private Double averageUserRating;

    private Map<String, Long> movieCountByDirector;
    private Map<String, Long> movieCountByGenre;
    private Map<String, Long> movieCountByActor;
    private Map<Integer, Long> movieCountByReleaseYear;

    private Map<String, Long> userRatingDistribution;

    private Long totalUniqueWatchedDays;
    private Map<String, Long> movieCountByWatchedMonthAndYear;
    private Double averageMoviesPerWeek;
    private Double averageMoviesPerMonth;

    public UserStatistics(LocalDate startDate, LocalDate endDate) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.totalWatchedMovies = 0L;
        this.totalWatchTimeMinutes = 0L;
        this.averageUserRating = 0.0;
        this.movieCountByDirector = new HashMap<>();
        this.movieCountByGenre = new HashMap<>();
        this.movieCountByActor = new HashMap<>();
        this.movieCountByReleaseYear = new HashMap<>();
        this.userRatingDistribution = new HashMap<>();
        this.totalUniqueWatchedDays = 0L;
        this.movieCountByWatchedMonthAndYear = new HashMap<>();
        this.averageMoviesPerWeek = 0.0;
        this.averageMoviesPerMonth = 0.0;
    }
}
