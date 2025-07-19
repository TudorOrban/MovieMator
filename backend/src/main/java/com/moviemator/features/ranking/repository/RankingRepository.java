package com.moviemator.features.ranking.repository;

import com.moviemator.features.ranking.model.Ranking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RankingRepository extends JpaRepository<Ranking, Long>, RankingSearchRepository {

    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN TRUE ELSE FALSE END FROM Ranking r WHERE r.userId = :userId AND r.title =:title")
    boolean hasNonUniqueTitle(@Param("userId") Long userId, @Param("title") String title);
}
