package com.moviemator.features.statistics.service;

import com.moviemator.features.movie.model.Movie;
import com.moviemator.features.movie.repository.MovieRepository;
import com.moviemator.features.statistics.model.UserStatistics;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList; // Used for temporary list of all watched dates
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserStatisticsServiceImpl implements UserStatisticsService {

    private final MovieRepository movieRepository;

    private static final DateTimeFormatter MONTH_YEAR_FORMATTER = DateTimeFormatter.ofPattern("MMM yyyy");

    @Autowired
    public UserStatisticsServiceImpl(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public UserStatistics getUserStatistics(Long userId, LocalDate startDate, LocalDate endDate) {
        UserStatistics statistics = new UserStatistics(startDate, endDate);

        List<Movie> movies = movieRepository.findByUserIdAndAnyWatchedDateInPeriod(userId, startDate, endDate);

        if (movies.isEmpty()) {
            return statistics;
        }

        double sumUserRatings = 0.0;
        long ratedMoviesCount = 0;

        Set<LocalDate> uniqueWatchedDaysOverall = new HashSet<>();
        List<LocalDate> allWatchedEvents = new ArrayList<>();

        for (Movie movie : movies) {
            if (movie.getUserRating() != null) {
                sumUserRatings += movie.getUserRating();
                ratedMoviesCount++;
                String granularRatingKey = this.getGranularRatingKey(movie);
                statistics.getUserRatingDistribution().put(granularRatingKey, statistics.getUserRatingDistribution().getOrDefault(granularRatingKey, 0L) + 1);
            }
            if (movie.getDirector() != null && !movie.getDirector().trim().isEmpty()) {
                String director = movie.getDirector().trim();
                statistics.getMovieCountByDirector().put(director, statistics.getMovieCountByDirector().getOrDefault(director, 0L) + 1);
            }
            if (movie.getGenres() != null && !movie.getGenres().isEmpty()) {
                for (String genre : movie.getGenres()) {
                    if (genre != null && !genre.trim().isEmpty()) {
                        String trimmedGenre = genre.trim();
                        statistics.getMovieCountByGenre().put(trimmedGenre, statistics.getMovieCountByGenre().getOrDefault(trimmedGenre, 0L) + 1);
                    }
                }
            }
            if (movie.getActors() != null && !movie.getActors().isEmpty()) {
                for (String actor : movie.getActors()) {
                    if (actor != null && !actor.trim().isEmpty()) {
                        String trimmedActor = actor.trim();
                        statistics.getMovieCountByActor().put(trimmedActor, statistics.getMovieCountByActor().getOrDefault(trimmedActor, 0L) + 1);
                    }
                }
            }
            if (movie.getReleaseYear() != null) {
                Integer releaseYear = movie.getReleaseYear();
                statistics.getMovieCountByReleaseYear().put(releaseYear, statistics.getMovieCountByReleaseYear().getOrDefault(releaseYear, 0L) + 1);
            }

            if (movie.getWatchedDates() != null && !movie.getWatchedDates().isEmpty()) {
                for (LocalDate watchedDate : movie.getWatchedDates()) {
                    if (watchedDate != null && !watchedDate.isBefore(startDate) && !watchedDate.isAfter(endDate)) {
                        statistics.setTotalWatchTimeMinutes(
                                statistics.getTotalWatchTimeMinutes() + (movie.getRuntimeMinutes() != null ? movie.getRuntimeMinutes() : 0L)
                        );

                        uniqueWatchedDaysOverall.add(watchedDate);

                        String monthYear = watchedDate.format(MONTH_YEAR_FORMATTER);
                        statistics.getMovieCountByWatchedMonthAndYear().put(monthYear, statistics.getMovieCountByWatchedMonthAndYear().getOrDefault(monthYear, 0L) + 1);

                        allWatchedEvents.add(watchedDate);
                    }
                }
            }
        }

        statistics.setTotalWatchedMovies((long) allWatchedEvents.size());
        statistics.setTotalUniqueMovies((long) movies.size());

        statistics.setAverageUserRating(ratedMoviesCount > 0 ? sumUserRatings / ratedMoviesCount : 0.0);

        statistics.setTotalUniqueWatchedDays((long) uniqueWatchedDaysOverall.size());

        long daysInPeriod = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        double weeksInPeriod = daysInPeriod / 7.0;
        double monthsInPeriod = daysInPeriod / 30.4375;

        statistics.setAverageMoviesPerWeek(weeksInPeriod > 0 ? statistics.getTotalWatchedMovies() / weeksInPeriod : 0.0);
        statistics.setAverageMoviesPerMonth(monthsInPeriod > 0 ? statistics.getTotalWatchedMovies() / monthsInPeriod : 0.0);

        return statistics;
    }

    private String getGranularRatingKey(Movie movie) {
        BigDecimal userRatingBd = new BigDecimal(String.valueOf(movie.getUserRating()));
        BigDecimal granularRatingBd = userRatingBd.setScale(1, RoundingMode.FLOOR);

        BigDecimal minAllowed = BigDecimal.ZERO;
        BigDecimal maxAllowed = new BigDecimal("10.0");

        if (granularRatingBd.compareTo(minAllowed) < 0) {
            granularRatingBd = minAllowed;
        } else if (granularRatingBd.compareTo(maxAllowed) > 0) {
            granularRatingBd = maxAllowed;
        }

        return granularRatingBd.toPlainString();
    }
}