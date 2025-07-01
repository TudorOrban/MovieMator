package com.moviemator.shared.error.types;

public enum ResourceType {
    USER,
    MOVIE;

    @Override
    public String toString() {
        return switch (this) {
            case USER -> "User";
            case MOVIE -> "Movie";
        };
    }
}
