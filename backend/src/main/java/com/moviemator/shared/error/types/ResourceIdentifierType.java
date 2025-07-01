package com.moviemator.shared.error.types;

public enum ResourceIdentifierType {
    ID,
    USER_ID,
    USERNAME,
    EMAIL,
    TITLE;

    @Override
    public String toString() {
        return switch (this) {
            case ID -> "ID";
            case USER_ID -> "User ID";
            case USERNAME -> "Username";
            case EMAIL -> "Email";
            case TITLE -> "Title";
        };
    }
}
