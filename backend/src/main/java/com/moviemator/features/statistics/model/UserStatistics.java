package com.moviemator.features.statistics.model;

import com.moviemator.features.movie.model.MovieStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
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

    private Map<String, Integer> movieCountByDirector;
    private Map<String, Integer> movieCountByGenre;
    private Map<String, Integer> movieCountByActor;
    private Map<Integer, Long> movieCountByReleaseYear;

    private Map<Integer, Long> userRatingDistribution;
    private Map<MovieStatus, Long> movieCountByStatus;

    private Long totalUniqueWatchedDays;
    private Map<String, Long> movieCountByWatchedMonth;
    private Double averageMoviesPerWeek;
    private Double averageMoviesPerMonth;
}
