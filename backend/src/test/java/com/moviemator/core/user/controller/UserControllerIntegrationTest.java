package com.moviemator.core.user.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.moviemator.MovieMatorApplication;
import com.moviemator.core.config.SecurityConfig;
import com.moviemator.core.user.dto.CreateUserDto;
import com.moviemator.core.user.dto.UserDataDto;
import com.moviemator.core.user.dto.UpdateUserDto;
import com.moviemator.core.user.model.UserSettings;
import com.moviemator.core.user.service.UserService;
import com.moviemator.features.movie.service.MovieService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = MovieMatorApplication.class, webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@Import(SecurityConfig.class)
@Testcontainers
public class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private MovieService movieService;

    private UserDataDto testUserDataDto;
    private CreateUserDto testCreateUserDto;
    private UpdateUserDto testUpdateUserDto;
    private UserDataDto testUserDataDto2;

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine")
            .withDatabaseName("testdb")
            .withUsername("testuser")
            .withPassword("testpass");

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.flyway.url", postgres::getJdbcUrl);
        registry.add("spring.flyway.user", postgres::getUsername);
        registry.add("spring.flyway.password", postgres::getPassword);
        registry.add("spring.flyway.enabled", () -> "true");
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "none");
        registry.add("ALLOWED_CORS_ORIGINS", () -> "http://test-origin.com,http://localhost:4200");
    }

    @BeforeEach
    void setUp() {
        testUserDataDto = new UserDataDto(
                1L,
                "cognito-123",
                "test@example.com",
                "Test User",
                LocalDateTime.now(),
                LocalDateTime.now(),
                null, null, null
        );

        testUserDataDto2 = new UserDataDto(
                2L,
                "cognito-456",
                "other@example.com",
                "Other User",
                LocalDateTime.now(),
                LocalDateTime.now(),
                null, null, null
        );

        testCreateUserDto = new CreateUserDto("new-cognito-id", "new@example.com");

        testUpdateUserDto = new UpdateUserDto(1L, "Updated User Display Name", null, null, null);

        reset(userService, movieService);

        doReturn(null).when(userService).getUserByCognitoUserId(anyString());

        when(userService.getUserByCognitoUserId("cognito-123")).thenReturn(testUserDataDto);
        when(userService.getUserByCognitoUserId("cognito-456")).thenReturn(testUserDataDto2);
        when(userService.getUserByCognitoUserId("new-cognito-id")).thenReturn(new UserDataDto(
                null,
                "new-cognito-id",
                "new@example.com",
                "New User",
                LocalDateTime.now(),
                LocalDateTime.now(),
                null, null, null
        ));
        when(userService.getUserByCognitoUserId("other-user")).thenReturn(testUserDataDto2);

        when(userService.getUserById(1L)).thenReturn(testUserDataDto);
        when(userService.getUserById(2L)).thenReturn(testUserDataDto2);
        when(userService.createUser(any(CreateUserDto.class))).thenReturn(testUserDataDto);
        when(userService.updateUser(any(UpdateUserDto.class))).thenReturn(testUserDataDto);
        doNothing().when(userService).deleteUser(anyLong());
    }

    // --- Tests for GET /api/v1/users/{id} ---

    @Test
    void getUserById_UserOwnId_Success() throws Exception {
        mockMvc.perform(get("/api/v1/users/{id}", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .with(user("cognito-123").roles("USER")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testUserDataDto.getId()));

        verify(userService, times(1)).getUserById(1L);
        verify(userService, times(1)).getUserByCognitoUserId("cognito-123");
    }

    @Test
    void getUserById_UserCannotAccessOtherId_AccessDenied() throws Exception {
        mockMvc.perform(get("/api/v1/users/{id}", 2L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .with(user("cognito-123").roles("USER")))
                .andExpect(status().isForbidden());

        verify(userService, times(1)).getUserByCognitoUserId("cognito-123");
        verify(userService, never()).getUserById(anyLong());
    }

    @Test
    void getUserById_AdminRole_Success() throws Exception {
        mockMvc.perform(get("/api/v1/users/{id}", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .with(user("adminUser").roles("ADMIN")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testUserDataDto.getId()));

        verify(userService, times(1)).getUserById(1L);
        verify(userService, never()).getUserByCognitoUserId(anyString());
    }

    // --- Tests for GET /api/v1/users/cognito-id/{cognitoUserId} ---

    @Test
    void getUserByCognitoUserId_UserOwnId_Success() throws Exception {
        mockMvc.perform(get("/api/v1/users/cognito-id/{cognitoUserId}", "cognito-123")
                        .contentType(MediaType.APPLICATION_JSON)
                        .with(user("cognito-123").roles("USER")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testUserDataDto.getId()));

        verify(userService, times(1)).getUserByCognitoUserId("cognito-123");
    }

    @Test
    void getUserByCognitoUserId_UserCannotAccessOtherId_AccessDenied() throws Exception {
        mockMvc.perform(get("/api/v1/users/cognito-id/{cognitoUserId}", "cognito-123")
                        .contentType(MediaType.APPLICATION_JSON)
                        .with(user("other-user-1").roles("USER")))
                .andExpect(status().isForbidden());

        verify(userService, never()).getUserByCognitoUserId(anyString());
    }

    @Test
    void getUserByCognitoUserId_AdminRole_Success() throws Exception {
        mockMvc.perform(get("/api/v1/users/cognito-id/{cognitoUserId}", "cognito-123")
                        .contentType(MediaType.APPLICATION_JSON)
                        .with(user("adminUser").roles("ADMIN")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testUserDataDto.getId()));

        verify(userService, times(1)).getUserByCognitoUserId("cognito-123");
    }

    // --- Tests for POST /api/v1/users ---

    @Test
    void createUser_UserCanCreateOwn_Success() throws Exception {
        mockMvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateUserDto))
                        .with(user("new-cognito-id").roles("USER")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testUserDataDto.getId()));

        verify(userService, times(1)).createUser(any(CreateUserDto.class));
    }

    @Test
    void createUser_UserCannotCreateOther_AccessDenied() throws Exception {
        mockMvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateUserDto))
                        .with(user("other-user").roles("USER")))
                .andExpect(status().isForbidden());

        verify(userService, never()).createUser(any(CreateUserDto.class));
    }

    @Test
    void createUser_AdminRole_Success() throws Exception {
        mockMvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateUserDto))
                        .with(user("adminUser").roles("ADMIN")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testUserDataDto.getId()));

        verify(userService, times(1)).createUser(any(CreateUserDto.class));
    }

    // --- Tests for PUT /api/v1/users ---

    @Test
    void updateUser_UserCanUpdateOwn_Success() throws Exception {
        mockMvc.perform(put("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testUpdateUserDto))
                        .with(user("cognito-123").roles("USER")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testUserDataDto.getId()));

        verify(userService, times(1)).updateUser(any(UpdateUserDto.class));
        verify(userService, times(1)).getUserByCognitoUserId("cognito-123");
    }

    @Test
    void updateUser_UserCannotUpdateOther_AccessDenied() throws Exception {
        mockMvc.perform(put("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testUpdateUserDto))
                        .with(user("other-user").roles("USER")))
                .andExpect(status().isForbidden());

        verify(userService, times(1)).getUserByCognitoUserId("other-user");
        verify(userService, never()).updateUser(any(UpdateUserDto.class));
    }

    @Test
    void updateUser_AdminRole_Success() throws Exception {
        mockMvc.perform(put("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testUpdateUserDto))
                        .with(user("adminUser").roles("ADMIN")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testUserDataDto.getId()));

        verify(userService, times(1)).updateUser(any(UpdateUserDto.class));
        verify(userService, never()).getUserByCognitoUserId(anyString());
    }

    // --- Tests for DELETE /api/v1/users/{id} ---

    @Test
    void deleteUser_AdminRole_Success() throws Exception {
        doNothing().when(userService).deleteUser(1L);

        mockMvc.perform(delete("/api/v1/users/{id}", 1L)
                        .with(user("adminUser").roles("ADMIN")))
                .andExpect(status().isOk());

        verify(userService, times(1)).deleteUser(1L);
    }

    @Test
    void deleteUser_UserRole_AccessDenied() throws Exception {
        mockMvc.perform(delete("/api/v1/users/{id}", 1L)
                        .with(user("user").roles("USER")))
                .andExpect(status().isForbidden());

        verify(userService, never()).deleteUser(anyLong());
    }
}