package com.moviemator.features.ranking.repository;

import com.moviemator.features.ranking.model.Ranking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RankingRepository extends JpaRepository<Ranking, Long>, RankingSearchRepository {

}
