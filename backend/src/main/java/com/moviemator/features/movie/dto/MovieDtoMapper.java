package com.moviemator.features.movie.dto;

import com.moviemator.features.movie.model.Movie;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Mapper(collectionMappingStrategy = CollectionMappingStrategy.ADDER_PREFERRED)
public interface MovieDtoMapper {
    MovieDtoMapper INSTANCE = Mappers.getMapper(MovieDtoMapper.class);

    DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Mapping(source = "movie.id", target = "id")
    @Mapping(source = "movie.title", target = "title")
    @Mapping(source = "movie.posterUrl", target = "posterUrl")
    MovieSmallDto movieToMovieSmallDto(Movie movie);

    @Mapping(source = "movie.id", target = "id")
    @Mapping(source = "movie.userId", target = "userId")
    @Mapping(source = "movie.tmdbId", target = "tmdbId")
    @Mapping(source = "movie.title", target = "title")
    @Mapping(source = "movie.status", target = "status")
    @Mapping(source = "movie.watchedDate", target = "watchedDate")
    @Mapping(source = "movie.userRating", target = "userRating")
    @Mapping(source = "movie.userReview", target = "userReview")
    @Mapping(source = "movie.createdAt", target = "createdAt")
    @Mapping(source = "movie.updatedAt", target = "updatedAt")
    @Mapping(source = "movie.releaseYear", target = "releaseYear")
    @Mapping(source = "movie.posterUrl", target = "posterUrl")
    @Mapping(source = "movie.director", target = "director")
    @Mapping(source = "movie.plotSummary", target = "plotSummary")
    @Mapping(source = "movie.runtimeMinutes", target = "runtimeMinutes")
    @Mapping(source = "movie.genres", target = "genres")
    @Mapping(source = "movie.actors", target = "actors")
    @Mapping(source = "movie.watchedDates", target = "watchedDates")
    MovieSearchDto movieToMovieSearchDto(Movie movie);

    @Mapping(source = "movie.id", target = "id")
    @Mapping(source = "movie.userId", target = "userId")
    @Mapping(source = "movie.tmdbId", target = "tmdbId")
    @Mapping(source = "movie.title", target = "title")
    @Mapping(source = "movie.status", target = "status")
    @Mapping(source = "movie.watchedDate", target = "watchedDate")
    @Mapping(source = "movie.userRating", target = "userRating")
    @Mapping(source = "movie.userReview", target = "userReview")
    @Mapping(source = "movie.createdAt", target = "createdAt")
    @Mapping(source = "movie.updatedAt", target = "updatedAt")
    @Mapping(source = "movie.releaseYear", target = "releaseYear")
    @Mapping(source = "movie.posterUrl", target = "posterUrl")
    @Mapping(source = "movie.director", target = "director")
    @Mapping(source = "movie.plotSummary", target = "plotSummary")
    @Mapping(source = "movie.runtimeMinutes", target = "runtimeMinutes")
    @Mapping(source = "movie.genres", target = "genres")
    @Mapping(source = "movie.actors", target = "actors")
    @Mapping(source = "movie.watchedDates", target = "watchedDates")
    MovieDataDto movieToMovieDataDto(Movie movie);

    @Mapping(source = "userId", target = "userId")
    @Mapping(source = "tmdbId", target = "tmdbId")
    @Mapping(source = "title", target = "title")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "watchedDate", target = "watchedDate")
    @Mapping(source = "userRating", target = "userRating")
    @Mapping(source = "userReview", target = "userReview")
    @Mapping(source = "releaseYear", target = "releaseYear")
    @Mapping(source = "posterUrl", target = "posterUrl")
    @Mapping(source = "director", target = "director")
    @Mapping(source = "plotSummary", target = "plotSummary")
    @Mapping(source = "runtimeMinutes", target = "runtimeMinutes")
    @Mapping(source = "genres", target = "genres")
    @Mapping(source = "actors", target = "actors")
    @Mapping(target = "watchedDates", expression = "java(mapLocalDateListToStringList(movieDto.getWatchedDates()))")
    Movie createMovieDtoToMovie(CreateMovieDto movieDto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateMovieFromUpdateMovieDto(UpdateMovieDto movieDto, @MappingTarget Movie movie);

    default List<String> mapLocalDateListToStringList(List<LocalDate> localDates) {
        if (localDates == null) {
            return null;
        }
        return localDates.stream()
                .map(date -> date.format(DATE_FORMATTER))
                .toList();
    }

    default List<LocalDate> mapStringListToLocalDateList(List<String> dateStrings) {
        if (dateStrings == null) {
            return null;
        }
        return dateStrings.stream()
                .map(dateString -> LocalDate.parse(dateString, DATE_FORMATTER))
                .toList();
    }
}
