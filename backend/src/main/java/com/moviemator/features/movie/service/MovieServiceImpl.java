package com.moviemator.features.movie.service;

import com.moviemator.core.user.repository.UserRepository;
import com.moviemator.features.movie.dto.*;
import com.moviemator.features.movie.model.Movie;
import com.moviemator.features.movie.repository.MovieRepository;
import com.moviemator.shared.error.types.ResourceAlreadyExistsException;
import com.moviemator.shared.error.types.ResourceIdentifierType;
import com.moviemator.shared.error.types.ResourceNotFoundException;
import com.moviemator.shared.error.types.ResourceType;
import com.moviemator.shared.sanitization.service.EntitySanitizerService;
import com.moviemator.shared.search.models.MovieFilters;
import com.moviemator.shared.search.models.PaginatedResults;
import com.moviemator.shared.search.models.SearchParams;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Service
public class MovieServiceImpl implements MovieService {

    private final MovieRepository movieRepository;
    private final UserRepository userRepository;
    private final EntitySanitizerService sanitizerService;

    @Autowired
    public MovieServiceImpl(
            MovieRepository movieRepository,
            UserRepository userRepository,
            EntitySanitizerService sanitizerService
    ) {
        this.movieRepository = movieRepository;
        this.userRepository = userRepository;
        this.sanitizerService = sanitizerService;
    }

    public PaginatedResults<MovieSearchDto> searchMovies(Long userId, SearchParams searchParams, MovieFilters movieFilters) {
        PaginatedResults<Movie> results = movieRepository.searchMovies(userId, searchParams, movieFilters);

        return new PaginatedResults<>(
                results.getResults().stream().map(MovieDtoMapper.INSTANCE::movieToMovieSearchDto).toList(),
                results.getTotalCount()
        );
    }

    public MovieDataDto getMovieById(Long id) {
        Movie foundMovie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id.toString(), ResourceType.MOVIE, ResourceIdentifierType.ID));

        return MovieDtoMapper.INSTANCE.movieToMovieDataDto(foundMovie);
    }

    public List<LocalDate> getWatchedMovieDatesForUser(Long userId) {
        List<java.sql.Date> sqlDates = movieRepository.findAllWatchedDatesByUserId(userId);

        return sqlDates.stream()
                .map(java.sql.Date::toLocalDate)
                .toList();
    }

    public boolean isMovieTitleUnique(Long userId, String title) {
        return !movieRepository.hasNonUniqueTitle(userId, title);
    }

    public List<MovieSearchDto> getTopRatedMovies(Long userId, Integer limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by("userRating").descending());

        List<Movie> topMovies = movieRepository.findByUserIdOrderByUserRatingDesc(userId, pageable);

        return topMovies.stream().map(MovieDtoMapper.INSTANCE::movieToMovieSearchDto).toList();
    }

    @Transactional
    public MovieDataDto createMovie(CreateMovieDto movieDto) {
        CreateMovieDto sanitizedDto = sanitizerService.sanitizeCreateMovieDto(movieDto);

        if (!userRepository.existsById(sanitizedDto.getUserId())) {
            throw new ResourceNotFoundException(sanitizedDto.getUserId().toString(), ResourceType.USER, ResourceIdentifierType.ID);
        }
        if (movieRepository.hasNonUniqueTitle(sanitizedDto.getUserId(), sanitizedDto.getTitle())) {
            throw new ResourceAlreadyExistsException(sanitizedDto.getTitle(), ResourceType.MOVIE, ResourceIdentifierType.TITLE);
        }

        Movie movie = MovieDtoMapper.INSTANCE.createMovieDtoToMovie(sanitizedDto);

        Movie savedMovie = movieRepository.save(movie);

        return MovieDtoMapper.INSTANCE.movieToMovieDataDto(savedMovie);
    }

    @Transactional
    public List<MovieDataDto> createMoviesBulk(List<CreateMovieDto> movieDtos) {
        List<Movie> sanitizedMovies = new ArrayList<>();

        for (CreateMovieDto movieDto : movieDtos) {
            CreateMovieDto sanitizedDto = sanitizerService.sanitizeCreateMovieDto(movieDto);

            if (!userRepository.existsById(sanitizedDto.getUserId())) {
                throw new ResourceNotFoundException(sanitizedDto.getUserId().toString(), ResourceType.USER, ResourceIdentifierType.ID);
            }
            if (movieRepository.hasNonUniqueTitle(sanitizedDto.getUserId(), sanitizedDto.getTitle())) {
                throw new ResourceAlreadyExistsException(sanitizedDto.getTitle(), ResourceType.MOVIE, ResourceIdentifierType.TITLE);
            }

            Movie movie = MovieDtoMapper.INSTANCE.createMovieDtoToMovie(sanitizedDto);
            sanitizedMovies.add(movie);
        }

        List<Movie> savedMovies = movieRepository.saveAll(sanitizedMovies);

        return savedMovies.stream().map(MovieDtoMapper.INSTANCE::movieToMovieDataDto).toList();
    }

    @Transactional
    public MovieDataDto updateMovie(UpdateMovieDto movieDto) {
        UpdateMovieDto sanitizedDto = sanitizerService.sanitizeUpdateMovieDto(movieDto);

        Movie existingMovie = movieRepository.findById(movieDto.getId())
                .orElseThrow(() -> new ResourceNotFoundException(movieDto.getId().toString(), ResourceType.MOVIE, ResourceIdentifierType.ID));

        Movie movieToBeUpdated = this.setUpdateMovieDtoToMovie(existingMovie, sanitizedDto);

        Movie updatedMovie = movieRepository.save(movieToBeUpdated);

        return MovieDtoMapper.INSTANCE.movieToMovieDataDto(updatedMovie);
    }

    public void deleteMovie(Long id) {
        Movie existingMovie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id.toString(), ResourceType.MOVIE, ResourceIdentifierType.ID));

        movieRepository.delete(existingMovie);
    }

    @Transactional
    public void deleteMovies(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return;
        }

        movieRepository.deleteAllById(ids);
    }

    private Movie setUpdateMovieDtoToMovie(Movie movie, UpdateMovieDto movieDto) {
        movie.setTitle(movieDto.getTitle());
        movie.setStatus(movieDto.getStatus());
        movie.setWatchedDate(movieDto.getWatchedDate());
        movie.setUserRating(movieDto.getUserRating());
        movie.setUserReview(movieDto.getUserReview());
        movie.setDirector(movieDto.getDirector());
        movie.setPosterUrl(movieDto.getPosterUrl());
        movie.setPlotSummary(movieDto.getPlotSummary());
        movie.setRuntimeMinutes(movieDto.getRuntimeMinutes());
        movie.setGenres(movieDto.getGenres());
        movie.setActors(movieDto.getActors());
        // New
        movie.setWatchedDates(movieDto.getWatchedDates());

        return movie;
    }
}
