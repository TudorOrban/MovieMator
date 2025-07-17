import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MovieComponent } from "./movie.component";
import { MovieService } from "../../services/movie.service";
import { ActivatedRoute, convertToParamMap } from "@angular/router";
import { of, Subject, throwError } from "rxjs";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { RouterModule } from "@angular/router";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MovieDataDto, MovieStatus } from "../../models/Movie";
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing"; 

describe("MovieComponent", () => {
    let component: MovieComponent;
    let fixture: ComponentFixture<MovieComponent>;
    let mockMovieService: jasmine.SpyObj<MovieService>;
    let mockActivatedRoute: any;
    let httpTestingController: HttpTestingController;

    const mockMovie: MovieDataDto = {
        id: 1,
        userId: 101,
        tmdbId: 550,
        title: "Test Movie",
        releaseYear: 2023,
        director: "Test Director",
        posterUrl: "http://example.com/poster.jpg",
        runtimeMinutes: 120,
        status: MovieStatus.WATCHED,
        genres: ["Action", "Sci-Fi"],
        actors: ["Actor One", "Actor Two"],
        userRating: 8.5,
        watchedDates: [new Date("2023-01-15T10:00:00Z")],
        plotSummary: "A test plot summary.",
        userReview: "A great test movie.",
        createdAt: new Date("2023-01-01T10:00:00Z"),
        updatedAt: new Date("2023-01-02T10:00:00Z"),
    };

    beforeEach(async () => {
        mockMovieService = jasmine.createSpyObj("MovieService", ["getMovieById"]);
        
        mockActivatedRoute = {
            paramMap: of(convertToParamMap({ movieId: "1" })),
        };

        await TestBed.configureTestingModule({
            imports: [
                MovieComponent,
                CommonModule, 
                FontAwesomeModule, 
                RouterModule.forRoot([])
            ],
            providers: [
                provideHttpClient(), 
                provideHttpClientTesting(),
                { provide: MovieService, useValue: mockMovieService },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MovieComponent);
        component = fixture.componentInstance;
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify(); 
    });

    it("should create the component", () => {
        expect(component).toBeTruthy();
    });

    it("should set isLoading to true on loadMovie call and then false on successful fetch", () => {
        // Arrange
        mockMovieService.getMovieById.and.returnValue(of(mockMovie));

        // Act
        fixture.detectChanges();

        // Assert
        expect(component.isLoading).toBeFalse();
        expect(component.movie).toEqual(mockMovie);
        expect(mockMovieService.getMovieById).toHaveBeenCalledWith(1);
    });

    it("should display loading spinner when isLoading is true", () => {
        // Arrange
        const movieSubject = new Subject<MovieDataDto>();
        mockMovieService.getMovieById.and.returnValue(movieSubject.asObservable());

        // Act
        fixture.detectChanges();

        // Assert
        expect(component.isLoading).toBeTrue();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector(".fa-spinner")).toBeTruthy();
        expect(compiled.querySelector(".movie-card")).toBeTruthy();
        expect(compiled.querySelector(".movie-title")).toBeNull();

        movieSubject.complete();
    });

    it("should display movie details after successful data fetch", () => {
        // Arrange
        mockMovieService.getMovieById.and.returnValue(of(mockMovie));

        // Act
        fixture.detectChanges();

        // Assert
        expect(component.isLoading).toBeFalse();
        expect(component.movie).toEqual(mockMovie);

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector(".movie-title")?.textContent).toContain(mockMovie.title);
        expect(compiled.querySelector(".movie-label")?.textContent).toContain(String(mockMovie.releaseYear));
        expect(compiled.querySelector(".movie-label")?.textContent).toContain(mockMovie.director);
        expect(compiled.querySelector("img")?.getAttribute("src")).toBe(mockMovie.posterUrl);
        expect(compiled.querySelector(".bg-green-100")?.textContent?.trim()).toBe("Watched"); 
        expect(compiled.textContent).toContain(`${mockMovie.runtimeMinutes} minutes`);
        expect(compiled.textContent).toContain("Action");
        expect(compiled.textContent).toContain("Actor One");
        expect(compiled.textContent).toContain(`${mockMovie.userRating?.toFixed(1)} / 10`);
        expect(compiled.textContent).toContain("Jan 15, 2023"); 
        expect(compiled.textContent).toContain(mockMovie.plotSummary as string);
        expect(compiled.textContent).toContain(mockMovie.userReview as string);
        expect(compiled.textContent).toContain("Added: Jan 1, 2023, 10:00:00 AM");
        expect(compiled.textContent).toContain("Last Updated: Jan 2, 2023, 10:00:00 AM");
    });

    it("should display \"The movie could not be found.\" when movie is null and not loading", () => {
        // Arrange
        mockMovieService.getMovieById.and.returnValue(of(null as unknown as MovieDataDto));
        
        // Act
        fixture.detectChanges();

        // Assert
        expect(component.isLoading).toBeFalse();
        expect(component.movie).toBeNull();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain("The movie could not be found.");
        expect(compiled.querySelector(".fa-spinner")).toBeNull();
    });

    it("should handle error during movie fetch", () => {
        // Arrange
        const errorResponse = new Error("Failed to fetch movie");
        spyOn(console, "error");
        mockMovieService.getMovieById.and.returnValue(throwError(() => errorResponse));

        // Act
        fixture.detectChanges();

        // Assert
        expect(component.isLoading).toBeFalse();
        expect(component.movie).toBeUndefined();
        expect(console.error).toHaveBeenCalledWith("Error occurred fetching movie: ", errorResponse);
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain("The movie could not be found."); 
        expect(compiled.querySelector(".fa-spinner")).toBeNull();
    });

    it("should display \"N/A\" for missing runtime", () => {
        // Arrange
        const movieWithoutRuntime = { ...mockMovie, runtimeMinutes: undefined };
        mockMovieService.getMovieById.and.returnValue(of(movieWithoutRuntime));

        // Act
        fixture.detectChanges();

        // Assert
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain("Runtime:");
        expect(compiled.textContent).toContain("N/A");
    });

    it("should display \"No genres listed.\" for empty genres array", () => {
        // Arrange
        const movieWithEmptyGenres = { ...mockMovie, genres: [] };
        mockMovieService.getMovieById.and.returnValue(of(movieWithEmptyGenres));

        // Act
        fixture.detectChanges();

        // Assert
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain("Genres:");
        expect(compiled.textContent).toContain("No genres listed.");
    });

    it("should display \"Not rated.\" for missing user rating", () => {
        // Arrange
        const movieWithoutRating = { ...mockMovie, userRating: undefined };
        mockMovieService.getMovieById.and.returnValue(of(movieWithoutRating));

        // Act
        fixture.detectChanges();

        // Assert
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain("Your Rating:");
        expect(compiled.textContent).toContain("Not rated.");
    });

    it("should display \"Not watched yet.\" for empty watched dates", () => {
        // Arrange
        const movieWithoutWatchedDates = { ...mockMovie, watchedDates: [] };
        mockMovieService.getMovieById.and.returnValue(of(movieWithoutWatchedDates));

        // Act
        fixture.detectChanges();

        // Assert
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain("Watched On:");
        expect(compiled.textContent).toContain("Not watched yet.");
    });

    it("should display poster placeholder when posterUrl is missing", () => {
        // Arrange
        const movieWithoutPoster = { ...mockMovie, posterUrl: undefined };
        mockMovieService.getMovieById.and.returnValue(of(movieWithoutPoster));

        // Act
        fixture.detectChanges();

        // Assert
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector("img")?.getAttribute("src")).toBe("assets/images/PlaceholderMoviePoster.png");
    });
});