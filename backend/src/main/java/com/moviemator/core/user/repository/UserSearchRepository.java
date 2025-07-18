package com.moviemator.core.user.repository;

import com.moviemator.core.user.model.User;
import com.moviemator.shared.search.models.PaginatedResults;
import com.moviemator.shared.search.models.SearchParams;

public interface UserSearchRepository {
    PaginatedResults<User> searchPublicUsers(SearchParams searchParams);
}
