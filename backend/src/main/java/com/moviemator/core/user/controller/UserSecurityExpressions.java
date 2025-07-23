package com.moviemator.core.user.controller;

import com.moviemator.core.user.dto.CreateUserDto;
import com.moviemator.core.user.dto.UpdateUserDto;
import com.moviemator.core.user.dto.UserDataDto;
import com.moviemator.core.user.model.User;
import com.moviemator.core.user.repository.UserRepository;
import com.moviemator.core.user.service.UserService;
import com.moviemator.features.movie.dto.CreateMovieDto;
import com.moviemator.features.movie.dto.MovieDataDto;
import com.moviemator.features.movie.dto.UpdateMovieDto;
import com.moviemator.features.movie.service.MovieService;
import com.moviemator.features.ranking.dto.CreateRankingDto;
import com.moviemator.features.ranking.dto.RankingDataDto;
import com.moviemator.features.ranking.dto.UpdateRankingDto;
import com.moviemator.features.ranking.service.RankingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.List;

@Component("userSecurity")
public class UserSecurityExpressions {

    private final UserService userService;
    private final UserRepository userRepository;
    private final MovieService movieService;
    private final RankingService rankingService;

    @Autowired
    public UserSecurityExpressions(
            UserService userService,
            UserRepository userRepository,
            MovieService movieService,
            RankingService rankingService
    ) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.movieService = movieService;
        this.rankingService = rankingService;
    }

    // User
    public boolean canCreateUserWithCognitoId(CreateUserDto userDto, Authentication authentication) {
        if (authentication == null || authentication.getName() == null || userDto == null || userDto.getCognitoUserId() == null) {
            return false;
        }
        return userDto.getCognitoUserId().equals(authentication.getName());
    }

    public boolean isUserOrAdmin(Long userId, Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return false;
        }

        try {
            UserDataDto authenticatedUser = userService.getUserByCognitoUserId(authentication.getName());
            return authenticatedUser != null && authenticatedUser.getId().equals(userId);
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isCognitoUserOrAdmin(String cognitoUserId, Authentication authentication) {
        if (authentication == null || authentication.getName() == null || cognitoUserId == null) {
            return false;
        }
        return cognitoUserId.equals(authentication.getName());
    }

    public boolean canUpdateUser(UpdateUserDto userDto, Authentication authentication) {
        if (authentication == null || authentication.getName() == null || userDto == null || userDto.getId() == null) {
            return false;
        }
        try {
            UserDataDto authenticatedUser = userService.getUserByCognitoUserId(authentication.getName());
            return authenticatedUser != null && authenticatedUser.getId().equals(userDto.getId());
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isProfilePublic(Long id) {
        return userRepository.findById(id)
                .map(User::getIsProfilePublic)
                .orElse(false);
    }

    // Movie
    public boolean isMovieOwnerById(Long movieId, Authentication authentication) {
        if (authentication == null || authentication.getName() == null || movieId == null) {
            return false;
        }
        try {
            UserDataDto authenticatedUser = userService.getUserByCognitoUserId(authentication.getName());
            if (authenticatedUser == null) {
                return false;
            }
            MovieDataDto movie = movieService.getMovieById(movieId);
            return movie != null && movie.getUserId().equals(authenticatedUser.getId());
        } catch (Exception e) {
            return false;
        }
    }

    public boolean canAccessPublicProfileMovie(Long movieId, Authentication authentication) {
        if (authentication == null || authentication.getName() == null || movieId == null) {
            return false;
        }
        try {
            UserDataDto authenticatedUser = userService.getUserByCognitoUserId(authentication.getName());
            if (authenticatedUser == null) {
                return false;
            }
            MovieDataDto movie = movieService.getMovieById(movieId);
            if (movie == null) {
                return false;
            }

            User movieUser = userRepository.findById(movie.getUserId()).orElseThrow(RuntimeException::new);
            return movieUser.getIsProfilePublic();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean areAllMoviesOwnedByAuthenticatedUser(List<Long> movieIds, Authentication authentication) {
        if (authentication == null || authentication.getName() == null || movieIds == null || movieIds.isEmpty()) {
            return false;
        }
        try {
            UserDataDto authenticatedUser = userService.getUserByCognitoUserId(authentication.getName());
            if (authenticatedUser == null) {
                return false;
            }
            Long authenticatedUserId = authenticatedUser.getId();

            for (Long movieId : movieIds) {
                MovieDataDto movie = movieService.getMovieById(movieId);
                if (movie == null || !movie.getUserId().equals(authenticatedUserId)) {
                    System.out.println("Mo" + movie.getId());
                    return false;
                }
            }
            return true;
        } catch (Exception e) {
            System.out.println("Error in areAllMoviesOwnedByAuthenticatedUser: " + e.getMessage());
            return false;
        }
    }

    public boolean isSearchingOwnMovies(Long targetUserId, Authentication authentication) {
        if (authentication == null || authentication.getName() == null || targetUserId == null) {
            return false;
        }
        try {
            UserDataDto authenticatedUser = userService.getUserByCognitoUserId(authentication.getName());
            return authenticatedUser != null && authenticatedUser.getId().equals(targetUserId);
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isCheckingOwnMovieTitles(Long targetUserId, Authentication authentication) {
        if (authentication == null || authentication.getName() == null || targetUserId == null) {
            return false;
        }
        try {
            UserDataDto authenticatedUser = userService.getUserByCognitoUserId(authentication.getName());
            return authenticatedUser != null && authenticatedUser.getId().equals(targetUserId);
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isFetchingOwnWatchedDates(Long targetUserId, Authentication authentication) {
        if (authentication == null || authentication.getName() == null || targetUserId == null) {
            return false;
        }
        try {
            UserDataDto authenticatedUser = userService.getUserByCognitoUserId(authentication.getName());
            return authenticatedUser != null && authenticatedUser.getId().equals(targetUserId);
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isMovieOwnerForCreate(CreateMovieDto movieDto, Authentication authentication) {
        if (authentication == null || authentication.getName() == null || movieDto == null || movieDto.getUserId() == null) {
            return false;
        }
        try {
            UserDataDto authenticatedUser = userService.getUserByCognitoUserId(authentication.getName());
            return authenticatedUser != null && authenticatedUser.getId().equals(movieDto.getUserId());
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isMovieOwnerForCreateBulk(List<CreateMovieDto> movieDtos, Authentication authentication) {
        if (authentication == null || authentication.getName() == null || movieDtos == null) {
            return false;
        }
        try {
            UserDataDto authenticatedUser = userService.getUserByCognitoUserId(authentication.getName());
            if (authenticatedUser == null) return false;
            Long authUserId = authenticatedUser.getId();

            for (CreateMovieDto movieDto : movieDtos) {
                if (!authUserId.equals(movieDto.getUserId())) {
                    return false;
                }
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isMovieOwnerForUpdate(UpdateMovieDto movieDto, Authentication authentication) {
        if (authentication == null || authentication.getName() == null || movieDto == null || movieDto.getUserId() == null) {
            return false;
        }
        try {
            UserDataDto authenticatedUser = userService.getUserByCognitoUserId(authentication.getName());
            return authenticatedUser != null && authenticatedUser.getId().equals(movieDto.getUserId());
        } catch (Exception e) {
            return false;
        }
    }

    // Ranking
    public boolean isRankingOwnerById(Long rankingId, Authentication authentication) {
        if (authentication == null || authentication.getName() == null || rankingId == null) {
            return false;
        }
        try {
            UserDataDto authenticatedUser = userService.getUserByCognitoUserId(authentication.getName());
            if (authenticatedUser == null) {
                return false;
            }
            RankingDataDto ranking = rankingService.getRankingById(rankingId);
            return ranking != null && ranking.getUserId().equals(authenticatedUser.getId());
        } catch (Exception e) {
            return false;
        }
    }

    public boolean canAccessPublicProfileRanking(Long rankingId, Authentication authentication) {
        if (authentication == null || authentication.getName() == null || rankingId == null) {
            return false;
        }
        try {
            UserDataDto authenticatedUser = userService.getUserByCognitoUserId(authentication.getName());
            if (authenticatedUser == null) {
                return false;
            }
            RankingDataDto ranking = rankingService.getRankingById(rankingId);
            if (ranking == null) {
                return false;
            }

            User rankingUser = userRepository.findById(ranking.getUserId()).orElseThrow(RuntimeException::new);
            return rankingUser.getIsProfilePublic();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean areAllRankingsOwnedByAuthenticatedUser(List<Long> rankingIds, Authentication authentication) {
        if (authentication == null || authentication.getName() == null || rankingIds == null || rankingIds.isEmpty()) {
            return false;
        }
        try {
            UserDataDto authenticatedUser = userService.getUserByCognitoUserId(authentication.getName());
            if (authenticatedUser == null) {
                return false;
            }
            Long authenticatedUserId = authenticatedUser.getId();

            for (Long rankingId : rankingIds) {
                RankingDataDto ranking = rankingService.getRankingById(rankingId);
                if (ranking == null || !ranking.getUserId().equals(authenticatedUserId)) {
                    return false;
                }
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isSearchingOwnRankings(Long targetUserId, Authentication authentication) {
        if (authentication == null || authentication.getName() == null || targetUserId == null) {
            return false;
        }
        try {
            UserDataDto authenticatedUser = userService.getUserByCognitoUserId(authentication.getName());
            return authenticatedUser != null && authenticatedUser.getId().equals(targetUserId);
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isCheckingOwnRankingTitles(Long targetUserId, Authentication authentication) {
        if (authentication == null || authentication.getName() == null || targetUserId == null) {
            return false;
        }
        try {
            UserDataDto authenticatedUser = userService.getUserByCognitoUserId(authentication.getName());
            return authenticatedUser != null && authenticatedUser.getId().equals(targetUserId);
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isRankingOwnerForCreate(CreateRankingDto rankingDto, Authentication authentication) {
        if (authentication == null || authentication.getName() == null || rankingDto == null || rankingDto.getUserId() == null) {
            return false;
        }
        try {
            UserDataDto authenticatedUser = userService.getUserByCognitoUserId(authentication.getName());
            return authenticatedUser != null && authenticatedUser.getId().equals(rankingDto.getUserId());
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isRankingOwnerForCreateBulk(List<CreateRankingDto> rankingDtos, Authentication authentication) {
        if (authentication == null || authentication.getName() == null || rankingDtos == null) {
            return false;
        }
        try {
            UserDataDto authenticatedUser = userService.getUserByCognitoUserId(authentication.getName());
            if (authenticatedUser == null) return false;
            Long authUserId = authenticatedUser.getId();

            for (CreateRankingDto rankingDto : rankingDtos) {
                if (!authUserId.equals(rankingDto.getUserId())) {
                    return false;
                }
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isRankingOwnerForUpdate(UpdateRankingDto rankingDto, Authentication authentication) {
        if (authentication == null || authentication.getName() == null || rankingDto == null || rankingDto.getUserId() == null) {
            return false;
        }
        try {
            UserDataDto authenticatedUser = userService.getUserByCognitoUserId(authentication.getName());
            return authenticatedUser != null && authenticatedUser.getId().equals(rankingDto.getUserId());
        } catch (Exception e) {
            return false;
        }
    }
}
