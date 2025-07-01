package com.moviemator.features.movie.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "movies")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "tmdb_id", nullable = false)
    private Long tmdbId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "release_year")
    private Integer releaseYear;

    @Column(name = "poster_url")
    private String posterUrl;

    @Column(name = "director")
    private String director;

    @Column(name = "plot_summary")
    private String plotSummary;

    @Column(name = "user_rating")
    private Integer userRating; // 1 to 10

    @Column(name = "user_review")
    private String userReview;

    @Column(name = "watched_date")
    private LocalDate watchedDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
