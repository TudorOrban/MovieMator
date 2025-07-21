package com.moviemator.core.user.dto;

import com.moviemator.core.user.model.User;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

@Mapper
public interface UserDtoMapper {
    UserDtoMapper INSTANCE = Mappers.getMapper(UserDtoMapper.class);

    @Mapping(source = "user.id", target = "id")
    @Mapping(source = "user.cognitoUserId", target = "cognitoUserId")
    @Mapping(source = "user.displayName", target = "displayName")
    @Mapping(source = "user.createdAt", target = "createdAt")
    @Mapping(source = "user.updatedAt", target = "updatedAt")
    @Mapping(source = "user.isProfilePublic", target = "isProfilePublic")
    UserSearchDto userToUserSearchDto(User user);

    @Mapping(source = "user.id", target = "id")
    @Mapping(source = "user.cognitoUserId", target = "cognitoUserId")
    @Mapping(source = "user.email", target = "email")
    @Mapping(source = "user.displayName", target = "displayName")
    @Mapping(source = "user.createdAt", target = "createdAt")
    @Mapping(source = "user.updatedAt", target = "updatedAt")
    @Mapping(source = "user.userSettings", target = "userSettings")
    @Mapping(source = "user.isProfilePublic", target = "isProfilePublic")
    UserDataDto userToUserDataDto(User user);

    @Mapping(source = "user.id", target = "id")
    @Mapping(source = "user.cognitoUserId", target = "cognitoUserId")
    @Mapping(source = "user.displayName", target = "displayName")
    @Mapping(source = "user.createdAt", target = "createdAt")
    @Mapping(source = "user.updatedAt", target = "updatedAt")
    @Mapping(source = "user.userSettings", target = "userSettings")
    @Mapping(source = "user.isProfilePublic", target = "isProfilePublic")
    PublicUserDataDto userToPublicUserDataDto(User user);

    @Mapping(source = "cognitoUserId", target = "cognitoUserId")
    @Mapping(source = "email", target = "email")
    User createUserDtoToUser(CreateUserDto userDto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "cognitoUserId", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateUserFromUpdateUserDto(UpdateUserDto userDto, @MappingTarget User user);
}
