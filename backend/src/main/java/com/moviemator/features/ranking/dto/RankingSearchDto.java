package com.moviemator.features.ranking.dto;

import com.moviemator.features.ranking.model.RankingType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RankingSearchDto {

    private Long id;
    private Long userId;
    private String title;
    private String description;
    private List<String> tags;
    private LocalDateTime lastViewedAt;
    private RankingType rankingType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
