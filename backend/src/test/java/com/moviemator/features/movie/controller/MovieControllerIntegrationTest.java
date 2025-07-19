package com.moviemator.features.movie.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.moviemator.core.config.SecurityConfig;
import com.moviemator.core.user.controller.UserSecurityExpressions;
import com.moviemator.core.user.dto.UserDataDto;
import com.moviemator.core.user.service.UserService;
import com.moviemator.features.movie.dto.CreateMovieDto;
import com.moviemator.features.movie.dto.MovieDataDto;
import com.moviemator.features.movie.dto.MovieSearchDto;
import com.moviemator.features.movie.dto.UpdateMovieDto;
import com.moviemator.features.movie.model.MovieStatus;
import com.moviemator.features.movie.service.MovieService;
import com.moviemator.shared.search.models.PaginatedResults;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@Import(SecurityConfig.class)
@Testcontainers
public class MovieControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private MovieService movieService;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private UserSecurityExpressions userSecurity;

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

    private UserDataDto testUserDataDto;
    private UserDataDto testOtherUserDataDto;
    private MovieDataDto testMovieDataDto;
    private MovieDataDto testOtherMovieDataDto;
    private CreateMovieDto testCreateMovieDto;
    private UpdateMovieDto testUpdateMovieDto;
    private PaginatedResults<MovieSearchDto> testPaginatedResults;

    @BeforeEach
    void setUp() {
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        // User and Movie DTOs
        testUserDataDto = new UserDataDto(
                1L,
                "cognito-user-1",
                "user1@example.com",
                "Test User 1",
                LocalDateTime.now(),
                LocalDateTime.now(),
                null, null, null
        );

        testOtherUserDataDto = new UserDataDto(
                2L,
                "cognito-user-2",
                "user2@example.com",
                "Test User 2",
                LocalDateTime.now(),
                LocalDateTime.now(),
                null, null, null
        );

        testMovieDataDto = new MovieDataDto(
                101L,
                testUserDataDto.getId(), // Owned by testUserDataDto
                12345L,
                "Test Movie",
                MovieStatus.WATCHED,
                LocalDate.of(2023, 1, 15),
                8.5f,
                "Great movie!",
                LocalDateTime.now(),
                LocalDateTime.now(),
                2020,
                "poster1.jpg",
                "Director A",
                "Plot summary A",
                120,
                Arrays.asList("Action", "Sci-Fi"),
                Arrays.asList("Actor X", "Actor Y"),
                null
        );

        testOtherMovieDataDto = new MovieDataDto(
                102L,
                testOtherUserDataDto.getId(), // Owned by testOtherUserDataDto
                54321L,
                "Other User's Movie",
                MovieStatus.WATCHLIST,
                LocalDate.of(2024, 2, 20),
                7.0f,
                "Decent",
                LocalDateTime.now(),
                LocalDateTime.now(),
                2021,
                "poster2.jpg",
                "Director B",
                "Plot summary B",
                90,
                Collections.singletonList("Drama"),
                Collections.singletonList("Actor Z"),
                null
        );

        testCreateMovieDto = new CreateMovieDto(
                testUserDataDto.getId(),
                12346L,
                "New Movie",
                MovieStatus.WATCHED,
                LocalDate.of(2024, 7, 1),
                9.0f,
                "Excellent!",
                2023,
                "new_poster.jpg",
                "New Director",
                "New plot",
                100,
                List.of("Comedy"),
                List.of("New Actor"),
                null
        );

        testUpdateMovieDto = new UpdateMovieDto(
                testMovieDataDto.getId(),
                testMovieDataDto.getUserId(),
                testMovieDataDto.getTmdbId(),
                "Updated Movie Title",
                testMovieDataDto.getStatus(),
                testMovieDataDto.getWatchedDate(),
                9.0f,
                "Still great!",
                testMovieDataDto.getReleaseYear(),
                testMovieDataDto.getPosterUrl(),
                testMovieDataDto.getDirector(),
                testMovieDataDto.getPlotSummary(),
                testMovieDataDto.getRuntimeMinutes(),
                testMovieDataDto.getGenres(),
                testMovieDataDto.getActors(),
                null
        );

        MovieSearchDto movieSearchDto = new MovieSearchDto(
                testMovieDataDto.getId(),
                testMovieDataDto.getUserId(),
                testMovieDataDto.getTmdbId(),
                testMovieDataDto.getTitle(),
                testMovieDataDto.getStatus(),
                testMovieDataDto.getWatchedDate(),
                testMovieDataDto.getUserRating(),
                testMovieDataDto.getUserReview(),
                testMovieDataDto.getCreatedAt(),
                testMovieDataDto.getUpdatedAt(),
                testMovieDataDto.getReleaseYear(),
                testMovieDataDto.getPosterUrl(),
                testMovieDataDto.getDirector(),
                testMovieDataDto.getPlotSummary(),
                testMovieDataDto.getRuntimeMinutes(),
                testMovieDataDto.getGenres(),
                testMovieDataDto.getActors(),
                null
        );
        testPaginatedResults = new PaginatedResults<>(Collections.singletonList(movieSearchDto), 1L);

        MovieDataDto updatedMovieDataDtoAfterUpdate = new MovieDataDto(
                testUpdateMovieDto.getId(),
                testUpdateMovieDto.getUserId(),
                testUpdateMovieDto.getTmdbId(),
                testUpdateMovieDto.getTitle(),
                testUpdateMovieDto.getStatus(),
                testUpdateMovieDto.getWatchedDate(),
                testUpdateMovieDto.getUserRating(),
                testUpdateMovieDto.getUserReview(),
                LocalDateTime.now(),
                LocalDateTime.now(),
                testUpdateMovieDto.getReleaseYear(),
                testUpdateMovieDto.getPosterUrl(),
                testUpdateMovieDto.getDirector(),
                testUpdateMovieDto.getPlotSummary(),
                testUpdateMovieDto.getRuntimeMinutes(),
                testUpdateMovieDto.getGenres(),
                testUpdateMovieDto.getActors(),
                null
        );

        reset(movieService, userService, userSecurity);

        // Mocking services
        when(userService.getUserByCognitoUserId(testUserDataDto.getCognitoUserId())).thenReturn(testUserDataDto);
        when(userService.getUserByCognitoUserId(testOtherUserDataDto.getCognitoUserId())).thenReturn(testOtherUserDataDto);
        doReturn(null).when(userService).getUserByCognitoUserId(anyString());

        when(movieService.getMovieById(testMovieDataDto.getId())).thenReturn(testMovieDataDto);
        when(movieService.getMovieById(testOtherMovieDataDto.getId())).thenReturn(testOtherMovieDataDto);
        doReturn(null).when(movieService).getMovieById(anyLong());

        when(movieService.searchMovies(eq(testUserDataDto.getId()), any(), any())).thenReturn(testPaginatedResults);
        when(movieService.getMovieById(testMovieDataDto.getId())).thenReturn(testMovieDataDto);
        when(movieService.getWatchedMovieDatesForUser(testOtherUserDataDto.getId()))
                .thenReturn(Arrays.asList(LocalDate.of(2022, 5, 1), LocalDate.of(2022, 10, 25)));
        when(movieService.isMovieTitleUnique(eq(testUserDataDto.getId()), eq("New Movie Title"))).thenReturn(true);
        when(movieService.isMovieTitleUnique(eq(testUserDataDto.getId()), eq(testMovieDataDto.getTitle()))).thenReturn(false);
        when(movieService.isMovieTitleUnique(eq(testOtherUserDataDto.getId()), eq("Existing Movie Title"))).thenReturn(true);
        when(movieService.createMovie(any(CreateMovieDto.class))).thenReturn(testMovieDataDto);
        when(movieService.createMoviesBulk(anyList())).thenReturn(Collections.singletonList(testMovieDataDto));
        when(movieService.updateMovie(any(UpdateMovieDto.class))).thenReturn(updatedMovieDataDtoAfterUpdate);
        doNothing().when(movieService).deleteMovie(anyLong());
        doNothing().when(movieService).deleteMovies(anyList());

        when(userSecurity.isSearchingOwnMovies(eq(testUserDataDto.getId()), any(Authentication.class))).thenReturn(true);
        when(userSecurity.isMovieOwnerById(eq(testMovieDataDto.getId()), any(Authentication.class))).thenReturn(true);
        when(userSecurity.isFetchingOwnWatchedDates(eq(testUserDataDto.getId()), any(Authentication.class))).thenReturn(true);
        when(userSecurity.isCheckingOwnMovieTitles(eq(testUserDataDto.getId()), any(Authentication.class))).thenReturn(true);
        when(userSecurity.isMovieOwnerForCreate(any(CreateMovieDto.class), any(Authentication.class)))
                .thenAnswer(invocation -> {
                    CreateMovieDto dto = invocation.getArgument(0);
                    Authentication auth = invocation.getArgument(1);
                    return auth.getName().equals(testUserDataDto.getCognitoUserId()) && dto.getUserId().equals(testUserDataDto.getId());
                });
        when(userSecurity.isMovieOwnerForCreateBulk(anyList(), any(Authentication.class)))
                .thenAnswer(invocation -> {
                    List<CreateMovieDto> dtos = invocation.getArgument(0);
                    Authentication auth = invocation.getArgument(1);
                    return auth.getName().equals(testUserDataDto.getCognitoUserId()) && dtos.stream().allMatch(dto -> dto.getUserId().equals(testUserDataDto.getId()));
                });
        when(userSecurity.isMovieOwnerForUpdate(any(UpdateMovieDto.class), any(Authentication.class)))
                .thenAnswer(invocation -> {
                    UpdateMovieDto dto = invocation.getArgument(0);
                    Authentication auth = invocation.getArgument(1);
                    return auth.getName().equals(testUserDataDto.getCognitoUserId()) && dto.getUserId().equals(testUserDataDto.getId());
                });
        when(userSecurity.areAllMoviesOwnedByAuthenticatedUser(anyList(), any(Authentication.class)))
                .thenAnswer(invocation -> {
                    List<Long> movieIds = invocation.getArgument(0);
                    Authentication auth = invocation.getArgument(1);
                    return auth.getName().equals(testUserDataDto.getCognitoUserId()) && movieIds.stream().allMatch(id -> id.equals(testMovieDataDto.getId()));
                });

        when(userSecurity.isSearchingOwnMovies(eq(testOtherUserDataDto.getId()), any(Authentication.class))).thenReturn(false);
        when(userSecurity.isMovieOwnerById(eq(testOtherMovieDataDto.getId()), any(Authentication.class))).thenReturn(false);
        when(userSecurity.isFetchingOwnWatchedDates(eq(testOtherUserDataDto.getId()), any(Authentication.class))).thenReturn(false);
        when(userSecurity.isCheckingOwnMovieTitles(eq(testOtherUserDataDto.getId()), any(Authentication.class))).thenReturn(false);
    }

    // --- Tests for GET /api/v1/movies/search/user/{userId} ---

    @Test
    void searchMovies_UserCannotAccessOtherUsersMovies_AccessDenied() throws Exception {
        mockMvc.perform(get("/api/v1/movies/search/user/{userId}", testOtherUserDataDto.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .with(user(testUserDataDto.getCognitoUserId()).roles("USER")))
                .andExpect(status().isForbidden());

        verify(movieService, never()).searchMovies(anyLong(), any(), any());
        verify(userSecurity, times(1)).isSearchingOwnMovies(eq(testOtherUserDataDto.getId()), any(Authentication.class));
    }

    // --- Tests for GET /api/v1/movies/{id} ---

    @Test
    void getMovieById_UserOwnMovie_Success() throws Exception {
        mockMvc.perform(get("/api/v1/movies/{id}", testMovieDataDto.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .with(user(testUserDataDto.getCognitoUserId()).roles("USER")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testMovieDataDto.getId()));

        verify(movieService, times(1)).getMovieById(testMovieDataDto.getId());
        verify(userSecurity, times(1)).isMovieOwnerById(eq(testMovieDataDto.getId()), any(Authentication.class));
    }

    @Test
    void getMovieById_UserCannotAccessOtherUsersMovie_AccessDenied() throws Exception {
        mockMvc.perform(get("/api/v1/movies/{id}", testOtherMovieDataDto.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .with(user(testUserDataDto.getCognitoUserId()).roles("USER")))
                .andExpect(status().isForbidden());

        verify(movieService, never()).getMovieById(anyLong());
        verify(userSecurity, times(1)).isMovieOwnerById(eq(testOtherMovieDataDto.getId()), any(Authentication.class));
    }

    // --- Tests for GET /api/v1/movies/watched-dates/user/{userId} ---

    @Test
    void getWatchedMovieDates_UserCannotAccessOtherUsersDates_AccessDenied() throws Exception {
        mockMvc.perform(get("/api/v1/movies/watched-dates/user/{userId}", testOtherUserDataDto.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .with(user(testUserDataDto.getCognitoUserId()).roles("USER")))
                .andExpect(status().isForbidden());

        verify(movieService, never()).getWatchedMovieDatesForUser(anyLong());
        verify(userSecurity, times(1)).isFetchingOwnWatchedDates(eq(testOtherUserDataDto.getId()), any(Authentication.class));
    }

    @Test
    void getWatchedMovieDates_AdminRole_Success() throws Exception {
        mockMvc.perform(get("/api/v1/movies/watched-dates/user/{userId}", testOtherUserDataDto.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .with(user("adminUser").roles("ADMIN")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value("2022-05-01"));

        verify(movieService, times(1)).getWatchedMovieDatesForUser(testOtherUserDataDto.getId());
        verify(userSecurity, never()).isFetchingOwnWatchedDates(anyLong(), any(Authentication.class));
    }

    // --- Tests for GET /api/v1/movies/movie-title/{movieTitle}/user/{userId} ---

    @Test
    void isMovieTitleUnique_UserOwnCheck_Success() throws Exception {
        mockMvc.perform(get("/api/v1/movies/movie-title/{movieTitle}/user/{userId}", "New Movie Title", testUserDataDto.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .with(user(testUserDataDto.getCognitoUserId()).roles("USER")))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        verify(movieService, times(1)).isMovieTitleUnique(eq(testUserDataDto.getId()), eq("New Movie Title"));
        verify(userSecurity, times(1)).isCheckingOwnMovieTitles(eq(testUserDataDto.getId()), any(Authentication.class));
    }

    @Test
    void isMovieTitleUnique_UserCannotCheckOtherUsersTitle_AccessDenied() throws Exception {
        mockMvc.perform(get("/api/v1/movies/movie-title/{movieTitle}/user/{userId}", "Some Title", testOtherUserDataDto.getId()) // Check for user 2
                        .contentType(MediaType.APPLICATION_JSON)
                        .with(user(testUserDataDto.getCognitoUserId()).roles("USER")))
                .andExpect(status().isForbidden());

        verify(movieService, never()).isMovieTitleUnique(anyLong(), anyString());
        verify(userSecurity, times(1)).isCheckingOwnMovieTitles(eq(testOtherUserDataDto.getId()), any(Authentication.class));
    }

    @Test
    void isMovieTitleUnique_AdminRole_Success() throws Exception {
        mockMvc.perform(get("/api/v1/movies/movie-title/{movieTitle}/user/{userId}", "Existing Movie Title", testOtherUserDataDto.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .with(user("adminUser").roles("ADMIN")))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        verify(movieService, times(1)).isMovieTitleUnique(eq(testOtherUserDataDto.getId()), eq("Existing Movie Title"));
        verify(userSecurity, never()).isCheckingOwnMovieTitles(anyLong(), any(Authentication.class));
    }

    // --- Tests for POST /api/v1/movies ---

    @Test
    void createMovie_UserCanCreateOwn_Success() throws Exception {
        mockMvc.perform(post("/api/v1/movies")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateMovieDto))
                        .with(user(testUserDataDto.getCognitoUserId()).roles("USER")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testMovieDataDto.getId()));

        verify(movieService, times(1)).createMovie(any(CreateMovieDto.class));
        verify(userSecurity, times(1)).isMovieOwnerForCreate(any(CreateMovieDto.class), any(Authentication.class));
    }

    @Test
    void createMovie_UserCannotCreateForOtherUser_AccessDenied() throws Exception {
        CreateMovieDto dtoForOtherUser = new CreateMovieDto(
                testOtherUserDataDto.getId(),
                testCreateMovieDto.getTmdbId(),
                testCreateMovieDto.getTitle(),
                testCreateMovieDto.getStatus(),
                testCreateMovieDto.getWatchedDate(),
                testCreateMovieDto.getUserRating(),
                testCreateMovieDto.getUserReview(),
                testCreateMovieDto.getReleaseYear(),
                testCreateMovieDto.getPosterUrl(),
                testCreateMovieDto.getDirector(),
                testCreateMovieDto.getPlotSummary(),
                testCreateMovieDto.getRuntimeMinutes(),
                testCreateMovieDto.getGenres(),
                testCreateMovieDto.getActors(),
                null
        );

        mockMvc.perform(post("/api/v1/movies")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dtoForOtherUser))
                        .with(user(testUserDataDto.getCognitoUserId()).roles("USER")))
                .andExpect(status().isForbidden());

        verify(movieService, never()).createMovie(any(CreateMovieDto.class));
        verify(userSecurity, times(1)).isMovieOwnerForCreate(any(CreateMovieDto.class), any(Authentication.class));
    }

    @Test
    void createMovie_AdminRole_Success() throws Exception {
        mockMvc.perform(post("/api/v1/movies")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateMovieDto))
                        .with(user("adminUser").roles("ADMIN")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testMovieDataDto.getId()));

        verify(movieService, times(1)).createMovie(any(CreateMovieDto.class));
        verify(userSecurity, never()).isMovieOwnerForCreate(any(CreateMovieDto.class), any(Authentication.class));
    }

    // --- Tests for POST /api/v1/movies/bulk ---

    @Test
    void createMoviesBulk_UserCanCreateOwnBulk_Success() throws Exception {
        List<CreateMovieDto> movieDtos = Arrays.asList(testCreateMovieDto, testCreateMovieDto);
        mockMvc.perform(post("/api/v1/movies/bulk")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(movieDtos))
                        .with(user(testUserDataDto.getCognitoUserId()).roles("USER")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(testMovieDataDto.getId()));

        verify(movieService, times(1)).createMoviesBulk(anyList());
        verify(userSecurity, times(1)).isMovieOwnerForCreateBulk(anyList(), any(Authentication.class));
    }

    @Test
    void createMoviesBulk_UserCannotCreateForOtherUserBulk_AccessDenied() throws Exception {
        CreateMovieDto dtoForOtherUser = new CreateMovieDto(testOtherUserDataDto.getId(), 123L, "Other User's Movie", MovieStatus.WATCHED, null, null, null, 2020, null, null, null, 0, null, null, null);
        List<CreateMovieDto> movieDtos = Arrays.asList(testCreateMovieDto, dtoForOtherUser);

        mockMvc.perform(post("/api/v1/movies/bulk")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(movieDtos))
                        .with(user(testUserDataDto.getCognitoUserId()).roles("USER")))
                .andExpect(status().isForbidden());

        verify(movieService, never()).createMoviesBulk(anyList());
        verify(userSecurity, times(1)).isMovieOwnerForCreateBulk(anyList(), any(Authentication.class));
    }

    @Test
    void createMoviesBulk_AdminRole_Success() throws Exception {
        List<CreateMovieDto> movieDtos = Arrays.asList(testCreateMovieDto, testCreateMovieDto);
        mockMvc.perform(post("/api/v1/movies/bulk")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(movieDtos))
                        .with(user("adminUser").roles("ADMIN")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(testMovieDataDto.getId()));

        verify(movieService, times(1)).createMoviesBulk(anyList());
        verify(userSecurity, never()).isMovieOwnerForCreateBulk(anyList(), any(Authentication.class));
    }

    // --- Tests for PUT /api/v1/movies ---

    @Test
    void updateMovie_UserCanUpdateOwn_Success() throws Exception {
        mockMvc.perform(put("/api/v1/movies")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testUpdateMovieDto))
                        .with(user(testUserDataDto.getCognitoUserId()).roles("USER")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value(testUpdateMovieDto.getTitle()));

        verify(movieService, times(1)).updateMovie(any(UpdateMovieDto.class));
        verify(userSecurity, times(1)).isMovieOwnerForUpdate(any(UpdateMovieDto.class), any(Authentication.class));
    }

    @Test
    void updateMovie_UserCannotUpdateOtherUsersMovie_AccessDenied() throws Exception {
        UpdateMovieDto dtoForOtherUser = new UpdateMovieDto(
                testOtherMovieDataDto.getId(),
                testOtherUserDataDto.getId(),
                testOtherMovieDataDto.getTmdbId(),
                "Malicious Update",
                testOtherMovieDataDto.getStatus(),
                testOtherMovieDataDto.getWatchedDate(),
                testOtherMovieDataDto.getUserRating(),
                testOtherMovieDataDto.getUserReview(),
                testOtherMovieDataDto.getReleaseYear(),
                testOtherMovieDataDto.getPosterUrl(),
                testOtherMovieDataDto.getDirector(),
                testOtherMovieDataDto.getPlotSummary(),
                testOtherMovieDataDto.getRuntimeMinutes(),
                testOtherMovieDataDto.getGenres(),
                testOtherMovieDataDto.getActors(),
                null
        );

        mockMvc.perform(put("/api/v1/movies")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dtoForOtherUser))
                        .with(user(testUserDataDto.getCognitoUserId()).roles("USER")))
                .andExpect(status().isForbidden());

        verify(movieService, never()).updateMovie(any(UpdateMovieDto.class));
        verify(userSecurity, times(1)).isMovieOwnerForUpdate(any(UpdateMovieDto.class), any(Authentication.class));
    }

    @Test
    void updateMovie_AdminRole_Success() throws Exception {
        UpdateMovieDto dtoToUpdateOtherUserMovie = new UpdateMovieDto(
                testOtherMovieDataDto.getId(),
                testOtherUserDataDto.getId(),
                testOtherMovieDataDto.getTmdbId(),
                "Admin Updated Title",
                testOtherMovieDataDto.getStatus(),
                testOtherMovieDataDto.getWatchedDate(),
                testOtherMovieDataDto.getUserRating(),
                testOtherMovieDataDto.getUserReview(),
                testOtherMovieDataDto.getReleaseYear(),
                testOtherMovieDataDto.getPosterUrl(),
                testOtherMovieDataDto.getDirector(),
                testOtherMovieDataDto.getPlotSummary(),
                testOtherMovieDataDto.getRuntimeMinutes(),
                testOtherMovieDataDto.getGenres(),
                testOtherMovieDataDto.getActors(),
                null
        );

        MovieDataDto returnedMovieDataDto = new MovieDataDto(
                dtoToUpdateOtherUserMovie.getId(),
                dtoToUpdateOtherUserMovie.getUserId(),
                dtoToUpdateOtherUserMovie.getTmdbId(),
                dtoToUpdateOtherUserMovie.getTitle(),
                dtoToUpdateOtherUserMovie.getStatus(),
                dtoToUpdateOtherUserMovie.getWatchedDate(),
                dtoToUpdateOtherUserMovie.getUserRating(),
                dtoToUpdateOtherUserMovie.getUserReview(),
                LocalDateTime.now(),
                LocalDateTime.now(),
                dtoToUpdateOtherUserMovie.getReleaseYear(),
                dtoToUpdateOtherUserMovie.getPosterUrl(),
                dtoToUpdateOtherUserMovie.getDirector(),
                dtoToUpdateOtherUserMovie.getPlotSummary(),
                dtoToUpdateOtherUserMovie.getRuntimeMinutes(),
                dtoToUpdateOtherUserMovie.getGenres(),
                dtoToUpdateOtherUserMovie.getActors(),
                null
        );

        when(movieService.updateMovie(any(UpdateMovieDto.class))).thenReturn(returnedMovieDataDto);

        mockMvc.perform(put("/api/v1/movies")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dtoToUpdateOtherUserMovie))
                        .with(user("adminUser").roles("ADMIN")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value(returnedMovieDataDto.getTitle()));

        verify(movieService, times(1)).updateMovie(any(UpdateMovieDto.class));
        verify(userSecurity, never()).isMovieOwnerForUpdate(any(UpdateMovieDto.class), any(Authentication.class));
    }

    // --- Tests for DELETE /api/v1/movies/{id} ---

    @Test
    void deleteMovie_UserCanDeleteOwnMovie_Success() throws Exception {
        mockMvc.perform(delete("/api/v1/movies/{id}", testMovieDataDto.getId())
                        .with(user(testUserDataDto.getCognitoUserId()).roles("USER")))
                .andExpect(status().isOk());

        verify(movieService, times(1)).deleteMovie(testMovieDataDto.getId());
        verify(userSecurity, times(1)).isMovieOwnerById(eq(testMovieDataDto.getId()), any(Authentication.class));
    }

    @Test
    void deleteMovie_UserCannotDeleteOtherUsersMovie_AccessDenied() throws Exception {
        mockMvc.perform(delete("/api/v1/movies/{id}", testOtherMovieDataDto.getId())
                        .with(user(testUserDataDto.getCognitoUserId()).roles("USER")))
                .andExpect(status().isForbidden());

        verify(movieService, never()).deleteMovie(anyLong());
        verify(userSecurity, times(1)).isMovieOwnerById(eq(testOtherMovieDataDto.getId()), any(Authentication.class));
    }

    @Test
    void deleteMovie_AdminRole_Success() throws Exception {
        mockMvc.perform(delete("/api/v1/movies/{id}", testOtherMovieDataDto.getId())
                        .with(user("adminUser").roles("ADMIN")))
                .andExpect(status().isOk());

        verify(movieService, times(1)).deleteMovie(testOtherMovieDataDto.getId());
        verify(userSecurity, never()).isMovieOwnerById(anyLong(), any(Authentication.class));
    }

    // --- Tests for DELETE /api/v1/movies/bulk ---

    @Test
    void deleteMoviesBulk_UserCanDeleteOwnMoviesBulk_Success() throws Exception {
        List<Long> movieIdsToDelete = Collections.singletonList(testMovieDataDto.getId());
        mockMvc.perform(delete("/api/v1/movies/bulk")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(movieIdsToDelete))
                        .with(user(testUserDataDto.getCognitoUserId()).roles("USER")))
                .andExpect(status().isOk());

        verify(movieService, times(1)).deleteMovies(movieIdsToDelete);
        verify(userSecurity, times(1)).areAllMoviesOwnedByAuthenticatedUser(eq(movieIdsToDelete), any(Authentication.class));
    }

    @Test
    void deleteMoviesBulk_UserCannotDeleteOtherUsersMoviesBulk_AccessDenied() throws Exception {
        List<Long> movieIdsToDelete = Arrays.asList(testMovieDataDto.getId(), testOtherMovieDataDto.getId());
        mockMvc.perform(delete("/api/v1/movies/bulk")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(movieIdsToDelete))
                        .with(user(testUserDataDto.getCognitoUserId()).roles("USER")))
                .andExpect(status().isForbidden());

        verify(movieService, never()).deleteMovies(anyList());
        verify(userSecurity, times(1)).areAllMoviesOwnedByAuthenticatedUser(eq(movieIdsToDelete), any(Authentication.class));
    }

    @Test
    void deleteMoviesBulk_AdminRole_Success() throws Exception {
        List<Long> movieIdsToDelete = Arrays.asList(testMovieDataDto.getId(), testOtherMovieDataDto.getId());
        mockMvc.perform(delete("/api/v1/movies/bulk")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(movieIdsToDelete))
                        .with(user("adminUser").roles("ADMIN")))
                .andExpect(status().isOk());

        verify(movieService, times(1)).deleteMovies(movieIdsToDelete);
        verify(userSecurity, never()).areAllMoviesOwnedByAuthenticatedUser(anyList(), any(Authentication.class));
    }
}