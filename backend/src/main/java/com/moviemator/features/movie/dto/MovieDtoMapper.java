package com.moviemator.features.movie.dto;

import com.moviemator.features.movie.model.Movie;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface MovieDtoMapper {
    MovieDtoMapper INSTANCE = Mappers.getMapper(MovieDtoMapper.class);

    @Mapping(source = "movie.id", target = "id")
    @Mapping(source = "movie.userId", target = "userId")
    @Mapping(source = "movie.tmdbId", target = "tmdbId")
    @Mapping(source = "movie.title", target = "title")
    @Mapping(source = "movie.releaseYear", target = "releaseYear")
    @Mapping(source = "movie.posterUrl", target = "posterUrl")
    @Mapping(source = "movie.director", target = "director")
    @Mapping(source = "movie.plotSummary", target = "plotSummary")
    @Mapping(source = "movie.userRating", target = "userRating")
    @Mapping(source = "movie.userReview", target = "userReview")
    @Mapping(source = "movie.watchedDate", target = "watchedDate")
    @Mapping(source = "movie.createdAt", target = "createdAt")
    @Mapping(source = "movie.updatedAt", target = "updatedAt")
    MovieSearchDto movieToMovieSearchDto(Movie movie);

    @Mapping(source = "movie.id", target = "id")
    @Mapping(source = "movie.userId", target = "userId")
    @Mapping(source = "movie.tmdbId", target = "tmdbId")
    @Mapping(source = "movie.title", target = "title")
    @Mapping(source = "movie.releaseYear", target = "releaseYear")
    @Mapping(source = "movie.posterUrl", target = "posterUrl")
    @Mapping(source = "movie.director", target = "director")
    @Mapping(source = "movie.plotSummary", target = "plotSummary")
    @Mapping(source = "movie.userRating", target = "userRating")
    @Mapping(source = "movie.userReview", target = "userReview")
    @Mapping(source = "movie.watchedDate", target = "watchedDate")
    @Mapping(source = "movie.createdAt", target = "createdAt")
    @Mapping(source = "movie.updatedAt", target = "updatedAt")
    MovieDataDto movieToMovieDataDto(Movie movie);

    @Mapping(source = "movie.userId", target = "userId")
    @Mapping(source = "movie.tmdbId", target = "tmdbId")
    @Mapping(source = "movie.title", target = "title")
    @Mapping(source = "movie.releaseYear", target = "releaseYear")
    @Mapping(source = "movie.posterUrl", target = "posterUrl")
    @Mapping(source = "movie.director", target = "director")
    @Mapping(source = "movie.plotSummary", target = "plotSummary")
    @Mapping(source = "movie.userRating", target = "userRating")
    @Mapping(source = "movie.userReview", target = "userReview")
    @Mapping(source = "movie.watchedDate", target = "watchedDate")
    Movie createMovieDtoToMovie(CreateMovieDto movieDto);
}
