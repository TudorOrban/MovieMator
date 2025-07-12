package com.moviemator.features.statistics.service;

import com.moviemator.features.statistics.model.UserStatistics;

import java.time.LocalDate;

public interface UserStatisticsService {

    UserStatistics getUserStatistics(Long userId, LocalDate startDate, LocalDate endDate);
}
