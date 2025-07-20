package com.moviemator.features.ranking.model;

import com.moviemator.features.movie.dto.MovieSmallDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TierListData {
    private List<TierData> tiers;
    private HashMap<String, List<MovieSmallDto>> tierMovies;
    private List<MovieSmallDto> availableMovies;
}
