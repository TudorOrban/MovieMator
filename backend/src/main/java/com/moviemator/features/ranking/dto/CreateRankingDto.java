package com.moviemator.features.ranking.dto;

import com.moviemator.features.ranking.model.RankingData;
import com.moviemator.features.ranking.model.RankingType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateRankingDto {

    private Long userId;
    private String title;
    private String description;
    private List<String> tags;
    private RankingType rankingType;
    private RankingData rankingData;
}
