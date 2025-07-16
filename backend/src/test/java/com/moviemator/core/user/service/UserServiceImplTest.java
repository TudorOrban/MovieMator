package com.moviemator.core.user.service;

import com.moviemator.core.user.dto.CreateUserDto;
import com.moviemator.core.user.dto.UpdateUserDto;
import com.moviemator.core.user.dto.UserDataDto;
import com.moviemator.core.user.dto.UserDtoMapper;
import com.moviemator.core.user.model.User;
import com.moviemator.core.user.model.UserSettings;
import com.moviemator.core.user.repository.UserRepository;
import com.moviemator.core.user.service.UserServiceImpl;
import com.moviemator.shared.error.types.ResourceIdentifierType;
import com.moviemator.shared.error.types.ResourceNotFoundException;
import com.moviemator.shared.error.types.ResourceType;
import com.moviemator.shared.sanitization.service.EntitySanitizerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private EntitySanitizerService sanitizerService;

    @InjectMocks
    private UserServiceImpl userService;

    private User testUser;
    private UserDataDto testUserDataDto;
    private CreateUserDto testCreateUserDto;
    private UpdateUserDto testUpdateUserDto;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setDisplayName("Test User");
        testUser.setEmail("test@example.com");
        testUser.setCognitoUserId("cognito-123");

        testUserDataDto = new UserDataDto(1L, "cognito-123", "test@example.com", "Test User", LocalDateTime.now(), LocalDateTime.now(), null);

        testCreateUserDto = new CreateUserDto("new-cognito-id", "new@example.com");

        testUpdateUserDto = new UpdateUserDto(1L, "Updated User", new UserSettings());
    }

    @Test
    void getUserById_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        UserDataDto result = userService.getUserById(1L);

        assertNotNull(result);
        assertEquals(testUserDataDto.getId(), result.getId());
        assertEquals(testUserDataDto.getDisplayName(), result.getDisplayName());
        assertEquals(testUserDataDto.getEmail(), result.getEmail());
        assertEquals(testUserDataDto.getCognitoUserId(), result.getCognitoUserId());

        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void getUserById_NotFound() {
        when(userRepository.findById(2L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () ->
                userService.getUserById(2L)
        );

        assertEquals("2", exception.getIdentifier());
        assertEquals(ResourceType.USER, exception.getResourceType());
        assertEquals(ResourceIdentifierType.ID, exception.getIdentifierType());

        verify(userRepository, times(1)).findById(2L);
    }

    @Test
    void getUserByCognitoUserId_Success() {
        when(userRepository.findByCognitoUserId("cognito-123")).thenReturn(Optional.of(testUser));

        UserDataDto result = userService.getUserByCognitoUserId("cognito-123");

        assertNotNull(result);
        assertEquals(testUserDataDto.getId(), result.getId());
        assertEquals(testUserDataDto.getEmail(), result.getEmail());
        assertEquals(testUserDataDto.getCognitoUserId(), result.getCognitoUserId());

        verify(userRepository, times(1)).findByCognitoUserId("cognito-123");
    }

    @Test
    void getUserByCognitoUserId_NotFound() {
        when(userRepository.findByCognitoUserId("non-existent-cognito-id")).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () ->
                userService.getUserByCognitoUserId("non-existent-cognito-id")
        );

        assertEquals("non-existent-cognito-id", exception.getIdentifier());
        assertEquals(ResourceType.USER, exception.getResourceType());
        assertEquals(ResourceIdentifierType.ID, exception.getIdentifierType());

        verify(userRepository, times(1)).findByCognitoUserId("non-existent-cognito-id");
    }

    @Test
    void createUser_Success() {
        when(sanitizerService.sanitizeCreateUserDto(any(CreateUserDto.class))).thenReturn(testCreateUserDto);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        UserDataDto result = userService.createUser(testCreateUserDto);

        assertNotNull(result);
        assertEquals(testUserDataDto.getId(), result.getId());
        assertEquals(testUserDataDto.getEmail(), result.getEmail());
        assertEquals(testUserDataDto.getCognitoUserId(), result.getCognitoUserId());

        verify(sanitizerService, times(1)).sanitizeCreateUserDto(testCreateUserDto);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void updateUser_Success() {
        when(sanitizerService.sanitizeUpdateUserDto(any(UpdateUserDto.class))).thenReturn(testUpdateUserDto);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        User updatedUser = new User();
        updatedUser.setId(1L);
        updatedUser.setDisplayName("Updated User");
        updatedUser.setEmail("test@example.com");
        updatedUser.setCognitoUserId("cognito-123");
        updatedUser.setCreatedAt(testUser.getCreatedAt());
        updatedUser.setUpdatedAt(testUser.getUpdatedAt());
        when(userRepository.save(any(User.class))).thenReturn(updatedUser);

        UserDataDto result = userService.updateUser(testUpdateUserDto);

        assertNotNull(result);
        assertEquals(testUpdateUserDto.getDisplayName(), result.getDisplayName());
        assertEquals(testUser.getId(), result.getId());

        verify(sanitizerService, times(1)).sanitizeUpdateUserDto(testUpdateUserDto);
        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).save(any(User.class));

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        assertEquals("Updated User", userCaptor.getValue().getDisplayName());
    }

    @Test
    void updateUser_NotFound() {
        when(sanitizerService.sanitizeUpdateUserDto(any(UpdateUserDto.class))).thenReturn(testUpdateUserDto);
        when(userRepository.findById(testUpdateUserDto.getId())).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () ->
                userService.updateUser(testUpdateUserDto)
        );

        assertEquals(testUpdateUserDto.getId().toString(), exception.getIdentifier());
        assertEquals(ResourceType.USER, exception.getResourceType());
        assertEquals(ResourceIdentifierType.ID, exception.getIdentifierType());

        verify(sanitizerService, times(1)).sanitizeUpdateUserDto(testUpdateUserDto);
        verify(userRepository, times(1)).findById(testUpdateUserDto.getId());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void deleteUser_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        doNothing().when(userRepository).delete(any(User.class));

        userService.deleteUser(1L);

        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).delete(testUser);
    }

    @Test
    void deleteUser_NotFound() {
        when(userRepository.findById(2L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () ->
                userService.deleteUser(2L)
        );

        assertEquals("2", exception.getIdentifier());
        assertEquals(ResourceType.USER, exception.getResourceType());
        assertEquals(ResourceIdentifierType.ID, exception.getIdentifierType());

        verify(userRepository, times(1)).findById(2L);
        verify(userRepository, never()).delete(any(User.class));
    }
}
