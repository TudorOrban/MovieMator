package com.moviemator.features.movie.controller;

import com.moviemator.core.user.service.UserService;
import com.moviemator.features.movie.dto.CreateMovieDto;
import com.moviemator.features.movie.dto.MovieDataDto;
import com.moviemator.features.movie.dto.MovieSearchDto;
import com.moviemator.features.movie.dto.UpdateMovieDto;
import com.moviemator.features.movie.model.MovieStatus;
import com.moviemator.features.movie.service.MovieService;
import com.moviemator.shared.search.models.MovieFilters;
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
@RequestMapping("api/v1/movies")
public class MovieController {

    private final MovieService movieService;

    @Autowired
    public MovieController(
            MovieService movieService
    ) {
        this.movieService = movieService;
    }

    @GetMapping("/search/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isSearchingOwnMovies(#userId, authentication)")
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
            @RequestParam(value = "watchedDateTo", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate watchedDateTo,
            // New
            @RequestParam(value = "status", required = false) MovieStatus status,
            @RequestParam(value = "runtimeMinutesLessThan", required = false) Integer runtimeMinutesLessThan,
            @RequestParam(value = "runtimeMinutesMoreThan", required = false) Integer runtimeMinutesMoreThan,
            @RequestParam(value = "genresIncluding", required = false) List<String> genresIncluding,
            @RequestParam(value = "actorsIncluding", required = false) List<String> actorsIncluding
    ) {

        SearchParams searchParams = new SearchParams(
                searchText, sortBy, isAscending, page, itemsPerPage
        );
        MovieFilters movieFilters = new MovieFilters(
                releaseYearFrom, releaseYearTo, director, userRatingFrom, userRatingTo, watchedDateFrom, watchedDateTo, status, runtimeMinutesLessThan, runtimeMinutesMoreThan, genresIncluding, actorsIncluding
        );

        PaginatedResults<MovieSearchDto> results = movieService.searchMovies(userId, searchParams, movieFilters);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isMovieOwnerById(#id, authentication)")
    public ResponseEntity<MovieDataDto> getMovieById(@PathVariable Long id) {
        MovieDataDto movie = movieService.getMovieById(id);
        return ResponseEntity.ok(movie);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isMovieOwnerForCreate(#movieDto, authentication)")
    public ResponseEntity<MovieDataDto> createMovie(@RequestBody CreateMovieDto movieDto) {
        MovieDataDto createdMovie = movieService.createMovie(movieDto);
        return ResponseEntity.ok(createdMovie);
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isMovieOwnerForUpdate(#movieDto, authentication)")
    public ResponseEntity<MovieDataDto> updateMovie(@RequestBody UpdateMovieDto movieDto) {
        MovieDataDto updatedMovie = movieService.updateMovie(movieDto);
        return ResponseEntity.ok(updatedMovie);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isMovieOwnerById(#id, authentication)")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/bulk")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.areAllMoviesOwnedByAuthenticatedUser(#ids, authentication)")
    public ResponseEntity<Void> deleteMovies(@RequestBody List<Long> ids) {
        movieService.deleteMovies(ids);
        return ResponseEntity.ok().build();
    }
}
