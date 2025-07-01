package com.moviemator.features.movie.service;

import com.moviemator.features.movie.dto.MovieDataDto;
import com.moviemator.features.movie.dto.MovieDtoMapper;
import com.moviemator.features.movie.dto.MovieSearchDto;
import com.moviemator.features.movie.model.Movie;
import com.moviemator.features.movie.repository.MovieRepository;
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
    private final EntitySanitizerService sanitizerService;

    @Autowired
    public MovieServiceImpl(
            MovieRepository movieRepository,
            EntitySanitizerService sanitizerService
    ) {
        this.movieRepository = movieRepository;
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

}
