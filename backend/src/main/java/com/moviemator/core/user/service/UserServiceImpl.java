package com.moviemator.core.user.service;

import com.moviemator.core.user.dto.*;
import com.moviemator.core.user.model.User;
import com.moviemator.core.user.model.UserSettings;
import com.moviemator.core.user.repository.UserRepository;
import com.moviemator.shared.error.types.ResourceIdentifierType;
import com.moviemator.shared.error.types.ResourceNotFoundException;
import com.moviemator.shared.error.types.ResourceType;
import com.moviemator.shared.sanitization.service.EntitySanitizerService;
import com.moviemator.shared.search.models.PaginatedResults;
import com.moviemator.shared.search.models.SearchParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final EntitySanitizerService sanitizerService;

    @Autowired
    public UserServiceImpl(
            UserRepository userRepository,
            EntitySanitizerService sanitizerService
    ) {
        this.userRepository = userRepository;
        this.sanitizerService = sanitizerService;
    }

    public UserDataDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id.toString(), ResourceType.USER, ResourceIdentifierType.ID));

        return UserDtoMapper.INSTANCE.userToUserDataDto(user);
    }

    public PublicUserDataDto getPublicUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id.toString(), ResourceType.USER, ResourceIdentifierType.ID));

        return UserDtoMapper.INSTANCE.userToPublicUserDataDto(user);
    }

    public UserDataDto getUserByCognitoUserId(String cognitoUserId) {
        User user = userRepository.findByCognitoUserId(cognitoUserId)
                .orElseThrow(() -> new ResourceNotFoundException(cognitoUserId, ResourceType.USER, ResourceIdentifierType.ID));

        return UserDtoMapper.INSTANCE.userToUserDataDto(user);
    }

    public PaginatedResults<UserSearchDto> getPublicUsers(SearchParams searchParams) {
        PaginatedResults<User> users = userRepository.searchPublicUsers(searchParams);

        return new PaginatedResults<>(
                users.getResults().stream().map(UserDtoMapper.INSTANCE::userToUserSearchDto).toList(),
                users.getTotalCount()
        );
    }

    public UserDataDto createUser(CreateUserDto userDto) {
        CreateUserDto sanitizedDto = sanitizerService.sanitizeCreateUserDto(userDto);

        User user = UserDtoMapper.INSTANCE.createUserDtoToUser(sanitizedDto);
        user.setUserSettings(new UserSettings());
        user.setIsProfilePublic(false);

        User savedUser = userRepository.save(user);

        return UserDtoMapper.INSTANCE.userToUserDataDto(savedUser);
    }

    public UserDataDto updateUser(UpdateUserDto userDto) {
        UpdateUserDto sanitizedDto = sanitizerService.sanitizeUpdateUserDto(userDto);

        User existingUser = userRepository.findById(userDto.getId())
                .orElseThrow(() -> new ResourceNotFoundException(userDto.getId().toString(), ResourceType.USER, ResourceIdentifierType.ID));

        existingUser.setDisplayName(sanitizedDto.getDisplayName());
        existingUser.setUserSettings(sanitizedDto.getUserSettings());
        existingUser.setIsProfilePublic(sanitizedDto.getIsProfilePublic());
        existingUser.setContactInfo(sanitizedDto.getContactInfo());

        User updatedUser = userRepository.save(existingUser);

        return UserDtoMapper.INSTANCE.userToUserDataDto(updatedUser);
    }

    public void deleteUser(Long id) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id.toString(), ResourceType.USER, ResourceIdentifierType.ID));

        userRepository.delete(existingUser);
    }
}
