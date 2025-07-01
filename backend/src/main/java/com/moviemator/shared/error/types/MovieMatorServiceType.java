package com.moviemator.shared.error.types;

public enum MovieMatorServiceType {
    MOVIE_MATOR_MAIN;

    @Override
    public String toString() {
        return switch (this) {
            case MOVIE_MATOR_MAIN -> "MovieMator Main Service";
        };
    }
}
