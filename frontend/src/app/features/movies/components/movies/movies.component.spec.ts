import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { MoviesComponent } from "./movies.component";
import { MovieService } from "../../services/movie.service";
import { AuthService } from "../../../../core/auth/service/auth.service";
import { ToastManagerService } from "../../../../shared/common/services/toast-manager.service";
import { of, Subject, throwError, Subscription } from "rxjs";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { RouterModule } from "@angular/router";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { PaginatedResults, SearchParams, MovieFilters } from "../../../../shared/models/Search";
import { MovieSearchDto, MovieStatus } from "../../models/Movie";
import { UserDataDto, UserSettings, StatsTimePeriodOption } from "../../../../core/auth/models/User";
import { ToastType } from "../../../../shared/models/UI";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";

describe("MoviesComponent", () => {
    let component: MoviesComponent;
    let fixture: ComponentFixture<MoviesComponent>;
    let mockMovieService: jasmine.SpyObj<MovieService>;
    let mockAuthService: jasmine.SpyObj<AuthService>;
    let mockToastManagerService: jasmine.SpyObj<ToastManagerService>;

    let currentUserSubject: Subject<UserDataDto | null>;

    const mockPaginatedMovies: PaginatedResults<MovieSearchDto> = {
        results: [
            { 
                id: 1, userId: 101, tmdbId: 1001, title: "Movie A", 
                createdAt: new Date("2023-01-01T10:00:00Z"), updatedAt: new Date("2023-01-01T10:00:00Z"),
                releaseYear: 2020, posterUrl: "urlA",
                status: MovieStatus.WATCHED, userRating: 8.0, watchedDates: [new Date("2023-01-15T10:00:00Z")]
            },
            { 
                id: 2, userId: 101, tmdbId: 1002, title: "Movie B", 
                createdAt: new Date("2023-02-01T10:00:00Z"), updatedAt: new Date("2023-02-01T10:00:00Z"),
                releaseYear: 2021, posterUrl: "urlB",
                status: MovieStatus.WATCHLIST, userRating: undefined, watchedDates: []
            }
        ],
        totalCount: 2
    };

    const mockUserData: UserDataDto = {
        id: 123,
        cognitoUserId: "cognito-abc",
        email: "test@example.com",
        displayName: "Test User",
        createdAt: new Date("2023-01-01T10:00:00Z"),
        updatedAt: new Date("2023-01-01T10:00:00Z"),
        userSettings: {
            appTheme: "light",
            confirmDeletions: true,
            defaultMovieSortBy: "title",
            moviesPerRow: 5,
            defaultStatsTimePeriod: StatsTimePeriodOption.LAST_YEAR
        },
    };

    beforeEach(async () => {
        currentUserSubject = new Subject<UserDataDto | null>();

        mockMovieService = jasmine.createSpyObj("MovieService", ["searchMovies", "deleteMovies"]);
        mockAuthService = jasmine.createSpyObj("AuthService", ["currentUser$"], { currentUser$: currentUserSubject.asObservable() });
        mockToastManagerService = jasmine.createSpyObj("ToastManagerService", ["addToast"]);

        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                FontAwesomeModule,
                RouterModule.forRoot([]),
                MoviesComponent
            ],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: MovieService, useValue: mockMovieService },
                { provide: AuthService, useValue: mockAuthService },
                { provide: ToastManagerService, useValue: mockToastManagerService },
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MoviesComponent);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        currentUserSubject.complete(); 
    });

    it("should create the component", () => {
        expect(component).toBeTruthy();
    });

    it("should subscribe to currentUser$ on ngOnInit and set userId and userSettings", fakeAsync(() => {
        mockMovieService.searchMovies.and.returnValue(of(mockPaginatedMovies));
        
        fixture.detectChanges();

        expect(component.userId).toBeUndefined();
        expect(component.userSettings).toBeUndefined();
        expect(mockMovieService.searchMovies).not.toHaveBeenCalled();

        currentUserSubject.next(mockUserData);
        tick();

        expect(component.userId).toBe(mockUserData.id);
        expect(component.userSettings).toEqual(mockUserData.userSettings);
        expect(component.searchParams.sortBy).toBe(mockUserData.userSettings.defaultMovieSortBy);
        expect(mockMovieService.searchMovies).toHaveBeenCalledTimes(1);
    }));

    it("should call searchMovies if userId is available on ngOnInit", fakeAsync(() => {
        mockMovieService.searchMovies.and.returnValue(of(mockPaginatedMovies));
        
        fixture.detectChanges();
        currentUserSubject.next(mockUserData);
        tick();

        expect(component.userId).toBe(mockUserData.id);
        expect(mockMovieService.searchMovies).toHaveBeenCalledWith(
            mockUserData.id,
            component.searchParams,
            component.movieFilters
        );
        expect(component.movies).toEqual(mockPaginatedMovies);
        expect(component.isLoading).toBeFalse();
    }));

    it("should not call searchMovies if userId is null on ngOnInit", fakeAsync(() => {
        mockMovieService.searchMovies.and.returnValue(of(mockPaginatedMovies));
        
        fixture.detectChanges();
        currentUserSubject.next(null);
        tick();

        expect(component.userId).toBeUndefined(); 
        expect(mockMovieService.searchMovies).not.toHaveBeenCalled();
    }));

    it("should handle error when getting current user", fakeAsync(() => {
        spyOn(console, "error");
        mockMovieService.searchMovies.and.returnValue(of(mockPaginatedMovies));
        
        fixture.detectChanges();
        currentUserSubject.error("Auth Error");
        tick();

        expect(console.error).toHaveBeenCalledWith("Error getting current user: ", "Auth Error");
        expect(component.userId).toBeUndefined();
        expect(mockMovieService.searchMovies).not.toHaveBeenCalled();
    }));

    it("should set default sort by from user settings if available", fakeAsync(() => {
        const userWithCustomSettings: UserDataDto = {
            ...mockUserData,
            userSettings: { ...mockUserData.userSettings, defaultMovieSortBy: "releaseYear", moviesPerRow: 10 }
        };
        mockMovieService.searchMovies.and.returnValue(of(mockPaginatedMovies));

        fixture.detectChanges();
        currentUserSubject.next(userWithCustomSettings);
        tick();

        expect(component.searchParams.sortBy).toBe("releaseYear");
    }));

    it("should not change default sort by if user settings are null/undefined", fakeAsync(() => {
        const userWithoutSettings: UserDataDto = { ...mockUserData, userSettings: undefined as any };
        mockMovieService.searchMovies.and.returnValue(of(mockPaginatedMovies));

        fixture.detectChanges();
        currentUserSubject.next(userWithoutSettings);
        tick();

        expect(component.searchParams.sortBy).toBe("watchedDate"); 
    }));


    it("should call movieService.searchMovies, set isLoading, and update movies data", fakeAsync(() => {
        // Arrange
        mockMovieService.searchMovies.and.returnValue(of(mockPaginatedMovies));
        component.userId = mockUserData.id;

        // Act
        component.searchMovies();
        // Assert isLoading is true immediately after calling the method (synchronous part)
        expect(component.isLoading).toBeTrue(); 
        
        tick(); // Flush the asynchronous observable completion

        // Assert after async operation
        expect(mockMovieService.searchMovies).toHaveBeenCalledWith(
            component.userId,
            component.searchParams,
            component.movieFilters
        );
        expect(component.movies).toEqual(mockPaginatedMovies);
        expect(component.isLoading).toBeFalse();
    }));

    it("should handle error during movie search", fakeAsync(() => {
        // Arrange
        const errorResponse = new Error("Search failed");
        spyOn(console, "error");
        mockMovieService.searchMovies.and.returnValue(throwError(() => errorResponse));
        component.userId = mockUserData.id;

        // Act
        component.searchMovies();
        // Assert isLoading is true immediately after calling the method (synchronous part)
        expect(component.isLoading).toBeTrue(); 

        tick(); // Flush the asynchronous observable error

        // Assert after async operation
        expect(mockMovieService.searchMovies).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith("Error searching movies: ", errorResponse);
        expect(component.isLoading).toBeFalse();
        expect(component.movies).toBeUndefined();
    }));

    it("should not call searchMovies if userId is not set", () => {
        // Arrange
        component.userId = undefined;

        // Act
        component.searchMovies();

        // Assert
        expect(mockMovieService.searchMovies).not.toHaveBeenCalled();
        expect(component.isLoading).toBeFalse(); // Should be false as no API call was made
    });


    it("handleSortOptionsChange should reset page to 1", () => {
        // Arrange
        component.searchParams.page = 5;

        // Act
        component.handleSortOptionsChange();

        // Assert
        expect(component.searchParams.page).toBe(1);
    });

    it("handleMovieFiltersChange should update filters, reset page, and search movies", fakeAsync(() => {
        // Arrange
        mockMovieService.searchMovies.and.returnValue(of(mockPaginatedMovies));
        component.userId = mockUserData.id;
        const newFilters: MovieFilters = { genresIncluding: ["Action"] };

        // Act
        component.handleMovieFiltersChange(newFilters);
        
        tick(); // Flush the searchMovies call made inside the handler

        // Assert
        expect(component.movieFilters).toEqual(newFilters);
        expect(component.searchParams.page).toBe(1);
        expect(mockMovieService.searchMovies).toHaveBeenCalledTimes(1);
    }));

    it("handlePageChange should update page and search movies", fakeAsync(() => {
        // Arrange
        mockMovieService.searchMovies.and.returnValue(of(mockPaginatedMovies));
        component.userId = mockUserData.id;
        const newPage = 3;

        // Act
        component.handlePageChange(newPage);
        
        tick(); // Flush the searchMovies call made inside the handler

        // Assert
        expect(component.searchParams.page).toBe(newPage);
        expect(mockMovieService.searchMovies).toHaveBeenCalledTimes(1);
    }));

    it("should toggle delete mode and clear toBeDeletedMovieIds", () => {
        // Arrange
        component.isDeleteModeOn = false;
        component.toBeDeletedMovieIds = [1, 2];

        // Act
        component.toggleDeleteMode();
        // Assert after first toggle
        expect(component.isDeleteModeOn).toBeTrue();
        expect(component.toBeDeletedMovieIds).toEqual([]);

        // Act again
        component.toggleDeleteMode();
        // Assert after second toggle
        expect(component.isDeleteModeOn).toBeFalse();
        expect(component.toBeDeletedMovieIds).toEqual([]);
    });

    it("should add a movie ID to toBeDeletedMovieIds", () => {
        // Arrange
        component.toBeDeletedMovieIds = [];

        // Act
        component.handleNewDeleteMovieId(10);

        // Assert
        expect(component.toBeDeletedMovieIds).toEqual([10]);
    });

    it("should remove a movie ID from toBeDeletedMovieIds if already present", () => {
        // Arrange
        component.toBeDeletedMovieIds = [10, 20, 30];

        // Act
        component.handleNewDeleteMovieId(20);

        // Assert
        expect(component.toBeDeletedMovieIds).toEqual([10, 30]);
    });

    it("should clear toBeDeletedMovieIds and turn off delete mode", () => {
        // Arrange
        component.toBeDeletedMovieIds = [1, 2, 3];
        component.isDeleteModeOn = true;

        // Act
        component.clearDeleteMovieIds();

        // Assert
        expect(component.toBeDeletedMovieIds).toEqual([]);
        expect(component.isDeleteModeOn).toBeFalse();
    });

    it("should call movieService.deleteMovies, reset state, and show success toast on success", fakeAsync(() => {
        // Arrange
        mockMovieService.deleteMovies.and.returnValue(of(void 0));
        mockMovieService.searchMovies.and.returnValue(of(mockPaginatedMovies));
        component.isDeleteModeOn = true;
        component.toBeDeletedMovieIds = [1, 2];
        component.userId = mockUserData.id;

        // Act
        component.deleteMovies();
        // Assert isLoading is true immediately after calling the method (synchronous part)
        expect(component.isLoading).toBeTrue(); 

        tick(); // Flush the deleteMovies observable
        // Assert state after deleteMovies completes
        expect(component.isDeleteModeOn).toBeFalse();
        expect(component.toBeDeletedMovieIds).toEqual([]);
        expect(mockToastManagerService.addToast).toHaveBeenCalledWith({
            title: "Success",
            details: "Movies deleted successfully.",
            type: ToastType.SUCCESS
        });
        expect(component.searchParams.page).toBe(1);
        expect(mockMovieService.searchMovies).toHaveBeenCalledTimes(1);
        
        tick(); // Flush the searchMovies observable that happens after successful deletion
        // Assert isLoading after the re-search
        expect(component.isLoading).toBeFalse();
    }));

    it("should handle error during deleteMovies and show error toast", fakeAsync(() => {
        // Arrange
        const errorResponse = new Error("Delete failed");
        spyOn(console, "error");
        mockMovieService.deleteMovies.and.returnValue(throwError(() => errorResponse));
        component.isDeleteModeOn = true;
        component.toBeDeletedMovieIds = [1, 2];
        component.userId = mockUserData.id;

        // Act
        component.deleteMovies();
        // Assert isLoading is true immediately after calling the method (synchronous part)
        expect(component.isLoading).toBeTrue(); 

        tick(); // Flush the deleteMovies observable

        // Assert state after deleteMovies error
        expect(component.isDeleteModeOn).toBeTrue(); // State should not reset on error
        expect(component.toBeDeletedMovieIds).toEqual([1, 2]); // IDs should not clear on error
        expect(mockToastManagerService.addToast).toHaveBeenCalledWith({
            title: "Error",
            details: "An error occurred deleting the movies.",
            type: ToastType.ERROR
        });
        expect(console.error).toHaveBeenCalledWith("Error deleting movies: ", errorResponse);
        expect(mockMovieService.searchMovies).not.toHaveBeenCalled(); // Should not re-search on deletion error
        expect(component.isLoading).toBeFalse();
    }));

    it("should not call deleteMovies if delete mode is off or no movies are selected", () => {
        // Case 1: Delete mode off
        // Arrange
        component.isDeleteModeOn = false;
        component.toBeDeletedMovieIds = [1];
        // Act
        component.deleteMovies();
        // Assert
        expect(mockMovieService.deleteMovies).not.toHaveBeenCalled();
        expect(component.isLoading).toBeFalse();

        // Case 2: No movies selected
        // Arrange
        component.isDeleteModeOn = true;
        component.toBeDeletedMovieIds = [];
        // Act
        component.deleteMovies();
        // Assert
        expect(mockMovieService.deleteMovies).not.toHaveBeenCalled();
        expect(component.isLoading).toBeFalse();
    });

    it("should unsubscribe on ngOnDestroy", () => {
        // Arrange
        const unsubscribeSpy = spyOn(Subscription.prototype, "unsubscribe");
        mockMovieService.searchMovies.and.returnValue(of(mockPaginatedMovies));

        // Act
        fixture.detectChanges(); // ngOnInit triggers the subscription and reassignment of component.subscription
        currentUserSubject.next(mockUserData); // Ensure the subscription is active

        component.ngOnDestroy();

        // Assert
        expect(unsubscribeSpy).toHaveBeenCalled();
    });
});