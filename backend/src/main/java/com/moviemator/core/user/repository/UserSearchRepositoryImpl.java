package com.moviemator.core.user.repository;

import com.moviemator.core.user.model.User;
import com.moviemator.shared.search.models.PaginatedResults;
import com.moviemator.shared.search.models.SearchParams;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class UserSearchRepositoryImpl implements UserSearchRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public PaginatedResults<User> searchPublicUsers(SearchParams searchParams) {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<User> query = builder.createQuery(User.class);
        Root<User> root = query.from(User.class);

        Predicate conditions = getConditions(builder, root, searchParams);
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

        List<User> movies = entityManager.createQuery(query)
                .setFirstResult((searchParams.getPage() - 1) * searchParams.getItemsPerPage())
                .setMaxResults(searchParams.getItemsPerPage())
                .getResultList();

        // Query total count
        CriteriaBuilder countBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> countQuery = countBuilder.createQuery(Long.class);
        Root<User> countRoot = countQuery.from(User.class);
        Predicate countConditions = getConditions(countBuilder, countRoot, searchParams);
        countQuery.select(countBuilder.count(countRoot));
        countQuery.where(countConditions);

        long totalCount = entityManager.createQuery(countQuery).getSingleResult();

        return new PaginatedResults<>(movies, totalCount);
    }

    private Predicate getConditions(CriteriaBuilder builder, Root<User> root, SearchParams searchParams) {
        List<Predicate> predicates = new ArrayList<>();

        predicates.add(builder.equal(root.get("isProfilePublic"), true)); // Essential line

        if (searchParams.getSearchText() != null && !searchParams.getSearchText().isEmpty()) {
            predicates.add(builder.like(builder.lower(root.get("title")), "%" + searchParams.getSearchText().toLowerCase() + "%"));
        }

        return builder.and(predicates.toArray(new Predicate[0]));
    }
}
