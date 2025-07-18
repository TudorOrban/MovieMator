package com.moviemator.core.user.repository;

import com.moviemator.core.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>, UserSearchRepository {
    Optional<User> findByCognitoUserId(String cognitoUserId);
    Optional<User> findByEmail(String email);
    boolean existsByCognitoUserId(String cognitoUserId);
}
