package com.moviemator.features.movie.repository;

import com.moviemator.features.movie.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long>, MovieSearchRepository {

    List<Movie> findByUserId(Long userId);

    @Query("SELECT m FROM Movie m WHERE m.userId = :userId AND m.watchedDate IS NOT NULL and m.watchedDate BETWEEN :startDate AND :endDate")
    List<Movie> findByUserIdAndTimePeriod(Long userId, LocalDate startDate, LocalDate endDate);

    @Query(value = "SELECT m.* FROM movies m " +
            "WHERE m.user_id = :userId " +
            "AND EXISTS (SELECT 1 FROM jsonb_array_elements_text(m.watched_dates) AS elem " +
            "            WHERE CAST(elem AS DATE) BETWEEN :startDate AND :endDate)",
            nativeQuery = true)
    List<Movie> findByUserIdAndAnyWatchedDateInPeriod(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT CASE WHEN COUNT(m) > 0 THEN TRUE ELSE FALSE END FROM Movie m WHERE m.userId = :userId AND m.title =:title")
    boolean hasNonUniqueTitle(@Param("userId") Long userId, @Param("title") String title);

    @Query("SELECT m.watchedDate FROM Movie m WHERE m.userId = :userId AND m.watchedDate IS NOT NULL")
    List<LocalDate> findWatchedDatesByUserId(@Param("userId") Long userId);

    @Query(value = "SELECT CAST(jsonb_array_elements_text(m.watched_dates) AS DATE) " +
            "FROM movies m " +
            "WHERE m.user_id = :userId " +
            "AND m.watched_dates IS NOT NULL " +
            "AND jsonb_array_length(m.watched_dates) > 0",
            nativeQuery = true)
    List<Date> findAllWatchedDatesByUserId(@Param("userId") Long userId);
}
