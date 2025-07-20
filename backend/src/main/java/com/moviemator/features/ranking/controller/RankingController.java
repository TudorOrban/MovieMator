package com.moviemator.features.ranking.controller;

import com.moviemator.features.ranking.dto.CreateRankingDto;
import com.moviemator.features.ranking.dto.RankingDataDto;
import com.moviemator.features.ranking.dto.RankingSearchDto;
import com.moviemator.features.ranking.dto.UpdateRankingDto;
import com.moviemator.features.ranking.service.RankingService;
import com.moviemator.shared.search.models.PaginatedResults;
import com.moviemator.shared.search.models.SearchParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("api/v1/rankings")
public class RankingController {

    private final RankingService rankingService;

    @Autowired
    public RankingController(RankingService rankingService) {
        this.rankingService = rankingService;
    }

    @GetMapping("/search/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isSearchingOwnRankings(#userId, authentication) or @userSecurity.isProfilePublic(#userId)")
    public ResponseEntity<PaginatedResults<RankingSearchDto>> searchRankings(
            @PathVariable Long userId,
            @RequestParam(value = "searchText", required = false, defaultValue = "") String searchText,
            @RequestParam(value = "sortBy", required = false, defaultValue = "createdAt") String sortBy,
            @RequestParam(value = "isAscending", required = false, defaultValue = "true") Boolean isAscending,
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "itemsPerPage", defaultValue = "10") Integer itemsPerPage
    ) {
        SearchParams searchParams = new SearchParams(
                searchText, sortBy, isAscending, page, itemsPerPage
        );

        PaginatedResults<RankingSearchDto> results = rankingService.searchRankings(userId, searchParams);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isRankingOwnerById(#id, authentication) or @userSecurity.canAccessPublicProfileRanking(#id, authentication)")
    public ResponseEntity<RankingDataDto> getRankingById(@PathVariable Long id) {
        RankingDataDto ranking = rankingService.getRankingById(id);
        return ResponseEntity.ok(ranking);
    }

    @GetMapping("/ranking-title/{rankingTitle}/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isCheckingOwnRankingTitles(#userId, authentication)")
    public ResponseEntity<Boolean> isRankingTitleUnique(@PathVariable Long userId, @PathVariable String rankingTitle) {
        Boolean isRankingTitleUnique = rankingService.isRankingTitleUnique(userId, rankingTitle);
        return ResponseEntity.ok(isRankingTitleUnique);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isRankingOwnerForCreate(#rankingDto, authentication)")
    public ResponseEntity<RankingDataDto> createRanking(@RequestBody CreateRankingDto rankingDto) {
        RankingDataDto createdRanking = rankingService.createRanking(rankingDto);
        return ResponseEntity.ok(createdRanking);
    }

    @PostMapping("/bulk")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isRankingOwnerForCreateBulk(#rankingDtos, authentication)")
    public ResponseEntity<List<RankingDataDto>> createRankings(@RequestBody List<CreateRankingDto> rankingDtos) {
        List<RankingDataDto> createdRankings = rankingService.createRankingsBulk(rankingDtos);
        return ResponseEntity.ok(createdRankings);
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isRankingOwnerForUpdate(#rankingDto, authentication)")
    public ResponseEntity<RankingDataDto> updateRanking(@RequestBody UpdateRankingDto rankingDto) {
        RankingDataDto updatedRanking = rankingService.updateRanking(rankingDto);
        return ResponseEntity.ok(updatedRanking);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isRankingOwnerById(#id, authentication)")
    public ResponseEntity<Void> deleteRanking(@PathVariable Long id) {
        rankingService.deleteRanking(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/bulk")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.areAllRankingsOwnedByAuthenticatedUser(#ids, authentication)")
    public ResponseEntity<Void> deleteRankings(@RequestBody List<Long> ids) {
        rankingService.deleteRankings(ids);
        return ResponseEntity.ok().build();
    }
}
