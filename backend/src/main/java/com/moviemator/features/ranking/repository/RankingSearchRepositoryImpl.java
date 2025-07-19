package com.moviemator.features.ranking.repository;

import com.moviemator.features.ranking.model.Ranking;
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
public class RankingSearchRepositoryImpl implements RankingSearchRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public PaginatedResults<Ranking> searchRankings(Long userId, SearchParams searchParams) {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Ranking> query = builder.createQuery(Ranking.class);
        Root<Ranking> root = query.from(Ranking.class);

        Predicate conditions = getConditions(builder, root, userId, searchParams);
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

        List<Ranking> rankings = entityManager.createQuery(query)
                .setFirstResult((searchParams.getPage() - 1) * searchParams.getItemsPerPage())
                .setMaxResults(searchParams.getItemsPerPage())
                .getResultList();

        // Query total count
        CriteriaBuilder countBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> countQuery = countBuilder.createQuery(Long.class);
        Root<Ranking> countRoot = countQuery.from(Ranking.class);
        Predicate countConditions = getConditions(countBuilder, countRoot, userId, searchParams);
        countQuery.select(countBuilder.count(countRoot));
        countQuery.where(countConditions);

        long totalCount = entityManager.createQuery(countQuery).getSingleResult();

        return new PaginatedResults<>(rankings, totalCount);
    }

    private Predicate getConditions(CriteriaBuilder builder, Root<Ranking> root, Long userId, SearchParams searchParams) {
        List<Predicate> predicates = new ArrayList<>();

        if (userId != null) {
            predicates.add(builder.equal(root.get("userId"), userId));
        }
        if (searchParams.getSearchText() != null && !searchParams.getSearchText().isEmpty()) {
            predicates.add(builder.like(builder.lower(root.get("title")), "%" + searchParams.getSearchText().toLowerCase() + "%"));
        }

        return builder.and(predicates.toArray(new Predicate[0]));
    }
}
