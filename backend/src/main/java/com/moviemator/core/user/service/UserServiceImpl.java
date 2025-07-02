package com.moviemator.core.user.service;

import com.moviemator.core.user.dto.CreateUserDto;
import com.moviemator.core.user.dto.UpdateUserDto;
import com.moviemator.core.user.dto.UserDataDto;
import com.moviemator.core.user.dto.UserDtoMapper;
import com.moviemator.core.user.model.User;
import com.moviemator.core.user.repository.UserRepository;
import com.moviemator.shared.error.types.ResourceIdentifierType;
import com.moviemator.shared.error.types.ResourceNotFoundException;
import com.moviemator.shared.error.types.ResourceType;
import com.moviemator.shared.sanitization.service.EntitySanitizerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public UserDataDto getUserByCognitoUserId(String cognitoUserId) {
        User user = userRepository.findByCognitoUserId(cognitoUserId)
                .orElseThrow(() -> new ResourceNotFoundException(cognitoUserId, ResourceType.USER, ResourceIdentifierType.ID));

        return UserDtoMapper.INSTANCE.userToUserDataDto(user);
    }

    public UserDataDto createUser(CreateUserDto userDto) {
        CreateUserDto sanitizedDto = sanitizerService.sanitizeCreateUserDto(userDto);

        User user = UserDtoMapper.INSTANCE.createUserDtoToUser(sanitizedDto);

        User savedUser = userRepository.save(user);

        return UserDtoMapper.INSTANCE.userToUserDataDto(savedUser);
    }

    public UserDataDto updateUser(UpdateUserDto userDto) {
        UpdateUserDto sanitizedDto = sanitizerService.sanitizeUpdateUserDto(userDto);

        User existingUser = userRepository.findById(userDto.getId())
                .orElseThrow(() -> new ResourceNotFoundException(userDto.getId().toString(), ResourceType.USER, ResourceIdentifierType.ID));

        existingUser.setDisplayName(sanitizedDto.getDisplayName());

        User updatedUser = userRepository.save(existingUser);

        return UserDtoMapper.INSTANCE.userToUserDataDto(updatedUser);
    }

    public void deleteUser(Long id) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id.toString(), ResourceType.USER, ResourceIdentifierType.ID));

        userRepository.delete(existingUser);
    }
}
