package com.moviemator.features.movie.service;

import com.moviemator.features.movie.dto.CreateMovieDto;
import com.moviemator.features.movie.dto.MovieDataDto;
import com.moviemator.features.movie.dto.MovieSearchDto;
import com.moviemator.features.movie.dto.UpdateMovieDto;
import com.moviemator.shared.search.models.MovieFilters;
import com.moviemator.shared.search.models.PaginatedResults;
import com.moviemator.shared.search.models.SearchParams;

import java.time.LocalDate;
import java.util.List;

public interface MovieService {

    PaginatedResults<MovieSearchDto> searchMovies(Long userId, SearchParams searchParams, MovieFilters movieFilters);
    MovieDataDto getMovieById(Long id);
    List<LocalDate> getWatchedMovieDatesForUser(Long userId);
    boolean isMovieTitleUnique(Long userId, String title);
    List<MovieSearchDto> getTopRatedMovies(Long userId, Integer limit);
    MovieDataDto createMovie(CreateMovieDto movieDto);
    List<MovieDataDto> createMoviesBulk(List<CreateMovieDto> movieDtos);
    MovieDataDto updateMovie(UpdateMovieDto movieDto);
    void deleteMovie(Long id);
    void deleteMovies(List<Long> ids);
}
