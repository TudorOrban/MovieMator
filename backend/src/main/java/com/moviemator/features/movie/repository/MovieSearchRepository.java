package com.moviemator.features.movie.repository;

import com.moviemator.features.movie.model.Movie;
import com.moviemator.shared.search.models.MovieFilters;
import com.moviemator.shared.search.models.PaginatedResults;
import com.moviemator.shared.search.models.SearchParams;

public interface MovieSearchRepository {

    PaginatedResults<Movie> searchMovies(Long userId, SearchParams searchParams, MovieFilters movieFilters);
}
