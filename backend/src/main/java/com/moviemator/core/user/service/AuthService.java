package com.moviemator.core.user.service;

import com.moviemator.core.user.model.User;

public interface AuthService {

    User getOrCreateUserFromExternalId(String externalUserId, String email, String displayName);

    User getCurrentAuthenticatedUser();
}
