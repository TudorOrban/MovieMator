package com.moviemator.shared.sanitization.service;

import com.moviemator.core.user.dto.CreateUserDto;
import com.moviemator.core.user.dto.UpdateUserDto;
import com.moviemator.features.movie.dto.CreateMovieDto;
import com.moviemator.features.movie.dto.UpdateMovieDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EntitySanitizerServiceImpl implements EntitySanitizerService {

    private final SanitizationService sanitizationService;

    @Autowired
    public EntitySanitizerServiceImpl(SanitizationService sanitizationService) {
        this.sanitizationService = sanitizationService;
    }

    public CreateUserDto sanitizeCreateUserDto(CreateUserDto userDto) {
        userDto.setCognitoUserId(sanitizationService.sanitize(userDto.getCognitoUserId()));
        userDto.setEmail(sanitizationService.sanitize(userDto.getEmail()));

        return userDto;
    }

    public UpdateUserDto sanitizeUpdateUserDto(UpdateUserDto userDto) {
        userDto.setDisplayName(sanitizationService.sanitize(userDto.getDisplayName()));

        return userDto;
    }

    public CreateMovieDto sanitizeCreateMovieDto(CreateMovieDto movieDto) {
        movieDto.setTitle(sanitizationService.sanitize(movieDto.getTitle()));
        movieDto.setPosterUrl(sanitizationService.sanitize(movieDto.getPosterUrl()));
        movieDto.setDirector(sanitizationService.sanitize(movieDto.getDirector()));
        movieDto.setPlotSummary(sanitizationService.sanitize(movieDto.getPlotSummary()));
        movieDto.setUserReview(sanitizationService.sanitize(movieDto.getUserReview()));

        return movieDto;
    }

    public UpdateMovieDto sanitizeUpdateMovieDto(UpdateMovieDto movieDto) {
        movieDto.setTitle(sanitizationService.sanitize(movieDto.getTitle()));
        movieDto.setPosterUrl(sanitizationService.sanitize(movieDto.getPosterUrl()));
        movieDto.setDirector(sanitizationService.sanitize(movieDto.getDirector()));
        movieDto.setPlotSummary(sanitizationService.sanitize(movieDto.getPlotSummary()));
        movieDto.setUserReview(sanitizationService.sanitize(movieDto.getUserReview()));

        return movieDto;
    }
}
