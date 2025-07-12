package com.moviemator.features.movie.repository;

import com.moviemator.features.movie.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long>, MovieSearchRepository {

    List<Movie> findByUserId(Long userId);

    @Query("SELECT m FROM Movie m WHERE m.userId = :userId AND m.watchedDate IS NOT NULL and m.watchedDate BETWEEN :startDate AND :endDate")
    List<Movie> findByUserIdAndTimePeriod(Long userId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT CASE WHEN COUNT(m) > 0 THEN TRUE ELSE FALSE END FROM Movie m WHERE m.userId = :userId AND m.title =:title")
    boolean hasNonUniqueTitle(@Param("userId") Long userId, @Param("title") String title);

    @Query("SELECT m.watchedDate FROM Movie m WHERE m.userId = :userId AND m.watchedDate IS NOT NULL")
    List<LocalDate> findWatchedDatesByUserId(@Param("userId") Long userId);
}
