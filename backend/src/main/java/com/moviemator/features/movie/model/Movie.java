package com.moviemator.features.movie.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

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

    @Column(name = "plot_summary", columnDefinition = "TEXT")
    private String plotSummary;

    @Column(name = "user_rating")
    private Float userRating; // 1 to 10

    @Column(name = "user_review", columnDefinition = "TEXT")
    private String userReview;

    @Column(name = "watched_date")
    private LocalDate watchedDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private MovieStatus status;

    @Column(name = "runtime_minutes")
    private Integer runtimeMinutes;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "genres")
    private List<String> genres;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "actors")
    private List<String> actors;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "watched_dates")
    private List<String> watchedDates;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        updatedAt = LocalDateTime.now();
        if (watchedDates == null) {
            watchedDates = new ArrayList<>();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        if (watchedDates == null) {
            watchedDates = new ArrayList<>();
        }
        Collections.sort(watchedDates);
    }
//
//    public void addWatchedDate(String date) {
//        if (this.watchedDates == null) {
//            this.watchedDates = new ArrayList<>();
//        }
//        if (!this.watchedDates.contains(date)) {
//            this.watchedDates.add(date);
//            Collections.sort(this.watchedDates);
//        }
//    }
}
