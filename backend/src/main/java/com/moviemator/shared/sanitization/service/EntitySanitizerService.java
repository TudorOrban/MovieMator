package com.moviemator.shared.sanitization.service;

import com.moviemator.core.user.dto.CreateUserDto;
import com.moviemator.core.user.dto.UpdateUserDto;
import com.moviemator.features.movie.dto.CreateMovieDto;
import com.moviemator.features.movie.dto.UpdateMovieDto;
import com.moviemator.features.ranking.dto.CreateRankingDto;
import com.moviemator.features.ranking.dto.UpdateRankingDto;

public interface EntitySanitizerService {

    CreateUserDto sanitizeCreateUserDto(CreateUserDto userDto);
    UpdateUserDto sanitizeUpdateUserDto(UpdateUserDto userDto);
    CreateMovieDto sanitizeCreateMovieDto(CreateMovieDto movieDto);
    UpdateMovieDto sanitizeUpdateMovieDto(UpdateMovieDto movieDto);
    CreateRankingDto sanitizeCreateRankingDto(CreateRankingDto userDto);
    UpdateRankingDto sanitizeUpdateRankingDto(UpdateRankingDto userDto);
}
