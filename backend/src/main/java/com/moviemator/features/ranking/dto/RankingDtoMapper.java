package com.moviemator.features.ranking.dto;

import com.moviemator.features.ranking.model.Ranking;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

@Mapper
public interface RankingDtoMapper {
    RankingDtoMapper INSTANCE = Mappers.getMapper(RankingDtoMapper.class);

    @Mapping(source = "ranking.id", target = "id")
    @Mapping(source = "ranking.userId", target = "userId")
    @Mapping(source = "ranking.title", target = "title")
    @Mapping(source = "ranking.description", target = "description")
    @Mapping(source = "ranking.tags", target = "tags")
    @Mapping(source = "ranking.lastViewedAt", target = "lastViewedAt")
    @Mapping(source = "ranking.rankingType", target = "rankingType")
    @Mapping(source = "ranking.rankingData", target = "rankingData")
    @Mapping(source = "ranking.createdAt", target = "createdAt")
    @Mapping(source = "ranking.updatedAt", target = "updatedAt")
    RankingDataDto rankingToRankingDataDto(Ranking ranking);

    @Mapping(source = "ranking.id", target = "id")
    @Mapping(source = "ranking.userId", target = "userId")
    @Mapping(source = "ranking.title", target = "title")
    @Mapping(source = "ranking.description", target = "description")
    @Mapping(source = "ranking.tags", target = "tags")
    @Mapping(source = "ranking.lastViewedAt", target = "lastViewedAt")
    @Mapping(source = "ranking.rankingType", target = "rankingType")
    @Mapping(source = "ranking.createdAt", target = "createdAt")
    @Mapping(source = "ranking.updatedAt", target = "updatedAt")
    RankingSearchDto rankingToRankingSearchDto(Ranking ranking);

    @Mapping(source = "userId", target = "userId")
    @Mapping(source = "title", target = "title")
    @Mapping(source = "description", target = "description")
    @Mapping(source = "tags", target = "tags")
    @Mapping(source = "rankingType", target = "rankingType")
    Ranking createRankingDtoToRanking(CreateRankingDto rankingDto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateRankingFromUpdateRankingDto(UpdateRankingDto rankingDto, @MappingTarget Ranking ranking);
}
