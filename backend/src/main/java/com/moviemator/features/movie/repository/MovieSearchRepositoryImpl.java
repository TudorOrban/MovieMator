package com.moviemator.features.movie.repository;

import com.moviemator.features.movie.model.Movie;
import com.moviemator.shared.search.models.MovieFilters;
import com.moviemator.shared.search.models.PaginatedResults;
import com.moviemator.shared.search.models.SearchParams;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MovieSearchRepositoryImpl implements MovieSearchRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public PaginatedResults<Movie> searchMovies(Long userId, SearchParams searchParams, MovieFilters movieFilters) {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Movie> query = builder.createQuery(Movie.class);
        Root<Movie> root = query.from(Movie.class);

        Predicate conditions = getConditions(builder, root, userId, searchParams, movieFilters);
        query.where(conditions);

        if (searchParams.getSortBy() != null && !searchParams.getSortBy().isEmpty()) {
            if (searchParams.getIsAscending() != null && searchParams.getIsAscending()) {
                query.orderBy(builder.asc(root.get(searchParams.getSortBy())));
            } else {
                query.orderBy(builder.desc(root.get(searchParams.getSortBy())));
            }
        } else {
            query.orderBy(builder.desc(root.get("createdAt")));
        }

        List<Movie> movies = entityManager.createQuery(query)
                .setFirstResult((searchParams.getPage() - 1) * searchParams.getItemsPerPage())
                .setMaxResults(searchParams.getItemsPerPage())
                .getResultList();

        // Query total count
        CriteriaBuilder countBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> countQuery = countBuilder.createQuery(Long.class);
        Root<Movie> countRoot = countQuery.from(Movie.class);
        Predicate countConditions = getConditions(countBuilder, countRoot, userId, searchParams, movieFilters);
        countQuery.select(countBuilder.count(countRoot));
        countQuery.where(countConditions);

        long totalCount = entityManager.createQuery(countQuery).getSingleResult();

        return new PaginatedResults<>(movies, totalCount);
    }

    private Predicate getConditions(CriteriaBuilder builder, Root<Movie> root, Long userId, SearchParams searchParams, MovieFilters filters) {
        List<Predicate> predicates = new ArrayList<>();

        if (userId != null) {
            predicates.add(builder.equal(root.get("userId"), userId));
        }
        if (searchParams.getSearchText() != null && !searchParams.getSearchText().isEmpty()) {
            predicates.add(builder.like(builder.lower(root.get("title")), "%" + searchParams.getSearchText().toLowerCase() + "%"));
        }

        if (filters == null) {
            return builder.and(predicates.toArray(new Predicate[0]));
        }

        if (filters.getReleaseYearFrom() != null) {
            predicates.add(builder.greaterThanOrEqualTo(root.get("releaseYear"), filters.getReleaseYearFrom()));
        }
        if (filters.getReleaseYearTo() != null) {
            predicates.add(builder.lessThanOrEqualTo(root.get("releaseYear"), filters.getReleaseYearTo()));
        }

        if (filters.getDirector() != null && !filters.getDirector().isEmpty()) {
            predicates.add(builder.like(builder.lower(root.get("director")), "%" + filters.getDirector().toLowerCase() + "%"));
        }

        if (filters.getUserRatingFrom() != null) {
            predicates.add(builder.greaterThanOrEqualTo(root.get("userRating"), filters.getUserRatingFrom()));
        }
        if (filters.getUserRatingTo() != null) {
            predicates.add(builder.lessThanOrEqualTo(root.get("userRating"), filters.getUserRatingTo()));
        }

        if (filters.getWatchedDateFrom() != null) {
            predicates.add(builder.greaterThanOrEqualTo(root.get("watchedDate"), filters.getWatchedDateFrom()));
        }
        if (filters.getWatchedDateTo() != null) {
            predicates.add(builder.lessThanOrEqualTo(root.get("watchedDate"), filters.getWatchedDateTo()));
        }

        // New
        if (filters.getStatus() != null) {
            predicates.add(builder.equal(root.get("status"), filters.getStatus()));
        }

        if (filters.getRuntimeMinutesLessThan() != null) {
            predicates.add(builder.lessThanOrEqualTo(root.get("runtimeMinutes"), filters.getRuntimeMinutesLessThan()));
        }
        if (filters.getRuntimeMinutesMoreThan() != null) {
            predicates.add(builder.greaterThanOrEqualTo(root.get("runtimeMinutes"), filters.getRuntimeMinutesMoreThan()));
        }

        if (filters.getGenresIncluding() != null && !filters.getGenresIncluding().isEmpty()) {
            for (String genre : filters.getGenresIncluding()) {
                predicates.add(builder.isTrue(builder.function("?|", Boolean.class,
                        root.get("genres").as(String.class),
                        builder.literal(genre))));
            }
        }

        if (filters.getActorsIncluding() != null && !filters.getActorsIncluding().isEmpty()) {
            for (String actor : filters.getActorsIncluding()) {
                predicates.add(builder.isTrue(builder.function("?|", Boolean.class,
                        root.get("actors").as(String.class),
                        builder.literal(actor))));
            }
        }

        return builder.and(predicates.toArray(new Predicate[0]));
    }
}
