package com.moviemator.features.ranking.service;

import com.moviemator.features.ranking.dto.CreateRankingDto;
import com.moviemator.features.ranking.dto.RankingDataDto;
import com.moviemator.features.ranking.dto.RankingSearchDto;
import com.moviemator.features.ranking.dto.UpdateRankingDto;
import com.moviemator.shared.search.models.PaginatedResults;
import com.moviemator.shared.search.models.SearchParams;

import java.util.List;

public interface RankingService {

    PaginatedResults<RankingSearchDto> searchRankings(Long userId, SearchParams searchParams);
    RankingDataDto getRankingById(Long id);
    boolean isRankingTitleUnique(Long userId, String title);
    RankingDataDto createRanking(CreateRankingDto rankingDto);
    List<RankingDataDto> createRankingsBulk(List<CreateRankingDto> rankingDtos);
    RankingDataDto updateRanking(UpdateRankingDto rankingDto);
    void deleteRanking(Long id);
    void deleteRankings(List<Long> ids);
}
