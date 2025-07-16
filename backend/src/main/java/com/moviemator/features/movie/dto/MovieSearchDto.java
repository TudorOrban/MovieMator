package com.moviemator.features.movie.dto;

import com.moviemator.features.movie.model.MovieStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MovieSearchDto {
    private Long id;
    private Long userId;
    private Long tmdbId;
    private String title;

    private MovieStatus status;
    private LocalDate watchedDate;
    private Float userRating; // 1 to 10
    private String userReview;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Integer releaseYear;
    private String posterUrl;
    private String director;
    private String plotSummary;
    private Integer runtimeMinutes;
    private List<String> genres;
    private List<String> actors;

    // New
    private List<LocalDate> watchedDates;
}
