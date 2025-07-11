export interface TmdbMovieResult {
    id: number;
    title: string;
    release_date?: string;
    poster_path?: string;
    overview?: string;
    genre_ids?: number[];
}

export interface TmdbMovieDetails extends TmdbMovieResult {
    runtime?: number;
    genres?: MovieGenre[];
}

export interface MovieGenre {
    id: number;
    name: string;
}

export interface TmdbMovieCredits {
    cast: { name: string }[];
    crew: MovieCrewMember[];
}

export interface MovieCrewMember {
    job: string;
    name: string;
}