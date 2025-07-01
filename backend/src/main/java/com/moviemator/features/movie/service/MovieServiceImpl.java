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
import com.moviemator.shared.search.models.PaginatedResults;
import com.moviemator.shared.search.models.SearchParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public PaginatedResults<MovieSearchDto> searchMovies(Long userId, SearchParams searchParams) {
        List<Movie> movies = movieRepository.findByUserId(userId);

        return new PaginatedResults<>(
                movies.stream().map(MovieDtoMapper.INSTANCE::movieToMovieSearchDto).toList(),
                (long) movies.size()
        );
    }

    public MovieDataDto getMovieById(Long id) {
        Movie foundMovie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id.toString(), ResourceType.MOVIE, ResourceIdentifierType.ID));

        return MovieDtoMapper.INSTANCE.movieToMovieDataDto(foundMovie);
    }

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

    public MovieDataDto updateMovie(UpdateMovieDto movieDto) {
        UpdateMovieDto sanitizedDto = sanitizerService.sanitizeUpdateMovieDto(movieDto);

        Movie existingMovie = movieRepository.findById(movieDto.getId())
                .orElseThrow(() -> new ResourceNotFoundException(movieDto.getId().toString(), ResourceType.MOVIE, ResourceIdentifierType.ID));

        if (movieRepository.hasNonUniqueTitle(sanitizedDto.getUserId(), sanitizedDto.getTitle())) {
            throw new ResourceAlreadyExistsException(sanitizedDto.getTitle(), ResourceType.MOVIE, ResourceIdentifierType.TITLE);
        }
        existingMovie.setTitle(movieDto.getTitle());

        existingMovie.setDirector(movieDto.getDirector());

        Movie updatedMovie = movieRepository.save(existingMovie);

        return MovieDtoMapper.INSTANCE.movieToMovieDataDto(updatedMovie);
    }

    public void deleteMovie(Long id) {
        Movie existingMovie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id.toString(), ResourceType.MOVIE, ResourceIdentifierType.ID));

        movieRepository.delete(existingMovie);
    }
}
