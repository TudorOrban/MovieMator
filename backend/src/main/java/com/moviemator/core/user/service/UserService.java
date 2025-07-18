package com.moviemator.core.user.service;

import com.moviemator.core.user.dto.CreateUserDto;
import com.moviemator.core.user.dto.UpdateUserDto;
import com.moviemator.core.user.dto.UserDataDto;
import com.moviemator.core.user.dto.UserSearchDto;
import com.moviemator.shared.search.models.PaginatedResults;
import com.moviemator.shared.search.models.SearchParams;

public interface UserService {

    UserDataDto getUserById(Long id);
    UserDataDto getUserByCognitoUserId(String cognitoUserId);
    PaginatedResults<UserSearchDto> getPublicUsers(SearchParams searchParams);
    UserDataDto createUser(CreateUserDto userDto);
    UserDataDto updateUser(UpdateUserDto userDto);
    void deleteUser(Long id);
}
