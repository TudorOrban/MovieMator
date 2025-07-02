package com.moviemator.features.movie.controller;

import com.moviemator.features.movie.dto.CreateMovieDto;
import com.moviemator.features.movie.dto.MovieDataDto;
import com.moviemator.features.movie.dto.MovieSearchDto;
import com.moviemator.features.movie.dto.UpdateMovieDto;
import com.moviemator.features.movie.service.MovieService;
import com.moviemator.shared.search.models.MovieFilters;
import com.moviemator.shared.search.models.PaginatedResults;
import com.moviemator.shared.search.models.SearchParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("api/v1/movies")
public class MovieController {

    private final MovieService movieService;

    @Autowired
    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping("/search/user/{userId}")
    public ResponseEntity<PaginatedResults<MovieSearchDto>> searchMovies(
            @PathVariable Long userId,
            @RequestParam(value = "searchText", required = false, defaultValue = "") String searchText,
            @RequestParam(value = "sortBy", required = false, defaultValue = "createdAt") String sortBy,
            @RequestParam(value = "isAscending", required = false, defaultValue = "true") Boolean isAscending,
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "itemsPerPage", defaultValue = "10") Integer itemsPerPage,
            // Filter parameters
            @RequestParam(value = "releaseYearFrom", required = false) Integer releaseYearFrom,
            @RequestParam(value = "releaseYearTo", required = false) Integer releaseYearTo,
            @RequestParam(value = "director", required = false) String director,
            @RequestParam(value = "userRatingFrom", required = false) Integer userRatingFrom,
            @RequestParam(value = "userRatingTo", required = false) Integer userRatingTo,
            @RequestParam(value = "watchedDateFrom", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate watchedDateFrom,
            @RequestParam(value = "watchedDateTo", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate watchedDateTo
    ) {

        SearchParams searchParams = new SearchParams(
                searchText, sortBy, isAscending, page, itemsPerPage
        );
        MovieFilters movieFilters = new MovieFilters(
                releaseYearFrom, releaseYearTo, director, userRatingFrom, userRatingTo, watchedDateFrom, watchedDateTo
        );

        PaginatedResults<MovieSearchDto> results = movieService.searchMovies(userId, searchParams, movieFilters);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovieDataDto> getMovieById(@PathVariable Long id) {
        MovieDataDto movie = movieService.getMovieById(id);
        return ResponseEntity.ok(movie);
    }

    @PostMapping
    public ResponseEntity<MovieDataDto> createMovie(@RequestBody CreateMovieDto movieDto) {
        MovieDataDto createdMovie = movieService.createMovie(movieDto);
        return ResponseEntity.ok(createdMovie);
    }

    @PutMapping
    public ResponseEntity<MovieDataDto> updateMovie(@RequestBody UpdateMovieDto movieDto) {
        MovieDataDto updatedMovie = movieService.updateMovie(movieDto);
        return ResponseEntity.ok(updatedMovie);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/bulk")
    public ResponseEntity<Void> deleteMovies(@RequestBody List<Long> ids) {
        movieService.deleteMovies(ids);
        return ResponseEntity.ok().build();
    }
}
