package com.moviemator.features.movie.service;

import com.moviemator.features.movie.repository.MovieRepository;
import com.moviemator.shared.service.EntitySanitizerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    
}
