package com.moviemator.features.statistics.controller;

import com.moviemator.features.statistics.model.UserStatistics;
import com.moviemator.features.statistics.service.UserStatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("api/v1/user-statistics")
public class UserStatisticsController {

    private final UserStatisticsService statisticsService;

    @Autowired
    public UserStatisticsController(UserStatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    @GetMapping("/user/${userId}")
    public ResponseEntity<UserStatistics> getUserStatistics(
            @PathVariable Long userId,
            @RequestParam(name = "startDate") LocalDate startDate,
            @RequestParam(name = "endDate") LocalDate endDate
    ) {
        UserStatistics userStatistics = statisticsService.getUserStatistics(userId, startDate, endDate);
        return ResponseEntity.ok(userStatistics);
    }

    
}
