package com.moviemator.core.user.dto;

import com.moviemator.core.user.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface UserDtoMapper {
    UserDtoMapper INSTANCE = Mappers.getMapper(UserDtoMapper.class);

    @Mapping(source = "user.id", target = "id")
    @Mapping(source = "user.cognitoUserId", target = "cognitoUserId")
    @Mapping(source = "user.email", target = "email")
    @Mapping(source = "user.displayName", target = "displayName")
    @Mapping(source = "user.createdAt", target = "createdAt")
    @Mapping(source = "user.updatedAt", target = "updatedAt")
    // New
    @Mapping(source = "user.userSettings", target = "userSettings")
    @Mapping(source = "user.isProfilePublic", target = "isProfilePublic")
    UserDataDto userToUserDataDto(User user);

    @Mapping(source = "cognitoUserId", target = "cognitoUserId")
    @Mapping(source = "email", target = "email")
    User createUserDtoToUser(CreateUserDto userDto);
}
