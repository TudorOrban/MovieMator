package com.moviemator.core.user.controller;

import com.moviemator.core.user.dto.CreateUserDto;
import com.moviemator.core.user.dto.UpdateUserDto;
import com.moviemator.core.user.dto.UserDataDto;
import com.moviemator.core.user.service.UserService;
import com.moviemator.features.movie.dto.CreateMovieDto;
import com.moviemator.features.movie.dto.MovieDataDto;
import com.moviemator.features.movie.dto.UpdateMovieDto;
import com.moviemator.features.movie.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.List;

@Component("userSecurity")
public class UserSecurityExpressions {

    private final UserService userService;
    private final MovieService movieService;

    @Autowired
    public UserSecurityExpressions(
            UserService userService,
            MovieService movieService
    ) {
        this.userService = userService;
        this.movieService = movieService;
    }

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
                    return false;
                }
            }
            return true;
        } catch (Exception e) {
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
}
