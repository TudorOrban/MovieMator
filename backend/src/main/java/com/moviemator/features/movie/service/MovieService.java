package com.moviemator.features.movie.service;

import com.moviemator.features.movie.dto.CreateMovieDto;
import com.moviemator.features.movie.dto.MovieDataDto;
import com.moviemator.features.movie.dto.MovieSearchDto;
import com.moviemator.features.movie.dto.UpdateMovieDto;
import com.moviemator.shared.search.models.PaginatedResults;
import com.moviemator.shared.search.models.SearchParams;

import java.util.List;

public interface MovieService {

    PaginatedResults<MovieSearchDto> searchMovies(Long userId, SearchParams searchParams);
    MovieDataDto getMovieById(Long id);
    MovieDataDto createMovie(CreateMovieDto movieDto);
    MovieDataDto updateMovie(UpdateMovieDto movieDto);
    void deleteMovie(Long id);
    void deleteMovies(List<Long> ids);
}
