package com.moviemator.features.movie.repository;

import com.moviemator.features.movie.model.Movie;
import com.moviemator.shared.search.models.PaginatedResults;
import com.moviemator.shared.search.models.SearchParams;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieSearchRepositoryImpl implements MovieSearchRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public PaginatedResults<Movie> searchMovies(Long userId, SearchParams searchParams) {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Movie> query = builder.createQuery(Movie.class);
        Root<Movie> root = query.from(Movie.class);

        Predicate conditions = getConditions(builder, root, userId, searchParams);
        query.where(conditions);

        if (searchParams.getIsAscending()) {
            query.orderBy(builder.asc(root.get(searchParams.getSortBy())));
        } else {
            query.orderBy(builder.desc(root.get(searchParams.getSortBy())));
        }

        List<Movie> movies = entityManager.createQuery(query)
                .setFirstResult((searchParams.getPage() - 1) * searchParams.getItemsPerPage())
                .setMaxResults(searchParams.getItemsPerPage())
                .getResultList();

        // Query total count
        CriteriaBuilder countBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> countQuery = countBuilder.createQuery(Long.class);
        Root<Movie> countRoot = countQuery.from(Movie.class);
        Predicate countConditions = getConditions(countBuilder, countRoot, userId, searchParams);
        countQuery.select(countBuilder.count(countRoot));
        countQuery.where(countConditions);

        long totalCount = entityManager.createQuery(countQuery).getSingleResult();

        return new PaginatedResults<>(movies, totalCount);
    }

    private Predicate getConditions(CriteriaBuilder builder, Root<Movie> root, Long userId, SearchParams searchParams) {
        Predicate conditions = builder.conjunction();

        if (userId != null) {
            conditions = builder.and(conditions, builder.equal(root.get("userId"), userId));
        }
        if (searchParams.getSearchText() != null) {
            conditions = builder.and(conditions, builder.like(root.get("title"), "%" + searchParams.getSearchText() + "%"));
        }

        return conditions;
    }
}
