package com.moviemator.core.user.service;

import com.moviemator.core.user.dto.CreateUserDto;
import com.moviemator.core.user.dto.UpdateUserDto;
import com.moviemator.core.user.dto.UserDataDto;

public interface UserService {

    UserDataDto getUserById(Long id);
    UserDataDto getUserByCognitoUserId(String cognitoUserId);
    UserDataDto createUser(CreateUserDto userDto);
    UserDataDto updateUser(UpdateUserDto userDto);
    void deleteUser(Long id);
}
