package com.moviemator.shared.service;

import com.moviemator.features.movie.dto.CreateMovieDto;
import com.moviemator.features.movie.dto.UpdateMovieDto;

public interface EntitySanitizerService {


    CreateMovieDto sanitizeCreateMovieDto(CreateMovieDto movieDto);
    UpdateMovieDto sanitizeUpdateMovieDto(UpdateMovieDto movieDto);
}
