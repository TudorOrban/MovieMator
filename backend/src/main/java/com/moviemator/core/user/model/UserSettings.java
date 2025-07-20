package com.moviemator.core.user.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserSettings {
    private String appTheme = "light";

    private Boolean confirmDeletions = true;

    private String defaultMovieSortBy = "watchedDate";
    private Integer moviesPerRow = 3; // For big screens

    private StatsTimePeriodOption defaultStatsTimePeriod = StatsTimePeriodOption.LAST_YEAR;
}
