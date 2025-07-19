package com.moviemator.features.ranking.repository;

import com.moviemator.features.ranking.model.Ranking;
import com.moviemator.shared.search.models.PaginatedResults;
import com.moviemator.shared.search.models.SearchParams;

public interface RankingSearchRepository {

    PaginatedResults<Ranking> searchRankings(Long userId, SearchParams searchParams);
}
