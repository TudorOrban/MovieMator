package com.moviemator.features.movie.repository;

import com.moviemator.features.movie.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long> {

    List<Movie> findByUserId(Long userId);

    @Query("SELECT CASE WHEN COUNT(m) > 0 THEN TRUE ELSE FALSE END FROM Movie m WHERE m.userId = :userId AND m.title =:title")
    boolean hasNonUniqueTitle(@Param("userId") Long userId, @Param("title") String title);
}
