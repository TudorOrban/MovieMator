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
public class MovieDataDto {
    private Long id;
    private Long userId;
    private Long tmdbId;
    private String title;
    private Integer releaseYear;
    private String posterUrl;
    private String director;
    private String plotSummary;
    private Float userRating; // 1 to 10
    private String userReview;
    private LocalDate watchedDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // New
    private MovieStatus status;
    private Integer runtimeMinutes;
    private List<String> genres;
    private List<String> actors;
}
