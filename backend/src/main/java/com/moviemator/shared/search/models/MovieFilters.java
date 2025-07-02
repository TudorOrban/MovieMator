package com.moviemator.shared.search.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MovieFilters {
    private Integer releaseYearFrom;
    private Integer releaseYearTo;
    private String director;
    private Integer userRatingFrom;
    private Integer userRatingTo;
    private LocalDate watchedDateFrom;
    private LocalDate watchedDateTo;
}
