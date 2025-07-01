package com.moviemator.shared.error.types;

public class ValidationException extends RuntimeException {

    public ValidationException(String message) {
        super("Validation error: " + message);
    }
}
