package com.moviemator.features.statistics.service;

import com.moviemator.features.movie.model.Movie;
import com.moviemator.features.movie.repository.MovieRepository;
import com.moviemator.features.statistics.model.UserStatistics;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class UserStatisticsServiceImpl implements UserStatisticsService {

    private final MovieRepository movieRepository;

    @Autowired
    public UserStatisticsServiceImpl(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public UserStatistics getUserStatistics(Long userId, LocalDate startDate, LocalDate endDate) {
        UserStatistics statistics = new UserStatistics();
        statistics.setStartDate(startDate);
        statistics.setEndDate(endDate);

        List<Movie> movies = movieRepository.findByUserIdAndTimePeriod(userId, startDate, endDate);

        return statistics;
    }
}
