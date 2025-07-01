package com.moviemator.features.movie.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MovieSearchDto {
    private Long id;
    private Long userId;
    private Long tmdbId;
    private String title;
    private Integer releaseYear;
    private String posterUrl;
    private String director;
    private String plotSummary;
    private Integer userRating; // 1 to 10
    private String userReview;
    private LocalDate watchedDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
