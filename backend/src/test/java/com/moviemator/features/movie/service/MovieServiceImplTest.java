package com.moviemator.features.movie.service;
import com.moviemator.core.user.model.User;
import com.moviemator.core.user.repository.UserRepository;
import com.moviemator.features.movie.dto.*;
import com.moviemator.features.movie.model.Movie;
import com.moviemator.features.movie.model.MovieStatus;
import com.moviemator.features.movie.repository.MovieRepository;
import com.moviemator.shared.error.types.ResourceAlreadyExistsException;
import com.moviemator.shared.error.types.ResourceIdentifierType;
import com.moviemator.shared.error.types.ResourceNotFoundException;
import com.moviemator.shared.error.types.ResourceType;
import com.moviemator.shared.sanitization.service.EntitySanitizerService;
import com.moviemator.shared.search.models.MovieFilters;
import com.moviemator.shared.search.models.PaginatedResults;
import com.moviemator.shared.search.models.SearchParams;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MovieServiceImplTest {

    @Mock
    private MovieRepository movieRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EntitySanitizerService sanitizerService;

    @InjectMocks
    private MovieServiceImpl movieService;

    private Movie testMovie;
    private Movie otherUserMovie;
    private User testUser;
    private User otherUser;
    private MovieDataDto testMovieDataDto;
    private MovieSearchDto testMovieSearchDto;
    private CreateMovieDto testCreateMovieDto;
    private UpdateMovieDto testUpdateMovieDto;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setCognitoUserId("cognito-user-1");
        testUser.setEmail("user1@example.com");
        testUser.setDisplayName("Test User 1");
        testUser.setCreatedAt(LocalDateTime.now());
        testUser.setUpdatedAt(LocalDateTime.now());

        otherUser = new User();
        otherUser.setId(2L);
        otherUser.setCognitoUserId("cognito-user-2");
        otherUser.setEmail("user2@example.com");
        otherUser.setDisplayName("Test User 2");
        otherUser.setCreatedAt(LocalDateTime.now());
        otherUser.setUpdatedAt(LocalDateTime.now());

        testMovie = new Movie();
        testMovie.setId(101L);
        testMovie.setUserId(testUser.getId());
        testMovie.setTmdbId(12345L);
        testMovie.setTitle("Test Movie");
        testMovie.setReleaseYear(2020);
        testMovie.setPosterUrl("poster1.jpg");
        testMovie.setDirector("Director A");
        testMovie.setPlotSummary("Plot summary A");
        testMovie.setUserRating(8.5f);
        testMovie.setUserReview("Great movie!");
        testMovie.setWatchedDate(LocalDate.of(2023, 1, 15));
        testMovie.setWatchedDates(new ArrayList<>(Arrays.asList(LocalDate.of(2023, 1, 15), LocalDate.of(2024, 5, 20))));
        testMovie.setCreatedAt(LocalDateTime.now());
        testMovie.setUpdatedAt(LocalDateTime.now());
        testMovie.setStatus(MovieStatus.WATCHED);
        testMovie.setRuntimeMinutes(120);
        testMovie.setGenres(new ArrayList<>(Arrays.asList("Action", "Sci-Fi")));
        testMovie.setActors(new ArrayList<>(Arrays.asList("Actor X", "Actor Y")));

        otherUserMovie = new Movie();
        otherUserMovie.setId(102L);
        otherUserMovie.setUserId(otherUser.getId());
        otherUserMovie.setTmdbId(54321L);
        otherUserMovie.setTitle("Other User's Movie");
        otherUserMovie.setReleaseYear(2021);
        otherUserMovie.setPosterUrl("poster2.jpg");
        otherUserMovie.setDirector("Director B");
        otherUserMovie.setPlotSummary("Plot summary B");
        otherUserMovie.setUserRating(7.0f);
        otherUserMovie.setUserReview("Decent");
        otherUserMovie.setWatchedDate(LocalDate.of(2024, 2, 20));
        otherUserMovie.setWatchedDates(new ArrayList<>(Collections.singletonList(LocalDate.of(2024, 2, 20))));
        otherUserMovie.setCreatedAt(LocalDateTime.now());
        otherUserMovie.setUpdatedAt(LocalDateTime.now());
        otherUserMovie.setStatus(MovieStatus.WATCHLIST);
        otherUserMovie.setRuntimeMinutes(90);
        otherUserMovie.setGenres(new ArrayList<>(Collections.singletonList("Drama")));
        otherUserMovie.setActors(new ArrayList<>(Collections.singletonList("Actor Z")));


        testMovieDataDto = MovieDtoMapper.INSTANCE.movieToMovieDataDto(testMovie);
        testMovieSearchDto = MovieDtoMapper.INSTANCE.movieToMovieSearchDto(testMovie);

        testCreateMovieDto = new CreateMovieDto(
                testUser.getId(),
                98765L,
                "New Movie Title",
                MovieStatus.WATCHED,
                LocalDate.of(2024, 7, 1),
                9.0f,
                "Excellent!",
                2023,
                "new_poster.jpg",
                "New Director",
                "New plot",
                100,
                Arrays.asList("Comedy"),
                Arrays.asList("New Actor"),
                Arrays.asList(LocalDate.of(2024, 7, 1), LocalDate.of(2025, 1, 10))
        );

        testUpdateMovieDto = new UpdateMovieDto(
                testMovie.getId(),
                testMovie.getUserId(),
                testMovie.getTmdbId(),
                "Updated Movie Title",
                MovieStatus.WATCHED,
                LocalDate.of(2023, 2, 1),
                9.5f,
                "Updated review.",
                testMovie.getReleaseYear(),
                testMovie.getPosterUrl(),
                testMovie.getDirector(),
                testMovie.getPlotSummary(),
                125,
                Arrays.asList("Action", "Thriller"),
                Arrays.asList("Actor X", "Actor Z"),
                Arrays.asList(LocalDate.of(2023, 2, 1), LocalDate.of(2024, 6, 15))
        );
    }

    // --- searchMovies ---
    @Test
    void searchMovies_ReturnsPaginatedResults() {
        // Arrange
        SearchParams searchParams = new SearchParams("", "createdAt", true, 1, 10);
        MovieFilters movieFilters = new MovieFilters(null, null, null, null, null, null, null, null, null, null, null, null);
        PaginatedResults<Movie> mockRepoResults = new PaginatedResults<>(Collections.singletonList(testMovie), 1L);
        when(movieRepository.searchMovies(eq(testUser.getId()), any(SearchParams.class), any(MovieFilters.class)))
                .thenReturn(mockRepoResults);

        // Act
        PaginatedResults<MovieSearchDto> results = movieService.searchMovies(testUser.getId(), searchParams, movieFilters);

        // Assert
        assertNotNull(results);
        assertFalse(results.getResults().isEmpty());
        assertEquals(1, results.getResults().size());
        assertEquals(testMovieSearchDto, results.getResults().getFirst(), "The mapped MovieSearchDto should match the expected DTO.");
        assertEquals(1L, results.getTotalCount());

        verify(movieRepository, times(1)).searchMovies(eq(testUser.getId()), any(SearchParams.class), any(MovieFilters.class));
    }

    // --- getMovieById ---
    @Test
    void getMovieById_Success() {
        // Arrange
        when(movieRepository.findById(testMovie.getId())).thenReturn(Optional.of(testMovie));

        // Act
        MovieDataDto result = movieService.getMovieById(testMovie.getId());

        // Assert
        assertNotNull(result);
        assertEquals(testMovieDataDto, result, "The mapped MovieDataDto should match the expected DTO.");

        verify(movieRepository, times(1)).findById(testMovie.getId());
    }

    @Test
    void getMovieById_NotFound() {
        // Arrange
        when(movieRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () ->
                movieService.getMovieById(999L)
        );

        assertEquals("999", exception.getIdentifier());
        assertEquals(ResourceType.MOVIE, exception.getResourceType());
        assertEquals(ResourceIdentifierType.ID, exception.getIdentifierType());

        verify(movieRepository, times(1)).findById(999L);
    }

    // --- getWatchedMovieDatesForUser ---
    @Test
    void getWatchedMovieDatesForUser_ReturnsListOfDates() {
        // Arrange
        List<LocalDate> expectedServiceDates = Arrays.asList(
                LocalDate.of(2023, 1, 1),
                LocalDate.of(2023, 1, 15),
                LocalDate.of(2023, 3, 10),
                LocalDate.of(2024, 5, 20)
        );
        List<Date> mockRepoReturnDates = expectedServiceDates.stream()
                .map(Date::valueOf)
                .collect(java.util.stream.Collectors.toList());

        when(movieRepository.findAllWatchedDatesByUserId(testUser.getId())).thenReturn(mockRepoReturnDates);

        // Act
        List<LocalDate> result = movieService.getWatchedMovieDatesForUser(testUser.getId());

        // Assert
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(expectedServiceDates.size(), result.size());
        assertTrue(result.containsAll(expectedServiceDates));
        assertEquals(expectedServiceDates.size(), result.size());

        verify(movieRepository, times(1)).findAllWatchedDatesByUserId(testUser.getId());
    }

    @Test
    void getWatchedMovieDatesForUser_NoDatesFound() {
        // Arrange
        when(movieRepository.findAllWatchedDatesByUserId(testUser.getId())).thenReturn(Collections.emptyList());

        // Act
        List<LocalDate> result = movieService.getWatchedMovieDatesForUser(testUser.getId());

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(movieRepository, times(1)).findAllWatchedDatesByUserId(testUser.getId());
    }

    // --- isMovieTitleUnique ---
    @Test
    void isMovieTitleUnique_ReturnsTrueWhenUnique() {
        // Arrange
        when(movieRepository.hasNonUniqueTitle(eq(testUser.getId()), eq("Unique Title"))).thenReturn(false);

        // Act
        boolean result = movieService.isMovieTitleUnique(testUser.getId(), "Unique Title");

        // Assert
        assertTrue(result);
        verify(movieRepository, times(1)).hasNonUniqueTitle(eq(testUser.getId()), eq("Unique Title"));
    }

    @Test
    void isMovieTitleUnique_ReturnsFalseWhenNotUnique() {
        // Arrange
        when(movieRepository.hasNonUniqueTitle(eq(testUser.getId()), eq("Existing Title"))).thenReturn(true);

        // Act
        boolean result = movieService.isMovieTitleUnique(testUser.getId(), "Existing Title");

        // Assert
        assertFalse(result);
        verify(movieRepository, times(1)).hasNonUniqueTitle(eq(testUser.getId()), eq("Existing Title"));
    }

    // --- createMovie ---
    @Test
    void createMovie_Success() {
        // Arrange
        when(sanitizerService.sanitizeCreateMovieDto(any(CreateMovieDto.class))).thenReturn(testCreateMovieDto);
        when(userRepository.existsById(testCreateMovieDto.getUserId())).thenReturn(true);
        when(movieRepository.hasNonUniqueTitle(testCreateMovieDto.getUserId(), testCreateMovieDto.getTitle())).thenReturn(false);
        when(movieRepository.save(any(Movie.class))).thenReturn(testMovie);

        // Act
        MovieDataDto result = movieService.createMovie(testCreateMovieDto);

        // Assert
        assertNotNull(result);
        assertEquals(testMovieDataDto, result, "The created MovieDataDto should match the expected DTO.");

        verify(sanitizerService, times(1)).sanitizeCreateMovieDto(any(CreateMovieDto.class));
        verify(userRepository, times(1)).existsById(testCreateMovieDto.getUserId());
        verify(movieRepository, times(1)).hasNonUniqueTitle(testCreateMovieDto.getUserId(), testCreateMovieDto.getTitle());
        verify(movieRepository, times(1)).save(any(Movie.class));
    }

    @Test
    void createMovie_UserNotFound() {
        // Arrange
        when(sanitizerService.sanitizeCreateMovieDto(any(CreateMovieDto.class))).thenReturn(testCreateMovieDto);
        when(userRepository.existsById(testCreateMovieDto.getUserId())).thenReturn(false);

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () ->
                movieService.createMovie(testCreateMovieDto)
        );

        assertEquals(testCreateMovieDto.getUserId().toString(), exception.getIdentifier());
        assertEquals(ResourceType.USER, exception.getResourceType());
        assertEquals(ResourceIdentifierType.ID, exception.getIdentifierType());

        verify(sanitizerService, times(1)).sanitizeCreateMovieDto(any(CreateMovieDto.class));
        verify(userRepository, times(1)).existsById(testCreateMovieDto.getUserId());
        verify(movieRepository, never()).hasNonUniqueTitle(anyLong(), anyString());
        verify(movieRepository, never()).save(any(Movie.class));
    }

    @Test
    void createMovie_TitleAlreadyExists() {
        // Arrange
        when(sanitizerService.sanitizeCreateMovieDto(any(CreateMovieDto.class))).thenReturn(testCreateMovieDto);
        when(userRepository.existsById(testCreateMovieDto.getUserId())).thenReturn(true);
        when(movieRepository.hasNonUniqueTitle(testCreateMovieDto.getUserId(), testCreateMovieDto.getTitle())).thenReturn(true);

        // Act & Assert
        ResourceAlreadyExistsException exception = assertThrows(ResourceAlreadyExistsException.class, () ->
                movieService.createMovie(testCreateMovieDto)
        );

        assertEquals(testCreateMovieDto.getTitle(), exception.getIdentifier());
        assertEquals(ResourceType.MOVIE, exception.getResourceType());
        assertEquals(ResourceIdentifierType.TITLE, exception.getIdentifierType());

        verify(sanitizerService, times(1)).sanitizeCreateMovieDto(any(CreateMovieDto.class));
        verify(userRepository, times(1)).existsById(testCreateMovieDto.getUserId());
        verify(movieRepository, times(1)).hasNonUniqueTitle(testCreateMovieDto.getUserId(), testCreateMovieDto.getTitle());
        verify(movieRepository, never()).save(any(Movie.class));
    }

    // --- createMoviesBulk ---
    @Test
    void createMoviesBulk_Success() {
        // Arrange
        CreateMovieDto bulkCreateMovieDto1 = testCreateMovieDto;
        CreateMovieDto bulkCreateMovieDto2 = new CreateMovieDto(
                testUser.getId(), 98766L, "Another New Movie", MovieStatus.WATCHED, LocalDate.of(2024, 8, 1), 8.0f, "Good", 2024, "poster.jpg", "Dir C", "Plot C",
                110, Collections.singletonList("Fantasy"), Collections.singletonList("Actor A"), null
        );
        List<CreateMovieDto> movieDtos = Arrays.asList(bulkCreateMovieDto1, bulkCreateMovieDto2);

        Movie movie1 = MovieDtoMapper.INSTANCE.createMovieDtoToMovie(bulkCreateMovieDto1);
        movie1.setId(101L);
        Movie movie2 = MovieDtoMapper.INSTANCE.createMovieDtoToMovie(bulkCreateMovieDto2);
        movie2.setId(103L);

        MovieDataDto movieDataDto1 = MovieDtoMapper.INSTANCE.movieToMovieDataDto(movie1);
        MovieDataDto movieDataDto2 = MovieDtoMapper.INSTANCE.movieToMovieDataDto(movie2);
        List<MovieDataDto> expectedMovieDataDtos = Arrays.asList(movieDataDto1, movieDataDto2);

        when(sanitizerService.sanitizeCreateMovieDto(bulkCreateMovieDto1)).thenReturn(bulkCreateMovieDto1);
        when(sanitizerService.sanitizeCreateMovieDto(bulkCreateMovieDto2)).thenReturn(bulkCreateMovieDto2);
        when(userRepository.existsById(testUser.getId())).thenReturn(true);
        when(movieRepository.hasNonUniqueTitle(eq(testUser.getId()), eq(bulkCreateMovieDto1.getTitle()))).thenReturn(false);
        when(movieRepository.hasNonUniqueTitle(eq(testUser.getId()), eq(bulkCreateMovieDto2.getTitle()))).thenReturn(false);

        when(movieRepository.saveAll(anyList())).thenReturn(Arrays.asList(movie1, movie2));

        // Act
        List<MovieDataDto> results = movieService.createMoviesBulk(movieDtos);

        // Assert
        assertNotNull(results);
        assertEquals(2, results.size());
        assertEquals(expectedMovieDataDtos, results);

        verify(sanitizerService, times(2)).sanitizeCreateMovieDto(any(CreateMovieDto.class));
        verify(userRepository, times(2)).existsById(testUser.getId());
        verify(movieRepository, times(1)).hasNonUniqueTitle(eq(testUser.getId()), eq(bulkCreateMovieDto1.getTitle()));
        verify(movieRepository, times(1)).hasNonUniqueTitle(eq(testUser.getId()), eq(bulkCreateMovieDto2.getTitle()));
        verify(movieRepository, times(1)).saveAll(argThat(argument -> {
            List<Movie> savedMovies = (List<Movie>) argument;
            return savedMovies.size() == 2 &&
                    savedMovies.stream().anyMatch(m -> m.getTitle().equals(bulkCreateMovieDto1.getTitle())) &&
                    savedMovies.stream().anyMatch(m -> m.getTitle().equals(bulkCreateMovieDto2.getTitle()));
        }));
    }

    @Test
    void createMoviesBulk_UserNotFoundInBulk() {
        // Arrange
        CreateMovieDto bulkCreateMovieDto1 = testCreateMovieDto;
        CreateMovieDto bulkCreateMovieDtoOtherUser = new CreateMovieDto(
                otherUser.getId(), 98767L, "Movie For Other User", MovieStatus.WATCHED, LocalDate.of(2025, 1, 1), 7.5f, "OK", 2025, "poster.jpg", "Dir D", "Plot D",
                105, Collections.singletonList("Action"), Collections.singletonList("Actor B"), null
        );
        List<CreateMovieDto> movieDtos = Arrays.asList(bulkCreateMovieDto1, bulkCreateMovieDtoOtherUser);

        when(sanitizerService.sanitizeCreateMovieDto(bulkCreateMovieDto1)).thenReturn(bulkCreateMovieDto1);
        when(sanitizerService.sanitizeCreateMovieDto(bulkCreateMovieDtoOtherUser)).thenReturn(bulkCreateMovieDtoOtherUser);
        when(userRepository.existsById(testUser.getId())).thenReturn(true);
        when(userRepository.existsById(otherUser.getId())).thenReturn(false);
        when(movieRepository.hasNonUniqueTitle(eq(testUser.getId()), eq(bulkCreateMovieDto1.getTitle()))).thenReturn(false);

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () ->
                movieService.createMoviesBulk(movieDtos)
        );

        assertEquals(otherUser.getId().toString(), exception.getIdentifier());
        assertEquals(ResourceType.USER, exception.getResourceType());
        assertEquals(ResourceIdentifierType.ID, exception.getIdentifierType());

        verify(sanitizerService, times(2)).sanitizeCreateMovieDto(any(CreateMovieDto.class));
        verify(userRepository, times(1)).existsById(testUser.getId());
        verify(userRepository, times(1)).existsById(otherUser.getId());
        verify(movieRepository, times(1)).hasNonUniqueTitle(eq(testUser.getId()), eq(bulkCreateMovieDto1.getTitle()));
        verify(movieRepository, never()).saveAll(anyList());
    }

    @Test
    void createMoviesBulk_TitleAlreadyExistsInBulk() {
        // Arrange
        CreateMovieDto bulkCreateMovieDto1 = new CreateMovieDto(
                testUser.getId(),
                98765L,
                "Unique First Movie Title",
                MovieStatus.WATCHED,
                LocalDate.of(2024, 7, 1),
                9.0f,
                "Excellent!",
                2023,
                "new_poster.jpg",
                "New Director",
                "New plot",
                100,
                Arrays.asList("Comedy"),
                Arrays.asList("New Actor"),
                null
        );

        CreateMovieDto bulkCreateMovieDtoDuplicateTitle = new CreateMovieDto(
                testUser.getId(), 98768L, "Duplicated Movie Title", MovieStatus.WATCHED, LocalDate.of(2026, 1, 1), 6.0f, "Bad", 2026, "poster.jpg", "Dir E", "Plot E",
                95, Collections.singletonList("Horror"), Collections.singletonList("Actor C"), null
        );
        List<CreateMovieDto> movieDtos = Arrays.asList(bulkCreateMovieDto1, bulkCreateMovieDtoDuplicateTitle);

        when(sanitizerService.sanitizeCreateMovieDto(any(CreateMovieDto.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        when(userRepository.existsById(testUser.getId())).thenReturn(true);

        when(movieRepository.hasNonUniqueTitle(eq(testUser.getId()), eq(bulkCreateMovieDto1.getTitle()))).thenReturn(false);

        when(movieRepository.hasNonUniqueTitle(eq(testUser.getId()), eq(bulkCreateMovieDtoDuplicateTitle.getTitle()))).thenReturn(true);

        // Act & Assert
        ResourceAlreadyExistsException exception = assertThrows(ResourceAlreadyExistsException.class, () ->
                movieService.createMoviesBulk(movieDtos)
        );

        assertEquals(bulkCreateMovieDtoDuplicateTitle.getTitle(), exception.getIdentifier());
        assertEquals(ResourceType.MOVIE, exception.getResourceType());
        assertEquals(ResourceIdentifierType.TITLE, exception.getIdentifierType());

        verify(sanitizerService, times(2)).sanitizeCreateMovieDto(any(CreateMovieDto.class));
        verify(userRepository, times(2)).existsById(testUser.getId());
        verify(movieRepository, times(1)).hasNonUniqueTitle(eq(testUser.getId()), eq(bulkCreateMovieDto1.getTitle()));
        verify(movieRepository, times(1)).hasNonUniqueTitle(eq(testUser.getId()), eq(bulkCreateMovieDtoDuplicateTitle.getTitle()));
        verify(movieRepository, never()).saveAll(anyList());
    }

    // --- updateMovie ---
    @Test
    void updateMovie_Success() {
        // Arrange
        Movie initialMovieState = this.getInitialMovieState();

        when(sanitizerService.sanitizeUpdateMovieDto(any(UpdateMovieDto.class))).thenReturn(testUpdateMovieDto);
        when(movieRepository.findById(testUpdateMovieDto.getId())).thenReturn(Optional.of(initialMovieState));

        when(movieRepository.save(any(Movie.class))).thenAnswer(invocation -> {
            Movie savedMovie = invocation.getArgument(0);
            assertEquals(testUpdateMovieDto.getTitle(), savedMovie.getTitle());
            assertEquals(testUpdateMovieDto.getDirector(), savedMovie.getDirector());
            assertEquals(testUpdateMovieDto.getPlotSummary(), savedMovie.getPlotSummary());
            assertEquals(testUpdateMovieDto.getUserRating(), savedMovie.getUserRating());
            assertEquals(testUpdateMovieDto.getUserReview(), savedMovie.getUserReview());
            assertEquals(testUpdateMovieDto.getWatchedDate(), savedMovie.getWatchedDate());
            assertEquals(testUpdateMovieDto.getStatus(), savedMovie.getStatus());
            assertEquals(testUpdateMovieDto.getRuntimeMinutes(), savedMovie.getRuntimeMinutes());
            assertEquals(testUpdateMovieDto.getGenres(), savedMovie.getGenres());
            assertEquals(testUpdateMovieDto.getActors(), savedMovie.getActors());
            return savedMovie;
        });

        // Act
        MovieDataDto result = movieService.updateMovie(testUpdateMovieDto);

        // Assert
        Movie expectedMovieAfterUpdate = this.getExpectedMovieAfterUpdate(initialMovieState);

        MovieDataDto expectedResultDto = MovieDtoMapper.INSTANCE.movieToMovieDataDto(expectedMovieAfterUpdate);

        assertNotNull(result);
        assertEquals(expectedResultDto.getId(), result.getId());
        assertEquals(expectedResultDto.getTitle(), result.getTitle());
        assertEquals(expectedResultDto.getDirector(), result.getDirector());
        assertEquals(expectedResultDto.getPlotSummary(), result.getPlotSummary());
        assertEquals(expectedResultDto.getUserRating(), result.getUserRating());
        assertEquals(expectedResultDto.getUserReview(), result.getUserReview());
        assertEquals(expectedResultDto.getWatchedDate(), result.getWatchedDate());
        assertEquals(expectedResultDto.getStatus(), result.getStatus());
        assertEquals(expectedResultDto.getRuntimeMinutes(), result.getRuntimeMinutes());
        assertEquals(expectedResultDto.getGenres(), result.getGenres());
        assertEquals(expectedResultDto.getActors(), result.getActors());
        assertNotNull(result.getUpdatedAt());

        verify(sanitizerService, times(1)).sanitizeUpdateMovieDto(any(UpdateMovieDto.class));
        verify(movieRepository, times(1)).findById(testUpdateMovieDto.getId());
        verify(movieRepository, times(1)).save(any(Movie.class));
    }

    private Movie getInitialMovieState() {
        Movie initialMovieState = new Movie();
        initialMovieState.setId(testMovie.getId());
        initialMovieState.setUserId(testMovie.getUserId());
        initialMovieState.setTmdbId(testMovie.getTmdbId());
        initialMovieState.setTitle(testMovie.getTitle());
        initialMovieState.setReleaseYear(testMovie.getReleaseYear());
        initialMovieState.setPosterUrl(testMovie.getPosterUrl());
        initialMovieState.setDirector(testMovie.getDirector());
        initialMovieState.setPlotSummary(testMovie.getPlotSummary());
        initialMovieState.setUserRating(testMovie.getUserRating());
        initialMovieState.setUserReview(testMovie.getUserReview());
        initialMovieState.setWatchedDate(testMovie.getWatchedDate());
        initialMovieState.setCreatedAt(testMovie.getCreatedAt());
        initialMovieState.setUpdatedAt(testMovie.getUpdatedAt());
        initialMovieState.setStatus(testMovie.getStatus());
        initialMovieState.setRuntimeMinutes(testMovie.getRuntimeMinutes());
        initialMovieState.setGenres(testMovie.getGenres());
        initialMovieState.setActors(testMovie.getActors());
        return initialMovieState;
    }

    private Movie getExpectedMovieAfterUpdate(Movie initialMovieState) {
        Movie expectedMovieAfterUpdate = new Movie();
        expectedMovieAfterUpdate.setId(initialMovieState.getId());
        expectedMovieAfterUpdate.setUserId(initialMovieState.getUserId());
        expectedMovieAfterUpdate.setTmdbId(initialMovieState.getTmdbId());
        expectedMovieAfterUpdate.setReleaseYear(initialMovieState.getReleaseYear());
        expectedMovieAfterUpdate.setPosterUrl(initialMovieState.getPosterUrl());
        expectedMovieAfterUpdate.setCreatedAt(initialMovieState.getCreatedAt());

        expectedMovieAfterUpdate.setTitle(testUpdateMovieDto.getTitle());
        expectedMovieAfterUpdate.setDirector(testUpdateMovieDto.getDirector());
        expectedMovieAfterUpdate.setPlotSummary(testUpdateMovieDto.getPlotSummary());
        expectedMovieAfterUpdate.setUserRating(testUpdateMovieDto.getUserRating());
        expectedMovieAfterUpdate.setUserReview(testUpdateMovieDto.getUserReview());
        expectedMovieAfterUpdate.setWatchedDate(testUpdateMovieDto.getWatchedDate());
        expectedMovieAfterUpdate.setStatus(testUpdateMovieDto.getStatus());
        expectedMovieAfterUpdate.setRuntimeMinutes(testUpdateMovieDto.getRuntimeMinutes());
        expectedMovieAfterUpdate.setGenres(testUpdateMovieDto.getGenres());
        expectedMovieAfterUpdate.setActors(testUpdateMovieDto.getActors());
        expectedMovieAfterUpdate.setUpdatedAt(null);
        return expectedMovieAfterUpdate;
    }

    @Test
    void updateMovie_NotFound() {
        // Arrange
        when(sanitizerService.sanitizeUpdateMovieDto(any(UpdateMovieDto.class))).thenReturn(testUpdateMovieDto);
        when(movieRepository.findById(testUpdateMovieDto.getId())).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () ->
                movieService.updateMovie(testUpdateMovieDto)
        );

        assertEquals(testUpdateMovieDto.getId().toString(), exception.getIdentifier());
        assertEquals(ResourceType.MOVIE, exception.getResourceType());
        assertEquals(ResourceIdentifierType.ID, exception.getIdentifierType());

        verify(sanitizerService, times(1)).sanitizeUpdateMovieDto(any(UpdateMovieDto.class));
        verify(movieRepository, times(1)).findById(testUpdateMovieDto.getId());
        verify(movieRepository, never()).save(any(Movie.class));
    }

    // --- deleteMovie ---
    @Test
    void deleteMovie_Success() {
        // Arrange
        when(movieRepository.findById(testMovie.getId())).thenReturn(Optional.of(testMovie));
        doNothing().when(movieRepository).delete(testMovie);

        // Act
        movieService.deleteMovie(testMovie.getId());

        // Assert
        verify(movieRepository, times(1)).findById(testMovie.getId());
        verify(movieRepository, times(1)).delete(testMovie);
    }

    @Test
    void deleteMovie_NotFound() {
        // Arrange
        when(movieRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () ->
                movieService.deleteMovie(999L)
        );

        assertEquals("999", exception.getIdentifier());
        assertEquals(ResourceType.MOVIE, exception.getResourceType());
        assertEquals(ResourceIdentifierType.ID, exception.getIdentifierType());

        verify(movieRepository, times(1)).findById(999L);
        verify(movieRepository, never()).delete(any(Movie.class));
    }

    // --- deleteMovies ---
    @Test
    void deleteMovies_Success() {
        // Arrange
        List<Long> movieIdsToDelete = Arrays.asList(1L, 2L, 3L);
        doNothing().when(movieRepository).deleteAllById(movieIdsToDelete);

        // Act
        movieService.deleteMovies(movieIdsToDelete);

        // Assert
        verify(movieRepository, times(1)).deleteAllById(movieIdsToDelete);
    }

    @Test
    void deleteMovies_EmptyList() {
        // Arrange
        List<Long> movieIdsToDelete = Collections.emptyList();

        // Act
        movieService.deleteMovies(movieIdsToDelete);

        // Assert
        verify(movieRepository, never()).deleteAllById(anyList());
    }

    @Test
    void deleteMovies_NullList() {
        // Arrange
        List<Long> movieIdsToDelete = null;

        // Act
        movieService.deleteMovies(movieIdsToDelete);

        // Assert
        verify(movieRepository, never()).deleteAllById(anyList());
    }
}