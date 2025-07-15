package com.moviemator.shared.search.models;

import com.moviemator.features.movie.model.MovieStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MovieFilters {
    private Integer releaseYearFrom;
    private Integer releaseYearTo;
    private String director;
    private Float userRatingFrom;
    private Float userRatingTo;
    private LocalDate watchedDateFrom;
    private LocalDate watchedDateTo;
    private MovieStatus status;
    private Integer runtimeMinutesLessThan;
    private Integer runtimeMinutesMoreThan;
    private List<String> genresIncluding;
    private List<String> actorsIncluding;
}
