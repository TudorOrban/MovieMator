package com.moviemator.features.ranking.service;

import com.moviemator.core.user.repository.UserRepository;
import com.moviemator.features.ranking.dto.*;
import com.moviemator.features.ranking.model.Ranking;
import com.moviemator.features.ranking.repository.RankingRepository;
import com.moviemator.shared.error.types.ResourceAlreadyExistsException;
import com.moviemator.shared.error.types.ResourceIdentifierType;
import com.moviemator.shared.error.types.ResourceNotFoundException;
import com.moviemator.shared.error.types.ResourceType;
import com.moviemator.shared.sanitization.service.EntitySanitizerService;
import com.moviemator.shared.search.models.PaginatedResults;
import com.moviemator.shared.search.models.SearchParams;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RankingServiceImpl implements RankingService {

    private final RankingRepository rankingRepository;
    private final UserRepository userRepository;
    private final EntitySanitizerService sanitizerService;

    @Autowired
    public RankingServiceImpl(
            RankingRepository rankingRepository,
            UserRepository userRepository,
            EntitySanitizerService sanitizerService
    ) {
        this.rankingRepository = rankingRepository;
        this.userRepository = userRepository;
        this.sanitizerService = sanitizerService;
    }

    public PaginatedResults<RankingSearchDto> searchRankings(Long userId, SearchParams searchParams) {
        PaginatedResults<Ranking> results = rankingRepository.searchRankings(userId, searchParams);

        return new PaginatedResults<>(
                results.getResults().stream().map(RankingDtoMapper.INSTANCE::rankingToRankingSearchDto).toList(),
                results.getTotalCount()
        );
    }

    public RankingDataDto getRankingById(Long id) {
        Ranking ranking = rankingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id.toString(), ResourceType.RANKING, ResourceIdentifierType.ID));

        return RankingDtoMapper.INSTANCE.rankingToRankingDataDto(ranking);
    }

    public boolean isRankingTitleUnique(Long userId, String title) {
        return !this.rankingRepository.hasNonUniqueTitle(userId, title);
    }

    @Transactional
    public RankingDataDto createRanking(CreateRankingDto rankingDto) {
        CreateRankingDto sanitizedDto = sanitizerService.sanitizeCreateRankingDto(rankingDto);

        if (!userRepository.existsById(sanitizedDto.getUserId())) {
            throw new ResourceNotFoundException(sanitizedDto.getUserId().toString(), ResourceType.USER, ResourceIdentifierType.ID);
        }
        if (rankingRepository.hasNonUniqueTitle(sanitizedDto.getUserId(), sanitizedDto.getTitle())) {
            throw new ResourceAlreadyExistsException(sanitizedDto.getTitle(), ResourceType.MOVIE, ResourceIdentifierType.TITLE);
        }

        Ranking ranking = RankingDtoMapper.INSTANCE.createRankingDtoToRanking(rankingDto);

        Ranking savedRanking = rankingRepository.save(ranking);

        return RankingDtoMapper.INSTANCE.rankingToRankingDataDto(savedRanking);
    }

    @Transactional
    public List<RankingDataDto> createRankingsBulk(List<CreateRankingDto> rankingDtos) {
        List<Ranking> sanitizedRankings = new ArrayList<>();

        for (CreateRankingDto rankingDto : rankingDtos) {
            CreateRankingDto sanitizedDto = sanitizerService.sanitizeCreateRankingDto(rankingDto);

            if (!userRepository.existsById(sanitizedDto.getUserId())) {
                throw new ResourceNotFoundException(sanitizedDto.getUserId().toString(), ResourceType.USER, ResourceIdentifierType.ID);
            }
            if (rankingRepository.hasNonUniqueTitle(sanitizedDto.getUserId(), sanitizedDto.getTitle())) {
                throw new ResourceAlreadyExistsException(sanitizedDto.getTitle(), ResourceType.MOVIE, ResourceIdentifierType.TITLE);
            }

            Ranking ranking = RankingDtoMapper.INSTANCE.createRankingDtoToRanking(sanitizedDto);
            sanitizedRankings.add(ranking);
        }

        List<Ranking> savedRankings = rankingRepository.saveAll(sanitizedRankings);

        return savedRankings.stream().map(RankingDtoMapper.INSTANCE::rankingToRankingDataDto).toList();
    }

    @Transactional
    public RankingDataDto updateRanking(UpdateRankingDto rankingDto) {
        UpdateRankingDto sanitizedDto = sanitizerService.sanitizeUpdateRankingDto(rankingDto);

        Ranking existingRanking = rankingRepository.findById(rankingDto.getId())
                .orElseThrow(() -> new ResourceNotFoundException(rankingDto.getId().toString(), ResourceType.MOVIE, ResourceIdentifierType.ID));

        RankingDtoMapper.INSTANCE.updateRankingFromUpdateRankingDto(sanitizedDto, existingRanking);

        Ranking updatedRanking = rankingRepository.save(existingRanking);

        return RankingDtoMapper.INSTANCE.rankingToRankingDataDto(updatedRanking);
    }

    public void deleteRanking(Long id) {
        Ranking existingRanking = rankingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id.toString(), ResourceType.MOVIE, ResourceIdentifierType.ID));

        rankingRepository.delete(existingRanking);
    }

    @Transactional
    public void deleteRankings(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return;
        }

        rankingRepository.deleteAllById(ids);
    }
}
