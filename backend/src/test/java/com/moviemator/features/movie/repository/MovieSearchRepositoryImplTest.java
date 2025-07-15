package com.moviemator.features.movie.repository;

import com.moviemator.features.movie.model.Movie;
import com.moviemator.features.movie.model.MovieStatus;
import com.moviemator.shared.search.models.MovieFilters;
import com.moviemator.shared.search.models.PaginatedResults;
import com.moviemator.shared.search.models.SearchParams;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@Testcontainers
public class MovieSearchRepositoryImplTest {

    @TestConfiguration
    static class MovieSearchRepositoryImplTestConfiguration {
        @Bean
        public MovieSearchRepositoryImpl movieSearchRepository(EntityManager entityManager) {
            return new MovieSearchRepositoryImpl();
        }
    }

    @SuppressWarnings("resource")
    @Container
    public static PostgreSQLContainer<?> postgreSQLContainer = new PostgreSQLContainer<>("postgres:15-alpine")
            .withDatabaseName("testdb")
            .withUsername("testuser")
            .withPassword("testpass");

    @DynamicPropertySource
    static void setDatasourceProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgreSQLContainer::getJdbcUrl);
        registry.add("spring.datasource.username", postgreSQLContainer::getUsername);
        registry.add("spring.datasource.password", postgreSQLContainer::getPassword);
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create-drop");
        registry.add("spring.jpa.show-sql", () -> "true");
        registry.add("spring.jpa.properties.hibernate.format_sql", () -> "true");
        registry.add("spring.jpa.properties.hibernate.dialect", () -> "org.hibernate.dialect.PostgreSQLDialect");
    }

    @Autowired
    private MovieSearchRepositoryImpl movieSearchRepository;

    @Autowired
    private TestEntityManager entityManager;

    private final Long userId1 = 100L;
    private final Long userId2 = 101L;

    private Movie movie1, movie2, movie3, movie4, movie5;

    @BeforeEach
    void setUp() {
        entityManager.clear();
        entityManager.getEntityManager().createQuery("DELETE FROM Movie").executeUpdate();

        movie3 = new Movie();
        movie3.setUserId(userId1);
        movie3.setTmdbId(1003L);
        movie3.setTitle("Space Odyssey");
        movie3.setReleaseYear(2022);
        movie3.setPosterUrl("url3");
        movie3.setDirector("Alice Director");
        movie3.setPlotSummary("An epic journey through space.");
        movie3.setUserRating(9.0f);
        movie3.setUserReview("Mind-blowing!");
        movie3.setWatchedDate(null);
        movie3.setCreatedAt(LocalDateTime.of(2024, 3, 20, 12, 0, 10));
        movie3.setUpdatedAt(LocalDateTime.of(2024, 3, 20, 12, 0, 10));
        movie3.setStatus(MovieStatus.WATCHLIST);
        movie3.setRuntimeMinutes(150);
        movie3.setGenres(Arrays.asList("Sci-Fi", "Drama"));
        movie3.setActors(Arrays.asList("Actor E", "Actor F"));
        entityManager.persist(movie3);

        movie2 = new Movie();
        movie2.setUserId(userId1);
        movie2.setTmdbId(1002L);
        movie2.setTitle("Mystery of the Old House");
        movie2.setReleaseYear(2018);
        movie2.setPosterUrl("url2");
        movie2.setDirector("Bob Director");
        movie2.setPlotSummary("A spooky mystery.");
        movie2.setUserRating(7.2f);
        movie2.setUserReview("Good, but a bit slow.");
        movie2.setWatchedDate(LocalDate.of(2023, 2, 10));
        movie2.setCreatedAt(LocalDateTime.of(2023, 1, 5, 11, 0, 0));
        movie2.setUpdatedAt(LocalDateTime.of(2023, 1, 5, 11, 0, 0));
        movie2.setStatus(MovieStatus.WATCHED);
        movie2.setRuntimeMinutes(95);
        movie2.setGenres(Arrays.asList("Mystery", "Thriller"));
        movie2.setActors(Arrays.asList("Actor C", "Actor D"));
        entityManager.persist(movie2);

        movie1 = new Movie();
        movie1.setUserId(userId1);
        movie1.setTmdbId(1001L);
        movie1.setTitle("The Great Adventure");
        movie1.setReleaseYear(2020);
        movie1.setPosterUrl("url1");
        movie1.setDirector("Alice Director");
        movie1.setPlotSummary("A thrilling adventure.");
        movie1.setUserRating(8.5f);
        movie1.setUserReview("Excellent!");
        movie1.setWatchedDate(LocalDate.of(2023, 1, 15));
        movie1.setCreatedAt(LocalDateTime.of(2023, 1, 1, 10, 0, 0));
        movie1.setUpdatedAt(LocalDateTime.of(2023, 1, 1, 10, 0, 0));
        movie1.setStatus(MovieStatus.WATCHED);
        movie1.setRuntimeMinutes(120);
        movie1.setGenres(Arrays.asList("Action", "Adventure"));
        movie1.setActors(Arrays.asList("Actor A", "Actor B"));
        entityManager.persist(movie1);

        movie5 = new Movie();
        movie5.setUserId(userId1);
        movie5.setTmdbId(1005L);
        movie5.setTitle("Action Packed Finale");
        movie5.setReleaseYear(2021);
        movie5.setPosterUrl("url5");
        movie5.setDirector("David Director");
        movie5.setPlotSummary("Explosions and car chases.");
        movie5.setUserRating(6.5f);
        movie5.setUserReview("A bit too much action.");
        movie5.setWatchedDate(LocalDate.of(2022, 11, 20));
        movie5.setCreatedAt(LocalDateTime.of(2022, 10, 1, 14, 0, 0));
        movie5.setUpdatedAt(LocalDateTime.of(2022, 10, 1, 14, 0, 0));
        movie5.setStatus(MovieStatus.WATCHED);
        movie5.setRuntimeMinutes(130);
        movie5.setGenres(Arrays.asList("Action", "Comedy"));
        movie5.setActors(Arrays.asList("Actor A", "Actor E"));
        entityManager.persist(movie5);

        movie4 = new Movie();
        movie4.setUserId(userId2);
        movie4.setTmdbId(1004L);
        movie4.setTitle("The Quiet Place");
        movie4.setReleaseYear(2019);
        movie4.setPosterUrl("url4");
        movie4.setDirector("Charlie Director");
        movie4.setPlotSummary("A suspenseful thriller.");
        movie4.setUserRating(8.0f);
        movie4.setUserReview("Very tense!");
        movie4.setWatchedDate(LocalDate.of(2024, 1, 1));
        movie4.setCreatedAt(LocalDateTime.of(2024, 1, 1, 9, 0, 0));
        movie4.setUpdatedAt(LocalDateTime.of(2024, 1, 1, 9, 0, 0));
        movie4.setStatus(MovieStatus.WATCHED);
        movie4.setRuntimeMinutes(100);
        movie4.setGenres(Arrays.asList("Horror", "Thriller"));
        movie4.setActors(Arrays.asList("Actor G", "Actor H"));
        entityManager.persist(movie4);

        entityManager.flush();
        entityManager.clear();
    }

    // --- searchMovies ---
    @Test
    @DisplayName("Should return all movies for a specific user with default sorting")
    void searchMovies_DefaultSortingAndPagination() {
        // Arrange
        SearchParams searchParams = new SearchParams("", null, null, 1, 10);
        MovieFilters movieFilters = new MovieFilters();

        // Act
        PaginatedResults<Movie> results = movieSearchRepository.searchMovies(userId1, searchParams, movieFilters);

        // Assert
        assertNotNull(results);
        assertEquals(4, results.getTotalCount());
        assertEquals(4, results.getResults().size());

        assertEquals(movie3.getTitle(), results.getResults().get(0).getTitle());
        assertEquals(movie2.getTitle(), results.getResults().get(1).getTitle());
        assertEquals(movie1.getTitle(), results.getResults().get(2).getTitle());
        assertEquals(movie5.getTitle(), results.getResults().get(3).getTitle());
    }

    @Test
    @DisplayName("Should return movies filtered by search text in title")
    void searchMovies_FilterBySearchText() {
        // Arrange
        SearchParams searchParams = new SearchParams("adventure", null, null, 1, 10);
        MovieFilters movieFilters = new MovieFilters();

        // Act
        PaginatedResults<Movie> results = movieSearchRepository.searchMovies(userId1, searchParams, movieFilters);

        // Assert
        assertNotNull(results);
        assertEquals(1, results.getTotalCount());
        assertEquals(1, results.getResults().size());
        assertEquals(movie1.getTitle(), results.getResults().getFirst().getTitle());
    }

    @Test
    @DisplayName("Should return movies filtered by director")
    void searchMovies_FilterByDirector() {
        // Arrange
        SearchParams searchParams = new SearchParams("", null, null, 1, 10);
        MovieFilters movieFilters = new MovieFilters();
        movieFilters.setDirector("Alice");

        // Act
        PaginatedResults<Movie> results = movieSearchRepository.searchMovies(userId1, searchParams, movieFilters);

        // Assert
        assertNotNull(results);
        assertEquals(2, results.getTotalCount());
        assertEquals(2, results.getResults().size());
        assertTrue(results.getResults().stream().anyMatch(m -> m.getTitle().equals(movie1.getTitle())));
        assertTrue(results.getResults().stream().anyMatch(m -> m.getTitle().equals(movie3.getTitle())));
    }

    @Test
    @DisplayName("Should return movies filtered by release year range")
    void searchMovies_FilterByReleaseYearRange() {
        // Arrange
        SearchParams searchParams = new SearchParams("", null, null, 1, 10);
        MovieFilters movieFilters = new MovieFilters();
        movieFilters.setReleaseYearFrom(2019);
        movieFilters.setReleaseYearTo(2021);

        // Act
        PaginatedResults<Movie> results = movieSearchRepository.searchMovies(userId1, searchParams, movieFilters);

        // Assert
        assertNotNull(results);
        assertEquals(2, results.getTotalCount());
        assertEquals(2, results.getResults().size());
        assertTrue(results.getResults().stream().anyMatch(m -> m.getTitle().equals(movie1.getTitle())));
        assertTrue(results.getResults().stream().anyMatch(m -> m.getTitle().equals(movie5.getTitle())));
    }

    @Test
    @DisplayName("Should return movies filtered by user rating range")
    void searchMovies_FilterByUserRatingRange() {
        // Arrange
        SearchParams searchParams = new SearchParams("", null, null, 1, 10);
        MovieFilters movieFilters = new MovieFilters();
        movieFilters.setUserRatingFrom(8.0f);
        movieFilters.setUserRatingTo(9.0f);

        // Act
        PaginatedResults<Movie> results = movieSearchRepository.searchMovies(userId1, searchParams, movieFilters);

        // Assert
        assertNotNull(results);
        assertEquals(2, results.getTotalCount());
        assertEquals(2, results.getResults().size());
        assertTrue(results.getResults().stream().anyMatch(m -> m.getTitle().equals(movie1.getTitle())));
        assertTrue(results.getResults().stream().anyMatch(m -> m.getTitle().equals(movie3.getTitle())));
    }

    @Test
    @DisplayName("Should return movies filtered by watched date range")
    void searchMovies_FilterByWatchedDateRange() {
        // Arrange
        SearchParams searchParams = new SearchParams("", null, null, 1, 10);
        MovieFilters movieFilters = new MovieFilters();
        movieFilters.setWatchedDateFrom(LocalDate.of(2023, 2, 1));
        movieFilters.setWatchedDateTo(LocalDate.of(2023, 2, 28));

        // Act
        PaginatedResults<Movie> results = movieSearchRepository.searchMovies(userId1, searchParams, movieFilters);

        // Assert
        assertNotNull(results);
        assertEquals(1, results.getTotalCount());
        assertEquals(1, results.getResults().size());
        assertEquals(movie2.getTitle(), results.getResults().getFirst().getTitle());
    }

    @Test
    @DisplayName("Should return movies filtered by status (WATCHED)")
    void searchMovies_FilterByStatusWatched() {
        // Arrange
        SearchParams searchParams = new SearchParams("", null, null, 1, 10);
        MovieFilters movieFilters = new MovieFilters();
        movieFilters.setStatus(MovieStatus.WATCHED);

        // Act
        PaginatedResults<Movie> results = movieSearchRepository.searchMovies(userId1, searchParams, movieFilters);

        // Assert
        assertNotNull(results);
        assertEquals(3, results.getTotalCount());
        assertEquals(3, results.getResults().size());
        assertTrue(results.getResults().stream().anyMatch(m -> m.getTitle().equals(movie1.getTitle())));
        assertTrue(results.getResults().stream().anyMatch(m -> m.getTitle().equals(movie2.getTitle())));
        assertTrue(results.getResults().stream().anyMatch(m -> m.getTitle().equals(movie5.getTitle())));
        assertFalse(results.getResults().stream().anyMatch(m -> m.getTitle().equals(movie3.getTitle())));
    }

    @Test
    @DisplayName("Should return movies filtered by status (WATCHLIST)")
    void searchMovies_FilterByStatusWatchlist() {
        // Arrange
        SearchParams searchParams = new SearchParams("", null, null, 1, 10);
        MovieFilters movieFilters = new MovieFilters();
        movieFilters.setStatus(MovieStatus.WATCHLIST);

        // Act
        PaginatedResults<Movie> results = movieSearchRepository.searchMovies(userId1, searchParams, movieFilters);

        // Assert
        assertNotNull(results);
        assertEquals(1, results.getTotalCount());
        assertEquals(1, results.getResults().size());
        assertEquals(movie3.getTitle(), results.getResults().getFirst().getTitle());
    }

    @Test
    @DisplayName("Should return movies filtered by runtime minutes (less than)")
    void searchMovies_FilterByRuntimeMinutesLessThan() {
        // Arrange
        SearchParams searchParams = new SearchParams("", null, null, 1, 10);
        MovieFilters movieFilters = new MovieFilters();
        movieFilters.setRuntimeMinutesLessThan(100);

        // Act
        PaginatedResults<Movie> results = movieSearchRepository.searchMovies(userId1, searchParams, movieFilters);

        // Assert
        assertNotNull(results);
        assertEquals(1, results.getTotalCount());
        assertEquals(1, results.getResults().size());
        assertEquals(movie2.getTitle(), results.getResults().getFirst().getTitle());
    }

    @Test
    @DisplayName("Should return movies filtered by runtime minutes (more than)")
    void searchMovies_FilterByRuntimeMinutesMoreThan() {
        // Arrange
        SearchParams searchParams = new SearchParams("", null, null, 1, 10);
        MovieFilters movieFilters = new MovieFilters();
        movieFilters.setRuntimeMinutesMoreThan(130);

        // Act
        PaginatedResults<Movie> results = movieSearchRepository.searchMovies(userId1, searchParams, movieFilters);

        // Assert
        assertNotNull(results);
        assertEquals(2, results.getTotalCount());
        assertEquals(2, results.getResults().size());
        assertTrue(results.getResults().stream().anyMatch(m -> m.getTitle().equals(movie3.getTitle())));
        assertTrue(results.getResults().stream().anyMatch(m -> m.getTitle().equals(movie5.getTitle())));
    }

    @Test
    @DisplayName("Should return movies with multiple filters applied")
    void searchMovies_MultipleFilters() {
        // Arrange
        SearchParams searchParams = new SearchParams("mystery", null, null, 1, 10);
        MovieFilters movieFilters = new MovieFilters();
        movieFilters.setReleaseYearTo(2019);
        movieFilters.setUserRatingFrom(7.0f);
        movieFilters.setStatus(MovieStatus.WATCHED);

        // Act
        PaginatedResults<Movie> results = movieSearchRepository.searchMovies(userId1, searchParams, movieFilters);

        // Assert
        assertNotNull(results);
        assertEquals(1, results.getTotalCount());
        assertEquals(1, results.getResults().size());
        assertEquals(movie2.getTitle(), results.getResults().getFirst().getTitle());
    }

    @Test
    @DisplayName("Should handle pagination correctly for first page")
    void searchMovies_PaginationFirstPage() {
        // Arrange
        SearchParams searchParams = new SearchParams("", "createdAt", false, 1, 2);
        MovieFilters movieFilters = new MovieFilters();

        // Act
        PaginatedResults<Movie> results = movieSearchRepository.searchMovies(userId1, searchParams, movieFilters);

        // Assert
        assertNotNull(results);
        assertEquals(4, results.getTotalCount());
        assertEquals(2, results.getResults().size());
        assertEquals(movie3.getTitle(), results.getResults().get(0).getTitle());
        assertEquals(movie2.getTitle(), results.getResults().get(1).getTitle());
    }

    @Test
    @DisplayName("Should handle pagination correctly for second page")
    void searchMovies_PaginationSecondPage() {
        // Arrange
        SearchParams searchParams = new SearchParams("", "createdAt", false, 2, 2);
        MovieFilters movieFilters = new MovieFilters();

        // Act
        PaginatedResults<Movie> results = movieSearchRepository.searchMovies(userId1, searchParams, movieFilters);

        // Assert
        assertNotNull(results);
        assertEquals(4, results.getTotalCount());
        assertEquals(2, results.getResults().size());
        assertEquals(movie1.getTitle(), results.getResults().get(0).getTitle());
        assertEquals(movie5.getTitle(), results.getResults().get(1).getTitle());
    }

    @Test
    @DisplayName("Should return empty results if no movies match filters")
    void searchMovies_NoMatchingResults() {
        // Arrange
        SearchParams searchParams = new SearchParams("nonexistent", null, null, 1, 10);
        MovieFilters movieFilters = new MovieFilters();

        // Act
        PaginatedResults<Movie> results = movieSearchRepository.searchMovies(userId1, searchParams, movieFilters);

        // Assert
        assertNotNull(results);
        assertTrue(results.getResults().isEmpty());
        assertEquals(0, results.getTotalCount());
    }

    // --- searchMovies ---
    @Test
    @DisplayName("Should return movies sorted by title ascending")
    void searchMovies_SortByTitleAscending() {
        // Arrange
        SearchParams searchParams = new SearchParams("", "title", true, 1, 10);
        MovieFilters movieFilters = new MovieFilters();

        // Act
        PaginatedResults<Movie> results = movieSearchRepository.searchMovies(userId1, searchParams, movieFilters);

        // Assert
        assertNotNull(results);
        assertEquals(4, results.getTotalCount());
        assertEquals(4, results.getResults().size());
        assertEquals(movie5.getTitle(), results.getResults().get(0).getTitle());
        assertEquals(movie2.getTitle(), results.getResults().get(1).getTitle());
        assertEquals(movie3.getTitle(), results.getResults().get(2).getTitle());
        assertEquals(movie1.getTitle(), results.getResults().get(3).getTitle());
    }

    @Test
    @DisplayName("Should return movies sorted by releaseYear descending")
    void searchMovies_SortByReleaseYearDescending() {
        // Arrange
        SearchParams searchParams = new SearchParams("", "releaseYear", false, 1, 10);
        MovieFilters movieFilters = new MovieFilters();

        // Act
        PaginatedResults<Movie> results = movieSearchRepository.searchMovies(userId1, searchParams, movieFilters);

        // Assert
        assertNotNull(results);
        assertEquals(4, results.getTotalCount());
        assertEquals(4, results.getResults().size());
        assertEquals(movie3.getTitle(), results.getResults().get(0).getTitle());
        assertEquals(movie5.getTitle(), results.getResults().get(1).getTitle());
        assertEquals(movie1.getTitle(), results.getResults().get(2).getTitle());
        assertEquals(movie2.getTitle(), results.getResults().get(3).getTitle());
    }

    @Test
    @DisplayName("Should return movies filtered by runtime minutes (both less and more than)")
    void searchMovies_FilterByRuntimeMinutesBothLessAndMoreThan() {
        // Arrange
        SearchParams searchParams = new SearchParams("", null, null, 1, 10);
        MovieFilters movieFilters = new MovieFilters();
        movieFilters.setRuntimeMinutesMoreThan(100);
        movieFilters.setRuntimeMinutesLessThan(140);

        // Act
        PaginatedResults<Movie> results = movieSearchRepository.searchMovies(userId1, searchParams, movieFilters);

        // Assert
        assertNotNull(results);
        assertEquals(2, results.getTotalCount());
        assertEquals(2, results.getResults().size());
        assertTrue(results.getResults().stream().anyMatch(m -> m.getTitle().equals(movie1.getTitle())));
        assertTrue(results.getResults().stream().anyMatch(m -> m.getTitle().equals(movie5.getTitle())));
    }

    @Test
    @DisplayName("Should return movies filtered by genres including (single genre)")
    void searchMovies_FilterByGenresIncludingSingle() {
        // Arrange
        SearchParams searchParams = new SearchParams("", null, null, 1, 10);
        MovieFilters movieFilters = new MovieFilters();
        movieFilters.setGenresIncluding(List.of("Adventure"));

        // Act
        PaginatedResults<Movie> results = movieSearchRepository.searchMovies(userId1, searchParams, movieFilters);

        // Assert
        assertNotNull(results);
        assertEquals(1, results.getTotalCount());
        assertEquals(1, results.getResults().size());
        assertEquals(movie1.getTitle(), results.getResults().getFirst().getTitle());
    }

    @Test
    @DisplayName("Should return movies filtered by genres including (multiple genres, AND logic)")
    void searchMovies_FilterByGenresIncludingMultiple() {
        // Arrange
        SearchParams searchParams = new SearchParams("", null, null, 1, 10);
        MovieFilters movieFilters = new MovieFilters();
        movieFilters.setGenresIncluding(List.of("Sci-Fi", "Drama"));

        // Act
        PaginatedResults<Movie> results = movieSearchRepository.searchMovies(userId1, searchParams, movieFilters);

        // Assert
        assertNotNull(results);
        assertEquals(1, results.getTotalCount());
        assertEquals(1, results.getResults().size());
        assertTrue(results.getResults().stream().anyMatch(m -> m.getTitle().equals(movie3.getTitle())));
    }


    @Test
    @DisplayName("Should return movies filtered by actors including (single actor)")
    void searchMovies_FilterByActorsIncludingSingle() {
        // Arrange
        SearchParams searchParams = new SearchParams("", null, null, 1, 10);
        MovieFilters movieFilters = new MovieFilters();
        movieFilters.setActorsIncluding(List.of("Actor A"));

        // Act
        PaginatedResults<Movie> results = movieSearchRepository.searchMovies(userId1, searchParams, movieFilters);

        // Assert
        assertNotNull(results);
        assertEquals(2, results.getTotalCount()); 
        assertEquals(2, results.getResults().size());
        assertTrue(results.getResults().stream().anyMatch(m -> m.getTitle().equals(movie1.getTitle())));
        assertTrue(results.getResults().stream().anyMatch(m -> m.getTitle().equals(movie5.getTitle())));
    }

    @Test
    @DisplayName("Should return movies filtered by actors including (multiple actors, AND logic)")
    void searchMovies_FilterByActorsIncludingMultiple() {
        // Arrange
        SearchParams searchParams = new SearchParams("", null, null, 1, 10);
        MovieFilters movieFilters = new MovieFilters();
        movieFilters.setActorsIncluding(List.of("Actor A", "Actor E"));

        // Act
        PaginatedResults<Movie> results = movieSearchRepository.searchMovies(userId1, searchParams, movieFilters);

        // Assert
        assertNotNull(results);
        assertEquals(1, results.getTotalCount());
        assertEquals(1, results.getResults().size());
        assertEquals(movie5.getTitle(), results.getResults().getFirst().getTitle());
    }

    @Test
    @DisplayName("Should return empty results if JSONB filter matches no movies")
    void searchMovies_JsonbFilterNoMatch() {
        // Arrange
        SearchParams searchParams = new SearchParams("", null, null, 1, 10);
        MovieFilters movieFilters = new MovieFilters();
        movieFilters.setActorsIncluding(List.of("Nonexistent Actor"));

        // Act
        PaginatedResults<Movie> results = movieSearchRepository.searchMovies(userId1, searchParams, movieFilters);

        // Assert
        assertNotNull(results);
        assertTrue(results.getResults().isEmpty());
        assertEquals(0, results.getTotalCount());
    }
}